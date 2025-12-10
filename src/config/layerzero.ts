import { PublicKey } from "@solana/web3.js"
import { Chain } from './chain.js';

export interface Endpoint {
  endpoint: `0x{string}` | PublicKey;
  eid: number;
  sendLib?: PublicKey;
  executor?: PublicKey;
}

export const endpoints: Record<Chain, Endpoint> = {
  sepolia: {
    endpoint: "0x6EDCE65403992e310A62460808c4b910D972f10f" as `0x{string}`,
    eid: 40161
  },
  bscTestnet: {
    endpoint: "0x6EDCE65403992e310A62460808c4b910D972f10f" as `0x{string}`,
    eid: 40102
  },
  arbitrum: {
    endpoint: "0x1a44076050125825900e736c501f859c50fE728c" as `0x{string}`,
    eid: 30110
  },
  base: {
    endpoint: "0x1a44076050125825900e736c501f859c50fE728c" as `0x{string}`,
    eid: 30184
  },
  bsc: {
    endpoint: "0x1a44076050125825900e736c501f859c50fE728c" as `0x{string}`,
    eid: 30102
  },
  solana: {
    endpoint: new PublicKey("76y77prsiCMvXMjuoZ5VRrhG5qYBrUMYTE5WgHqgjEn6"),
    eid: 30168,
    sendLib: new PublicKey("7a4WjyR8VZ7yZz5XJAKm39BUGn5iT9CKcv2pmG9tdXVH"),
    executor: new PublicKey("6doghB248px58JSSwG4qejQ46kFMW4AMj7vzJnWZHNZn")
  },
  solanaDevnet: {
    endpoint: new PublicKey("76y77prsiCMvXMjuoZ5VRrhG5qYBrUMYTE5WgHqgjEn6"),
    eid: 40168,
    sendLib: new PublicKey("7a4WjyR8VZ7yZz5XJAKm39BUGn5iT9CKcv2pmG9tdXVH"),
    executor: new PublicKey("6doghB248px58JSSwG4qejQ46kFMW4AMj7vzJnWZHNZn")
  }
}