import { abisMap, chainsMap } from '../utils/index';
import { createPublicClient, http, getContract } from 'viem';
import networks from '../config/networks.json';
import hub from '../config/main/hub';

export function getAssetsData(hubChain: string, chains: string[], options: any = {}): Object {

  // connect
  const publicClient = createPublicClient({
    chain: chainsMap[hubChain],
    transport: http(options.url ?? networks[hubChain as keyof typeof networks].url)
  });

  // contract
  const pool = getContract({abi: abisMap["Pool"], address: hub[hubChain as keyof typeof hub].Pool as `0x{string}`, client: publicClient});
  const rateModel = getContract({abi: abisMap["DefaultReserveInterestRateStrategyV2"], address: hub[hubChain as keyof typeof hub].DefaultReserveInterestRateStrategyV2 as `0x{string}`, client: publicClient});
  const oracle = getContract({abi: abisMap["PriceOracle"], address: hub[hubChain as keyof typeof hub].PriceOracle as `0x{string}`, client: publicClient});

  // create object
  let assets: Record<string, any> = {}

  for (let chain of chains) {
    
  }

  return assets
}