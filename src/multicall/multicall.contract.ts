import { PublicClient, createPublicClient, http, getContract } from "viem"; 
import { chain, EVM } from '../config/chain';
import { EVMOptions } from '../config/evm/contract.evm';
import multicallAbi from './Multicall.abi';
import { multicallAddress } from './multicall.address';

const publicClient = (chainType: EVM, options: EVMOptions = {}): PublicClient => createPublicClient({
  chain: chain[chainType].viem,
  transport: http(options.rpc ? options.rpc : chain[chainType].rpc)
})

export const multicall = (chainType: EVM, options: EVMOptions = {}) => getContract({
  address: multicallAddress[chainType] as `0x{string}`,
  abi: multicallAbi,
  client: publicClient(chainType, options)
})