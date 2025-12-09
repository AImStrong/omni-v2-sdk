import { createPublicClient, http, getContract } from 'viem';
import { chainsMap } from '../utils/index';
import { abisMap } from '../utils/index';
import networks from '../config/networks.json';
import client from '../config/main/client';

export function getClientContracts(clientChain: string, options: any = {}): Object {

  // connect
  const publicClient = createPublicClient({
    chain: chainsMap[clientChain],
    transport: http(options.url ?? networks[clientChain as keyof typeof networks].url)
  });

  // util
  const contract = (name: string): any => ({abi: abisMap[name], address: ((client as any)[clientChain] as any)[name], client: publicClient});
  
  // create object
  let clientDetails: Record<string, any> = {};

  // get contract
  clientDetails.AddressesProvider = getContract(contract("AddressesProvider"));
  clientDetails.Client = getContract(contract("Client"));
  clientDetails.ClientVault = getContract(contract("ClientVault"));
  clientDetails.Message = getContract(contract("Message"));
  clientDetails.GasFund = getContract(contract("GasFund"));

  return clientDetails; 
}