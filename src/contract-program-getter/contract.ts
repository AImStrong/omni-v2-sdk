import { getContract, createPublicClient, http } from 'viem';
import { chain, EVM } from '../config/chain';
import erc20Artifact from '../config/evm/abis/IERC20.json';

const publicClient = (chainType: EVM, rpc?: string) => createPublicClient({
  chain: chain[chainType].viem,
  transport: http(rpc ? rpc : chain[chainType].rpc)
})

export const token = (chainType: EVM, address: `0x{string}`, rpc?: string) => getContract({
  abi: erc20Artifact.abi,
  address: address,
  client: publicClient(chainType, rpc)
})