import { ContractEVM } from "../../config/evm/contract.evm";
import { ProgramSolana } from "../../config/solana/program.solana";
import assets from '../../config/assets/assets.asset';
import omniAssets from '../../config/assets/omni_assets.asset';
import { Chain, EVM, Solana, chainConfig } from "../../config/chain";
import { bytes32ToAddress, convertToBytes32, divBigint } from "../../utils";
import { decodeAbiParameters, encodeFunctionData, parseSignature } from "viem";
import erc20Abi from '../../config/evm/abis/ERC20PermitMock.abi';
import { createAssociatedTokenAccountInstruction, createTransferInstruction, getAccount, getMint } from "@solana/spl-token";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { Provider } from "@coral-xyz/anchor";
import { decodeConfiguration } from "../pool";

interface AssetDetailsInterface {
  id: number;
  name: string;
  symbol: string;
  decimals: number;
  address: string;
  omniAssetAddress: `0x${string}`;
  aTokenAddress: `0x${string}`;
  variableDebtTokenAddress: `0x${string}`;
  priceRaw: bigint;
  ltv: number;
  liquidationThreshold: number;
  liquidationBonus: number;
  reserveFactor: number;
  optimalUsageRatio: number;
  baseBorrowRate: number;
  slope1: number;
  slope2: number;
  totalSupplyRaw: bigint;
  totalBorrowRaw: bigint;
  availableLiquidityRaw: bigint;
  supplyRateRaw: bigint;
  borrowRateRaw: bigint;
}

interface BalanceInterface {
  balanceRaw: bigint;
  balance: number;
}

interface AllowanceInterface {
  allowanceRaw: bigint;
  allowance: number;
}

interface ERC20PermitInterface {
  deadline: bigint;
  permitV: number;
  permitR: `0x${string}`;
  permitS: `0x${string}`
}

export class Asset {
  public contract: ContractEVM;
  public program: ProgramSolana;

  constructor(__contract__: ContractEVM, __program__: ProgramSolana) {
    this.contract = __contract__;
    this.program = __program__
  }

  public getAddressesList(chains: Chain[]): Record<string, string[]> {
    let assetsList: Record<string, string[]> = {};
    for (const ccc of chains) {
      const chainAssets: string[] = [];
      for (const [key, value] of Object.entries(assets[ccc])) chainAssets.push(value.address);
      assetsList[ccc] = chainAssets;
    }
    return assetsList;
  }

  public async getAssetDetails(hubChain: EVM, originChain: Chain, assetAddress: string): Promise<AssetDetailsInterface> {
    const priceOracleContract = this.contract.priceOracle(hubChain);
    const poolContract = this.contract.pool(hubChain);
    const assetManagerContract = this.contract.assetManager(hubChain);
    const rateModelContract = this.contract.rateModel(hubChain);
    const multicallContract = this.contract.multicall(hubChain);
    const asset = Object.values(assets[originChain]).find(value => value.address.toLowerCase() == assetAddress.toLowerCase());

    const omniAssetAddress: `0x${string}` = await assetManagerContract.read.getAsset([chainConfig[originChain].id, convertToBytes32(assetAddress)]) as `0x${string}`;

    const data: any = await multicallContract.read.read([[
      {
        to: poolContract.address,
        value: 0,
        data: encodeFunctionData({ abi: poolContract.abi, functionName: "getReserveData", args: [omniAssetAddress] })
      },
      {
        to: priceOracleContract.address,
        value: 0,
        data: encodeFunctionData({ abi: priceOracleContract.abi, functionName: "getAssetPrice", args: [omniAssetAddress] })
      },
      {
        to: rateModelContract.address,
        value: 0,
        data: encodeFunctionData({ abi: rateModelContract.abi, functionName: "getInterestRateData", args: [omniAssetAddress] })
      }
    ]]);

    const decodedReserve = this.contract.decodeMulticallData(data[0]);
    const decodedRateData = this.contract.decodeMulticallData(data[2]);

    const id: number = Number(decodedReserve[7]);
    const configuration = decodeConfiguration(BigInt(decodedReserve[0]));
    const aToken: `0x${string}` = bytes32ToAddress(decodedReserve[8]);
    const debtToken: `0x${string}` = bytes32ToAddress(decodedReserve[10]);

    const balanceData: any = await multicallContract.read.read([[
      {
        to: aToken,
        value: 0,
        data: encodeFunctionData({ abi: erc20Abi, functionName: 'totalSupply', args: [] })
      },
      {
        to: debtToken,
        value: 0,
        data: encodeFunctionData({ abi: erc20Abi, functionName: 'totalSupply', args: [] })
      },
      {
        to: omniAssetAddress,
        value: 0,
        data: encodeFunctionData({ abi: erc20Abi, functionName: 'balanceOf', args: [aToken] })
      }
    ]])

    return {
      id: id,
      name: asset!.name,
      symbol: asset!.symbol,
      decimals: asset!.decimals,
      address: assetAddress,
      omniAssetAddress: omniAssetAddress,
      aTokenAddress: aToken,
      variableDebtTokenAddress: debtToken,
      priceRaw: BigInt(data[1]),
      ltv: parseFloat(divBigint(BigInt(configuration.ltv), 10n ** 4n, 4)),
      liquidationThreshold: parseFloat(divBigint(BigInt(configuration.liquidationThreshold), 10n ** 4n, 4)),
      liquidationBonus: parseFloat(divBigint(BigInt(configuration.liquidationBonus), 10n ** 4n, 4)),
      reserveFactor: parseFloat(divBigint(BigInt(configuration.reserveFactor), 10n ** 4n, 4)),
      optimalUsageRatio: parseFloat(divBigint(BigInt(decodedRateData[0]), 10n ** 27n, 4)),
      baseBorrowRate: parseFloat(divBigint(BigInt(decodedRateData[1]), 10n ** 27n, 4)),
      slope1: parseFloat(divBigint(BigInt(decodedRateData[2]), 10n ** 27n, 4)),
      slope2: parseFloat(divBigint(BigInt(decodedRateData[3]), 10n ** 27n, 4)),
      totalSupplyRaw: BigInt(balanceData[0]),
      totalBorrowRaw: BigInt(balanceData[1]),
      availableLiquidityRaw: BigInt(balanceData[2]),
      supplyRateRaw: BigInt(decodedReserve[2]),
      borrowRateRaw: BigInt(decodedReserve[4])
    }
  }

  public async getListDetails(hubChain: EVM, chains: Chain[]): Promise<Record<string, Record<string, AssetDetailsInterface>>> {
    let assetsList: Record<string, Record<string, AssetDetailsInterface>> = {};
    const priceOracleContract = this.contract.priceOracle(hubChain);
    const poolContract = this.contract.pool(hubChain);
    const rateModelContract = this.contract.rateModel(hubChain);
    const multicallContract = this.contract.multicall(hubChain);

    const dataToCall = [];

    for (const ccc of chains) {
      for (const [key, value] of Object.entries(assets[ccc])) {

        const omniAssetAddress: `0x${string}` = (omniAssets[ccc] as any)[key].omniAsset;
        const aToken: `0x${string}` = (omniAssets[ccc] as any)[key].aToken;
        const debtToken: `0x${string}` = (omniAssets[ccc] as any)[key].variableDebtToken;

        dataToCall.push(...[
          {
            to: priceOracleContract.address,
            value: 0,
            data: encodeFunctionData({ abi: priceOracleContract.abi, functionName: "getAssetPrice", args: [omniAssetAddress] })
          },
          {
            to: aToken,
            value: 0,
            data: encodeFunctionData({ abi: erc20Abi, functionName: "totalSupply", args: [] })
          },
          {
            to: debtToken,
            value: 0,
            data: encodeFunctionData({ abi: erc20Abi, functionName: "totalSupply", args: [] })
          },
          {
            to: omniAssetAddress,
            value: 0,
            data: encodeFunctionData({ abi: erc20Abi, functionName: "balanceOf", args: [aToken] })
          },
          {
            to: poolContract.address,
            value: 0,
            data: encodeFunctionData({ abi: poolContract.abi, functionName: "getReserveData", args: [omniAssetAddress] })
          },
          {
            to: rateModelContract.address,
            value: 0,
            data: encodeFunctionData({ abi: rateModelContract.abi, functionName: "getInterestRateData", args: [omniAssetAddress] })
          }
        ]);
      }
    }

    const data: any = await multicallContract.read.read([dataToCall]);
    let dataId = 0;

    for (const ccc of chains) {
      const chainAssets: Record<string, AssetDetailsInterface> = {};
      for (const [key, value] of Object.entries(assets[ccc])) {

        const omniAssetAddress: `0x${string}` = (omniAssets[ccc] as any)[key].omniAsset;
        const aToken: `0x${string}` = (omniAssets[ccc] as any)[key].aToken;
        const debtToken: `0x${string}` = (omniAssets[ccc] as any)[key].variableDebtToken;

        const totalSupplyRaw: bigint = BigInt(data[dataId + 1]);
        const totalBorrowRaw: bigint = BigInt(data[dataId + 2]);
        const availableLiquidityRaw: bigint = BigInt(data[dataId + 3]);
        const decodedReserve = this.contract.decodeMulticallData(data[dataId + 4]);
        const decodedRateData = this.contract.decodeMulticallData(data[dataId + 5]);

        const id: number = Number(decodedReserve[7]);
        const configuration = decodeConfiguration(BigInt(decodedReserve[0]));

        const asset: AssetDetailsInterface = {
          id: id,
          name: value.name,
          symbol: value.symbol,
          decimals: value.decimals,
          address: value.address,
          omniAssetAddress: omniAssetAddress,
          aTokenAddress: aToken,
          variableDebtTokenAddress: debtToken,
          priceRaw: BigInt(data[dataId]),
          ltv: parseFloat(divBigint(BigInt(configuration.ltv), 10n ** 4n, 4)),
          liquidationThreshold: parseFloat(divBigint(BigInt(configuration.liquidationThreshold), 10n ** 4n, 4)),
          liquidationBonus: parseFloat(divBigint(BigInt(configuration.liquidationBonus), 10n ** 4n, 4)),
          reserveFactor: parseFloat(divBigint(BigInt(configuration.reserveFactor), 10n ** 4n, 4)),
          optimalUsageRatio: parseFloat(divBigint(BigInt(decodedRateData[0]), 10n ** 27n, 4)),
          baseBorrowRate: parseFloat(divBigint(BigInt(decodedRateData[1]), 10n ** 27n, 4)),
          slope1: parseFloat(divBigint(BigInt(decodedRateData[2]), 10n ** 27n, 4)),
          slope2: parseFloat(divBigint(BigInt(decodedRateData[3]), 10n ** 27n, 4)),
          totalSupplyRaw: totalSupplyRaw,
          totalBorrowRaw: totalBorrowRaw,
          availableLiquidityRaw: availableLiquidityRaw,
          supplyRateRaw: BigInt(decodedReserve[2]),
          borrowRateRaw: BigInt(decodedReserve[4])
        }

        dataId += 6;

        chainAssets[key] = asset;
      }

      assetsList[ccc] = chainAssets;
    }

    return assetsList;
  }

  public async balanceOfEVM(chain: EVM, assetAddress: `0x${string}`, user: `0x${string}`): Promise<BalanceInterface> {
    const data: any = await this.contract.multicall(chain).read.read([[
      {
        to: assetAddress,
        value: 0,
        data: encodeFunctionData({ abi: erc20Abi, functionName: 'decimals', args: [] })
      },
      {
        to: assetAddress,
        value: 0,
        data: encodeFunctionData({ abi: erc20Abi, functionName: 'balanceOf', args: [user] })
      }
    ]])
    const decimals = Number(data[0]);
    const balanceRaw = BigInt(data[1]);
    return {
      balanceRaw: balanceRaw,
      balance: parseFloat(divBigint(balanceRaw, 10n ** BigInt(decimals)))
    }
  }

  public async balanceOfSolana(chain: Solana, assetAddress: string, user: string): Promise<BalanceInterface> {
    try {
      const mint_info = await getMint(this.program.config[chain]!.connection!, new PublicKey(assetAddress));
      const account = await getAccount(this.program.config[chain]!.connection!, this.program.pda.ata(new PublicKey(assetAddress), new PublicKey(user), false));
      const balanceRaw = account.amount;
      return {
        balanceRaw: balanceRaw,
        balance: parseFloat(divBigint(balanceRaw, 10n ** BigInt(mint_info.decimals)))
      }
    } catch {
      return {
        balanceRaw: 0n,
        balance: 0
      }
    }
  }

  public async allowanceEVM(chain: EVM, assetAddress: `0x${string}`, owner: `0x${string}`, spender: `0x${string}`): Promise<AllowanceInterface> {
    const data: any = await this.contract.multicall(chain).read.read([[
      {
        to: assetAddress,
        value: 0,
        data: encodeFunctionData({ abi: erc20Abi, functionName: 'decimals', args: [] })
      },
      {
        to: assetAddress,
        value: 0,
        data: encodeFunctionData({ abi: erc20Abi, functionName: 'allowance', args: [owner, spender] })
      }
    ]])
    const decimals = Number(data[0]);
    const allowanceRaw = BigInt(data[1]);
    return {
      allowanceRaw: allowanceRaw,
      allowance: parseFloat(divBigint(allowanceRaw, 10n ** BigInt(decimals)))
    }
  }

  public async isERC20Permit(chain: EVM, assetAddress: `0x${string}`): Promise<boolean> {
    try {
      await this.contract.token(chain, assetAddress).read.DOMAIN_SEPARATOR();
      return true;
    } catch (error) {
      return false;
    }
  }

  public async signERC20Permit(chain: EVM, assetAddress: `0x${string}`, spender: `0x${string}`, amount: bigint, wallet: any): Promise<ERC20PermitInterface | null> {
    try {
      await this.contract.token(chain, assetAddress).read.DOMAIN_SEPARATOR();
    } catch (error) {
      return null;
    }

    const token = this.contract.token(chain, assetAddress);
    const chainId = chainConfig[chain].id;

    const data: any = await this.contract.multicall(chain).read.read([[
      {
        to: token.address,
        value: 0,
        data: encodeFunctionData({abi: token.abi, functionName: "name", args: []})
      },
      {
        to: token.address,
        value: 0,
        data: encodeFunctionData({abi: token.abi, functionName: "nonces", args: [wallet.account.address]})
      }
    ]]);

    const name: string = decodeAbiParameters([{ type: 'string' }], data[0])[0];
    const nonce: bigint = BigInt(data[1]);

    const deadline = Math.floor(Date.now() / 1000) + 3600;

    const domain = {
      name: name,
      version: "1",
      chainId: chainId,
      verifyingContract: token.address,
    };

    const types = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };

    const message = {
      owner: wallet.account.address,
      spender: spender,
      value: amount,
      nonce,
      deadline
    };

    const signature = await wallet.signTypedData({
      account: wallet.account,
      domain: domain as any,
      types: types,
      primaryType: "Permit",
      message: message,
    });

    const { v, r, s } = parseSignature(signature);

    return {
      deadline: BigInt(deadline),
      permitV: Number(v)!,
      permitR: r,
      permitS: s
    }
  }

  public async approveEVM(chain: EVM, assetAddress: `0x${string}`, spender: `0x${string}`, amount: bigint, wallet: any): Promise<`0x${string}`> {
    return await this.contract.writeContract(chain, assetAddress, erc20Abi, "approve", [spender, amount], 0n, wallet);
  }

  public async transferEVM(chain: EVM, assetAddress: `0x${string}`, to: `0x${string}`, amount: bigint, wallet: any): Promise<`0x${string}`> {
    return await this.contract.writeContract(chain, assetAddress, erc20Abi, "transfer", [to, amount], 0n, wallet);
  }

  public async transferSolana(chain: Solana, assetAddress: string, to: string, amount: bigint, provider: Provider): Promise<string> {
    const fromAta = this.program.pda.ata(new PublicKey(assetAddress), provider.publicKey!, false);
    const toAta = this.program.pda.ata(new PublicKey(assetAddress), new PublicKey(to), false);
    const ixs: TransactionInstruction[] = [];
    if (!(await this.program.config[chain]!.connection!.getAccountInfo(fromAta))) {
      ixs.push(createAssociatedTokenAccountInstruction(
        provider.publicKey!,
        fromAta,
        provider.publicKey!,
        new PublicKey(assetAddress)
      ))
    }
    if (!(await this.program.config[chain]!.connection!.getAccountInfo(toAta))) {
      ixs.push(createAssociatedTokenAccountInstruction(
        provider.publicKey!,
        toAta,
        new PublicKey(to),
        new PublicKey(assetAddress)
      ))
    }
    ixs.push(createTransferInstruction(fromAta, toAta, provider.publicKey!, amount));

    return await this.program.sendAndConfirm(ixs, provider);
  }

  public async balancesEVM(chain: EVM, assets: `0x${string}`[], users: `0x${string}`[]): Promise<BalanceInterface[]> {
    const multicallContract = this.contract.multicall(chain);
    const callData: any[] = [];
    for (let i = 0; i < assets.length; i++) {
      callData.push({
        to: assets[i],
        value: 0,
        data: encodeFunctionData({abi: erc20Abi, functionName: 'balanceOf', args: [users[i]]})
      })
    };
    for (let i = 0; i < assets.length; i++) {
      callData.push({
        to: assets[i],
        value: 0,
        data: encodeFunctionData({abi: erc20Abi, functionName: 'decimals', args: []})
      })
    };
    const data: any = await multicallContract.read.read([callData]);
    const balances: BalanceInterface[] = [];
    for (let i = 0; i < assets.length; i++) {
      balances.push({
        balanceRaw: BigInt(data[i]),
        balance: parseFloat(divBigint(BigInt(data[i]), 10n**BigInt(data[i+assets.length])))
      });
    } 
    return balances;
  }
}