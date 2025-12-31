import { createWalletClient, http } from 'viem';
import { OmniV2SDK } from './omni_v2_sdk';
import { sepolia } from 'viem/chains';
import { chainConfig } from './config/chain';
import { privateKeyToAccount } from 'viem/accounts';

async function main() {
  const sdk = new OmniV2SDK();
  console.log(await sdk.asset.getListDetails("sepolia", ["sepolia"]))
}

main().then().catch(err => console.log(err));