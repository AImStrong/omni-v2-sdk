import { isRequestLinking, isRequestUnlinking } from './hub/link';

async function main() {

  console.log(await isRequestLinking("sepolia", "evm", "0x86A36A5baAa5C60036e758CAa1a4dAd32E6a5af4", "solanaDevnet", "L2a8G9ChYseNtPQv6G5ZMLg6mpVQB9Pi7WiaL3317Rd"));
  // console.log(await isRequestUnlinking("sepolia", "evm", "0x86A36A5baAa5C60036e758CAa1a4dAd32E6a5af4"))

  
  // await provider.connection.confirmTransaction(setAccountSolana, "finalized");
}

main().then().catch(err => console.log(err));