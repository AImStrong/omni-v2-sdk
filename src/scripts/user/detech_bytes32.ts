import { bytesToVec, vecToBase58 } from '../../utils/index';

interface EVMOrSolanaInterface {
  address: string;
  chain: "evm"|"solana"
}

export function detechBytes32ToEVMOrSolana(bytes32: `0x{string}`): EVMOrSolanaInterface {
  if (/^0{24}$/i.test(bytes32.slice(2, 2 + 24))) {
    return {
      address: "0x" + bytes32.slice(-40),
      chain: "evm"
    }
  }
  else {
    return {
      address: vecToBase58(bytesToVec(bytes32)),
      chain: "solana"
    }
  }
}