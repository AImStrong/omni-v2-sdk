import { getContract, createPublicClient, http } from 'viem';
import { chain, EVM } from '../chain.ts';
import clientConfig from './main/client.json';
import hubConfig from './main/hub.json';
import erc20Abi from './abis/ERC20PermitMock.abi.json';
import clientAbi from './abis/Client.abi.json';
import clientVaultAbi from './abis/ClientVault.abi.json';
import messageAbi from './abis/Message.abi.json';
import hubAbi from './abis/Hub.abi.json';
import accountManagerAbi from './abis/AccountManager.abi.json';
import assetManagerAbi from './abis/AssetManager.abi.json';
import poolAbi from './abis/Pool.abi.json';
import priceOracleAbi from './abis/IPriceOracleGetter.abi.json';
import rateModelAbi from './abis/DefaultReserveInterestRateStrategyV2.abi.json';

export interface EVMOptions {
  rpc?: string;
  wallet?: any;
}

const publicClient = (chainType: EVM, options: EVMOptions = {}) => createPublicClient({
  chain: chain[chainType].viem,
  transport: http(options.rpc ? options.rpc : chain[chainType].rpc)
})

export const token = (chainType: EVM, address: `0x{string}`, options: EVMOptions = {}): any => getContract({
  abi: erc20Abi,
  address: address,
  client: options.wallet?options.wallet:publicClient(chainType, options)
})

export const client = (chainType: EVM, options: EVMOptions = {}): any => getContract({
  abi: clientAbi,
  address: clientConfig[chainType as keyof typeof clientConfig].Client as `0x{string}`,
  client: options.wallet?options.wallet:publicClient(chainType, options)
})

export const clientVault = (chainType: EVM, options: EVMOptions = {}): any => getContract({
  abi: clientVaultAbi,
  address: clientConfig[chainType as keyof typeof clientConfig].ClientVault as `0x{string}`,
  client: options.wallet?options.wallet:publicClient(chainType, options)
})

export const clientMessage = (chainType: EVM, options: EVMOptions = {}): any => getContract({
  abi: messageAbi,
  address: clientConfig[chainType as keyof typeof clientConfig].Message as `0x{string}`,
  client: options.wallet?options.wallet:publicClient(chainType, options)
})

export const hub = (chainType: EVM, options: EVMOptions = {}): any => getContract({
  abi: hubAbi,
  address: hubConfig[chainType as keyof typeof hubConfig].Hub as `0x{string}`,
  client: options.wallet?options.wallet:publicClient(chainType, options)
})

export const accountManager = (chainType: EVM, options: EVMOptions = {}): any => getContract({
  abi: accountManagerAbi,
  address: hubConfig[chainType as keyof typeof hubConfig].AccountManager as `0x{string}`,
  client: options.wallet?options.wallet:publicClient(chainType, options)
})

export const assetManager = (chainType: EVM, options: EVMOptions = {}): any => getContract({
  abi: assetManagerAbi,
  address: hubConfig[chainType as keyof typeof hubConfig].AssetManager as `0x{string}`,
  client: options.wallet?options.wallet:publicClient(chainType, options)
})

export const hubMessage = (chainType: EVM, options: EVMOptions = {}): any => getContract({
  abi: messageAbi,
  address: hubConfig[chainType as keyof typeof hubConfig].Message as `0x{string}`,
  client: options.wallet?options.wallet:publicClient(chainType, options)
})

export const pool = (chainType: EVM, options: EVMOptions = {}): any => getContract({
  abi: poolAbi,
  address: hubConfig[chainType as keyof typeof hubConfig].Pool as `0x{string}`,
  client: options.wallet?options.wallet:publicClient(chainType, options)
})

export const priceOracle = (chainType: EVM, options: EVMOptions = {}): any => getContract({
  abi: priceOracleAbi,
  address: hubConfig[chainType as keyof typeof hubConfig].PriceOracle as `0x{string}`,
  client: options.wallet?options.wallet:publicClient(chainType, options)
})

export const rateModel = (chainType: EVM, options: EVMOptions = {}): any => getContract({
  abi: rateModelAbi,
  address: hubConfig[chainType as keyof typeof hubConfig].DefaultReserveInterestRateStrategyV2 as `0x{string}`,
  client: options.wallet?options.wallet:publicClient(chainType, options)
})