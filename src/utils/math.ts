export function divBigint(numerator: bigint, denominator: bigint, decimals: number = 6): string {
  if (denominator === 0n) throw new Error("division by zero");

  const factor = 10n ** BigInt(decimals);

  const scaled = numerator * factor;
  const integer = scaled / denominator;

  const intStr = integer.toString();

  if (decimals === 0) return intStr;

  const pad = intStr.padStart(decimals + 1, "0");
  const whole = pad.slice(0, -decimals);
  const fraction = pad.slice(-decimals);

  const fractionTrimmed = fraction.replace(/0+$/, "");

  return fractionTrimmed ? `${whole}.${fractionTrimmed}` : whole;
}