import { getContract, createPublicClient, http, PublicClient } from 'viem';
import { chain, EVM } from '../chain.ts';
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

export interface EVMOptions {
  rpc?: string;
}

const publicClient = (chainType: EVM, options: EVMOptions = {}): PublicClient => createPublicClient({
  chain: chain[chainType].viem,
  transport: http(options.rpc ? options.rpc : chain[chainType].rpc)
})

export const token = (chainType: EVM, address: `0x{string}`, options: EVMOptions = {}) => getContract({
  abi: erc20Abi,
  address: address,
  client: publicClient(chainType, options)
})

export const client = (chainType: EVM, options: EVMOptions = {}) => getContract({
  abi: clientAbi,
  address: clientConfig[chainType as keyof typeof clientConfig].Client as `0x{string}`,
  client: publicClient(chainType, options)
})

export const clientVault = (chainType: EVM, options: EVMOptions = {}) => getContract({
  abi: clientVaultAbi,
  address: clientConfig[chainType as keyof typeof clientConfig].ClientVault as `0x{string}`,
  client: publicClient(chainType, options)
})

export const clientMessage = (chainType: EVM, options: EVMOptions = {}) => getContract({
  abi: messageAbi,
  address: clientConfig[chainType as keyof typeof clientConfig].Message as `0x{string}`,
  client: publicClient(chainType, options)
})

export const hub = (chainType: EVM, options: EVMOptions = {}) => getContract({
  abi: hubAbi,
  address: hubConfig[chainType as keyof typeof hubConfig].Hub as `0x{string}`,
  client: publicClient(chainType, options)
})

export const accountManager = (chainType: EVM, options: EVMOptions = {}) => getContract({
  abi: accountManagerAbi,
  address: hubConfig[chainType as keyof typeof hubConfig].AccountManager as `0x{string}`,
  client: publicClient(chainType, options)
})

export const assetManager = (chainType: EVM, options: EVMOptions = {}) => getContract({
  abi: assetManagerAbi,
  address: hubConfig[chainType as keyof typeof hubConfig].AssetManager as `0x{string}`,
  client: publicClient(chainType, options)
})

export const hubMessage = (chainType: EVM, options: EVMOptions = {}) => getContract({
  abi: messageAbi,
  address: hubConfig[chainType as keyof typeof hubConfig].Message as `0x{string}`,
  client: publicClient(chainType, options)
})

export const pool = (chainType: EVM, options: EVMOptions = {}) => getContract({
  abi: poolAbi,
  address: hubConfig[chainType as keyof typeof hubConfig].Pool as `0x{string}`,
  client: publicClient(chainType, options)
})

export const priceOracle = (chainType: EVM, options: EVMOptions = {}) => getContract({
  abi: priceOracleAbi,
  address: hubConfig[chainType as keyof typeof hubConfig].PriceOracle as `0x{string}`,
  client: publicClient(chainType, options)
})

export const rateModel = (chainType: EVM, options: EVMOptions = {}) => getContract({
  abi: rateModelAbi,
  address: hubConfig[chainType as keyof typeof hubConfig].DefaultReserveInterestRateStrategyV2 as `0x{string}`,
  client: publicClient(chainType, options)
})