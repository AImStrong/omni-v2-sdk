import { convertToBytes32, getAssetsList } from './index'; 

async function main() {

  // console.log(await isRequestLinking("sepolia", "evm", "0x86A36A5baAa5C60036e758CAa1a4dAd32E6a5af4", "solanaDevnet", "L2a8G9ChYseNtPQv6G5ZMLg6mpVQB9Pi7WiaL3317Rd"));
  // console.log(await isRequestUnlinking("sepolia", "evm", "0x86A36A5baAa5C60036e758CAa1a4dAd32E6a5af4"))
  // console.log(await isLinker("sepolia", "0x86A36A5baAa5C60036e758CAa1a4dAd32E6a5af4" as `0x{string}`));
  // console.log(await accountManager("sepolia").read.userToSalt([convertToBytes32("L2a8G9ChYseNtPQv6G5ZMLg6mpVQB9Pi7WiaL3317Rd")]));
  // console.log(await isLinked("sepolia", "0x86A36A5baAa5C60036e758CAa1a4dAd32E6a5af4", "L2a8G9ChYseNtPQv6G5ZMLg6mpVQB9Pi7WiaL3317Rd"));
  console.log(await getAssetsList("sepolia", ["sepolia", "bscTestnet", "solanaDevnet"]));
}

main().then().catch(err => console.log(err));