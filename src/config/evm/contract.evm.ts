import { getContract, createPublicClient, http, PublicClient } from 'viem';
import { chainConfig, ChainConfig, EVM } from '../chain.ts';
import clientConfig from './main/client.evm.ts';
import hubConfig from './main/hub.evm.ts';
import erc20Abi from './abis/ERC20PermitMock.abi.ts';
import clientAbi from './abis/Client.abi.ts';
import clientVaultAbi from './abis/ClientVault.abi.ts';
import messageAbi from './abis/Message.abi.ts';
import hubAbi from './abis/Hub.abi.ts';
import accountManagerAbi from './abis/AccountManager.abi.ts';
import assetManagerAbi from './abis/AssetManager.abi.ts';
import poolAbi from './abis/Pool.abi.ts';
import priceOracleAbi from './abis/IPriceOracleGetter.abi.ts';
import rateModelAbi from './abis/DefaultReserveInterestRateStrategyV2.abi.ts';
import multicallAbi from './multicall/Multicall.abi.ts';
import multicallAddress from './multicall/multicall.address.ts';
import { divBigint } from '../../utils/math.ts';

interface BalanceInterface {
  balanceRaw: bigint;
  balance: number;
}

export class ContractEVM {
  public config: Partial<Record<EVM, ChainConfig>> = {};
  public publicClient: Partial<Record<EVM, PublicClient>> = {};

  constructor(newConfig: Partial<Record<EVM, ChainConfig>> = {}) {
    for (let [key, value] of Object.entries(chainConfig)) {
      if (value.rpc) this.config[key as EVM] = value;
    }
    for (let [key, value] of Object.entries(newConfig)) {
      this.config[key as EVM] = value;
    }
    for (let [key, value] of Object.entries(this.config)) {
      if (value.rpc) this.publicClient[key as EVM] = createPublicClient({
        chain: chainConfig[key as EVM].viem,
        transport: http(chainConfig[key as EVM].rpc)
      })
    }
  }

  public token(chain: EVM, address: `0x${string}`) {
    return getContract({
      abi: erc20Abi,
      address: address,
      client: this.publicClient[chain]!,
    })
  }

  public client(chain: EVM) {
    return getContract({
      abi: clientAbi,
      address: (clientConfig[chain as keyof typeof clientConfig] as any).Client as `0x${string}`,
      client: this.publicClient[chain]!,
    })
  }

  public clientVault(chain: EVM) {
    return getContract({
      abi: clientVaultAbi,
      address: (clientConfig[chain as keyof typeof clientConfig] as any).ClientVault as `0x${string}`,
      client: this.publicClient[chain]!,
    })
  }

  public clientMessage(chain: EVM) {
    return getContract({
      abi: messageAbi,
      address: (clientConfig[chain as keyof typeof clientConfig] as any).Message as `0x${string}`,
      client: this.publicClient[chain]!,
    })
  }

  public hub(chain: EVM) {
    return getContract({
      abi: hubAbi,
      address: (hubConfig[chain as keyof typeof hubConfig] as any).Hub as `0x${string}`,
      client: this.publicClient[chain]!,
    })
  }

  public accountManager(chain: EVM) {
    return getContract({
      abi: accountManagerAbi,
      address: (hubConfig[chain as keyof typeof hubConfig] as any).AccountManager as `0x${string}`,
      client: this.publicClient[chain]!,
    })
  }

  public assetManager(chain: EVM) {
    return getContract({
      abi: assetManagerAbi,
      address: (hubConfig[chain as keyof typeof hubConfig] as any).AssetManager as `0x${string}`,
      client: this.publicClient[chain]!,
    })
  }

  public hubMessage(chain: EVM) {
    return getContract({
      abi: messageAbi,
      address: (hubConfig[chain as keyof typeof hubConfig] as any).Message as `0x${string}`,
      client: this.publicClient[chain]!,
    })
  }

  public pool(chain: EVM) {
    return getContract({
      abi: poolAbi,
      address: (hubConfig[chain as keyof typeof hubConfig] as any).Pool as `0x${string}`,
      client: this.publicClient[chain]!,
    })
  }

  public priceOracle(chain: EVM) {
    return getContract({
      abi: priceOracleAbi,
      address: (hubConfig[chain as keyof typeof hubConfig] as any).PriceOracle as `0x${string}`,
      client: this.publicClient[chain]!,
    })
  }

  public rateModel(chain: EVM) {
    return getContract({
      abi: rateModelAbi,
      address: (hubConfig[chain as keyof typeof hubConfig] as any).DefaultReserveInterestRateStrategyV2 as `0x${string}`,
      client: this.publicClient[chain]!,
    })
  }

  public multicall(chain: EVM) {
    return getContract({
      abi: multicallAbi,
      address: multicallAddress[chain as keyof typeof multicallAddress] as `0x${string}`,
      client: this.publicClient[chain]!,
    })
  }

  public decodeMulticallData(data: `0x${string}`): `0x${string}`[] {
    if (!data.startsWith('0x')) throw new Error("invalid data");
    const hex = data.slice(2);

    if (hex.length % 64 != 0 || !/^[0-9a-fA-F]+$/.test(hex)) throw new Error("invalid data");

    const result: `0x${string}`[] = [];

    for (let i = 0; i < hex.length; i += 64) {
      result.push(`0x${hex.slice(i, i + 64)}`);
    }

    return result;
  }

  public async readContract(chain: EVM, address: `0x${string}`, abi: any, functionName: string, args: any[]) {
    return await this.publicClient[chain]?.readContract({
      address: address,
      abi: abi,
      functionName: functionName,
      args: args,
    })
  }

  public async writeContract(chain: EVM, address: `0x${string}`, abi: any, functionName: string, args: any[], value: bigint, wallet: any) {
    const tx = await wallet.writeContract({
      address: address,
      abi: abi,
      functionName: functionName,
      args: args,
      value: value == 0n ? undefined : value,
    });
    await this.publicClient[chain]?.waitForTransactionReceipt({ hash: tx });
    return tx;
  }

  public async getNativeBalance(chain: EVM, address: `0x${string}`): Promise<BalanceInterface> {
    const balanceRaw = await this.publicClient[chain]!.getBalance({ address: address });
    return {
      balanceRaw: balanceRaw,
      balance: parseFloat(divBigint(balanceRaw, 10n**18n))
    }
  }
}