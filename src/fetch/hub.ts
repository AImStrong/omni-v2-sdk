import { createPublicClient, http, getContract } from 'viem';
import { chainsMap } from '../utils/index';
import { abisMap } from '../utils/index';
import networks from '../config/networks.json';
import hub from '../config/main/hub';

export function getHubContracts(hubChain: string, options: any = {}): Object {

  // connect
  const publicClient = createPublicClient({
    chain: chainsMap[hubChain],
    transport: http(options.url ?? networks[hubChain as keyof typeof networks].url)
  });

  // util
  const contract = (name: string): any => ({abi: abisMap[name], address: ((hub as any)[hubChain] as any)[name], client: publicClient});

  // create object
  let hubDetails: Record<string, any> = {};

  // get contract
  hubDetails.AddressesProvider = getContract(contract("AddressesProvider"));
  hubDetails.Hub = getContract(contract("Hub"));
  hubDetails.AccountManager = getContract(contract("AccountManager"));
  hubDetails.AssetManager = getContract(contract("AssetManager"));
  hubDetails.Message = getContract(contract("Message"));
  hubDetails.GasFund = getContract(contract("GasFund"));
  hubDetails.PoolAddressesProvider = getContract(contract("PoolAddressesProvider"));
  hubDetails.ACLManager = getContract(contract("ACLManager"));
  hubDetails.DefaultReserveInterestRateStrategyV2 = getContract(contract("DefaultReserveInterestRateStrategyV2"));
  hubDetails.Pool = getContract(contract("Pool"));
  hubDetails.PoolConfigurator = getContract(contract("PoolConfigurator"));
  hubDetails.PriceOracle = getContract(contract("PriceOracle"));

  return hubDetails;
}