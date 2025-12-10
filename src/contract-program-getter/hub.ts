import { getContract, createPublicClient, http } from 'viem';
import { chain, EVM } from '../config/chain';
import hubConfig from '../config/evm/main/hub.json';
import hubArtifact from '../config/evm/abis/Hub.json';
import accountManagerArtifact from '../config/evm/abis/AccountManager.json';
import assetManagerArtifact from '../config/evm/abis/AssetManager.json';
import messageArtifact from '../config/evm/abis/Message.json';
import gasFundArtifact from '../config/evm/abis/GasFund.json';
import poolArtifact from '../config/evm/abis/Pool.json';
import priceOracleArtifact from '../config/evm/abis/IPriceOracleGetter.json';

const publicClient = (chainType: EVM, rpc?: string) => createPublicClient({
  chain: chain[chainType].viem,
  transport: http(rpc ? rpc : chain[chainType].rpc)
})

export const hub = (chainType: EVM, rpc?: string) => getContract({
  abi: hubArtifact.abi,
  address: hubConfig[chainType as keyof typeof hubConfig].Hub as `0x{string}`,
  client: publicClient(chainType, rpc)
})

export const accountManager = (chainType: EVM, rpc?: string) => getContract({
  abi: accountManagerArtifact.abi,
  address: hubConfig[chainType as keyof typeof hubConfig].AccountManager as `0x{string}`,
  client: publicClient(chainType, rpc)
})

export const assetManager = (chainType: EVM, rpc?: string) => getContract({
  abi: assetManagerArtifact.abi,
  address: hubConfig[chainType as keyof typeof hubConfig].AssetManager as `0x{string}`,
  client: publicClient(chainType, rpc)
})

export const hubMessage = (chainType: EVM, rpc?: string) => getContract({
  abi: messageArtifact.abi,
  address: hubConfig[chainType as keyof typeof hubConfig].Message as `0x{string}`,
  client: publicClient(chainType, rpc)
})

export const hubGasFund = (chainType: EVM, rpc?: string) => getContract({
  abi: gasFundArtifact.abi,
  address: hubConfig[chainType as keyof typeof hubConfig].GasFund as `0x{string}`,
  client: publicClient(chainType, rpc)
})

export const pool = (chainType: EVM, rpc?: string) => getContract({
  abi: poolArtifact.abi,
  address: hubConfig[chainType as keyof typeof hubConfig].Pool as `0x{string}`,
  client: publicClient(chainType, rpc)
})

export const priceOracle = (chainType: EVM, rpc?: string) => getContract({
  abi: priceOracleArtifact.abi,
  address: hubConfig[chainType as keyof typeof hubConfig].PriceOracle as `0x{string}`,
  client: publicClient(chainType, rpc)
})