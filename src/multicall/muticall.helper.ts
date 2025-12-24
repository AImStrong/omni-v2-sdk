export function decodeMulticallData(data: `0x{string}`): `0x{string}`[] {
  if (!data.startsWith('0x')) throw new Error("invalid data");
  const hex = data.slice(2);

  if (hex.length % 64 != 0 || !/^[0-9a-fA-F]+$/.test(hex)) throw new Error("invalid data");
  
  const result: `0x{string}`[] = [];

  for (let i = 0; i < hex.length; i += 64) {
    result.push(`0x${hex.slice(i, i + 64)}` as `0x{string}`);
  }

  return result;
}