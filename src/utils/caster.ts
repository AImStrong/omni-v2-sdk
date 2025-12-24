import { stringToBytes, bytesToHex, numberToHex, padHex } from 'viem';
import bs58 from 'bs58';

export function stringToBytes32(str: string): `0x{string}` {
  const bytes = stringToBytes(str);
  if (bytes.length > 32) throw new Error('String too long, cannot convert to bytes32');
  
  const padded = new Uint8Array(32);
  padded.set(bytes);
  return bytesToHex(padded) as `0x{string}`;
}

export function numberToBytes32(n: number): `0x{string}` {
  return padHex(numberToHex(n), { size: 32 }) as `0x{string}`;
}

export function addressToBytes32(address: string): `0x{string}` {
  if (!address.startsWith('0x')) {
    throw new Error('Address must start with 0x');
  }
  const hex = address.slice(2);
  if (hex.length !== 40) {
    throw new Error('Address must be 20 bytes (40 hex chars)');
  }
  if (!/^[0-9a-fA-F]{40}$/.test(hex)) {
    throw new Error('Address contains invalid characters');
  }
  return ('0x' + '0'.repeat(24) + hex.toLowerCase()) as `0x{string}`;
}

export function bytesToVec(str: string): number[] {
  if (str.startsWith("0x")) str = str.slice(2);
  if (str.length % 2 != 0) throw new Error("not bytes");

  const result: number[] = [];
  for (let i = 0; i < str.length; i += 2) {
    const byte = parseInt('0x' + str.slice(i, i + 2));
    result.push(byte);
  }
  return result;
}

export function vecToBytes(vec: number[]): `0x{string}` {
  let result = "";
  for (let i = 0; i < vec.length; i++) {
    if (vec[i] > 255) throw new Error("not vec");
    result = result + vec[i].toString(16).padStart(2, "0");
  }
  return ('0x' + result) as `0x{string}`;
}

export function base58ToVec(bs: string): number[] {
  return Array.from(bs58.decode(bs));
}

export function vecToBase58(vec: number[]): string {
  return bs58.encode(vec);
}

export function bytes32ToAddress(hex: `0x{string}`): `0x{string}` {
  if (!/^0x[0-9a-fA-F]{64}$/.test(hex) || hex.length !== 66) throw new Error("not bytes32");
  return `0x${hex.slice(26)}` as `0x{string}`;
}