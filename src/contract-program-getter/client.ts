import { getContract, createPublicClient, http } from 'viem';
import { chain, EVM } from '../config/chain';
import clientConfig from '../config/evm/main/client.json';
import clientArtifact from '../config/evm/abis/Client.json';
import clientVaultArtifact from '../config/evm/abis/ClientVault.json';
import messageArtifact from '../config/evm/abis/Message.json';
import gasFundArtifact from '../config/evm/abis/GasFund.json';

const publicClient = (chainType: EVM, rpc?: string) => createPublicClient({
  chain: chain[chainType].viem,
  transport: http(rpc ? rpc : chain[chainType].rpc)
})

export const client = (chainType: EVM, rpc?: string) => getContract({
  abi: clientArtifact.abi,
  address: clientConfig[chainType as keyof typeof clientConfig].Client as `0x{string}`,
  client: publicClient(chainType, rpc)
})

export const clientVault = (chainType: EVM, rpc?: string) => getContract({
  abi: clientVaultArtifact.abi,
  address: clientConfig[chainType as keyof typeof clientConfig].ClientVault as `0x{string}`,
  client: publicClient(chainType, rpc)
})

export const clientMessage = (chainType: EVM, rpc?: string) => getContract({
  abi: messageArtifact.abi,
  address: clientConfig[chainType as keyof typeof clientConfig].Message as `0x{string}`,
  client: publicClient(chainType, rpc)
})

export const clientGasFund = (chainType: EVM, rpc?: string) => getContract({
  abi: gasFundArtifact.abi,
  address: clientConfig[chainType as keyof typeof clientConfig].GasFund as `0x{string}`,
  client: publicClient(chainType, rpc)
})