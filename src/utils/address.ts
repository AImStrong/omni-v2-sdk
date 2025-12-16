import bs58 from "bs58";
import { addressToBytes32, vecToBytes, base58ToVec } from './caster.ts';

export function detechAddressType(addr: string): "evm" | "solana" | "move" {
  if (!addr) throw new Error("cannot detech address");
  if (/^0x[0-9a-fA-F]{40}$/.test(addr)) return "evm";
  if (/^0x[0-9a-fA-F]{1,64}$/.test(addr)) return "move";
  try {
    const decoded = bs58.decode(addr);
    if (decoded.length === 32) return "solana";
  } catch { }

  throw new Error("cannot detech address");
}

export function convertToBytes32(addr: string): `0x{string}` {
  let bytes32: string;
  switch (detechAddressType(addr)) {
    case "evm": bytes32 = addressToBytes32(addr); break;
    case "solana": bytes32 = vecToBytes(base58ToVec(addr)); break;
    case "move": bytes32 = addr; break;
    default: throw new Error("cannot detech asset address");
  }
  return bytes32 as `0x{string}`;
}