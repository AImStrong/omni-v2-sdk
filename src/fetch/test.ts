import { getHubContracts } from './hub';
import { getClientContracts } from './client';

function main() {
  console.log(getHubContracts('sepolia'));
  console.log(getClientContracts('sepolia'));
  console.log(getClientContracts('bscTestnet'));
}

main()