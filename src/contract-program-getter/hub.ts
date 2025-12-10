import { getContract, createPublicClient, http } from 'viem';
import { chain, EVM } from '../config/chain';
import hubConfig from '../config/evm/main/hub.json';
import hubArtifact from '../config/evm/abis/Hub.json';

const publicClient = (chainType: EVM, rpc?: string) => createPublicClient({
  chain: chain[chainType].viem,
  transport: http(rpc ? rpc : chain[chainType].rpc)
})

export const hub = (chainType: EVM, rpc?: string) => getContract({
  abi: hubArtifact.abi,
  address: hubConfig[chainType as keyof typeof hubConfig].Hub as `0x{string}`,
  client: publicClient(chainType, rpc)
})