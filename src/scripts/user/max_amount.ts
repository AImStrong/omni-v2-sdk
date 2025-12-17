import { maxUint256 } from 'viem';
import { divBigint } from '../../utils/index';

function min(a: number[]): number {
  let b = a[0];
  for (let i = 1; i < a.length; i++) {
    if (b > a[i]) b = a[i];
  }
  return b;
}

export function getMaxWithdraw(
  totalDebtBaseRaw: bigint,
  healthFactorRaw: bigint,
  supplyBalance: number,
  availableLiquidity: number,
  liquidationThreshold: number,
  priceRaw: bigint,
  usingAsCollateral: boolean
): number {
  const minHF: bigint = 10n**18n + 10n**16n
  if (healthFactorRaw < minHF) return 0;

  if (
    totalDebtBaseRaw == 0n || 
    healthFactorRaw == maxUint256 || 
    !usingAsCollateral || 
    liquidationThreshold == 0 || 
    priceRaw == 0n
  ) return min([supplyBalance, availableLiquidity]);

  const liquidationThresholdRaw: bigint = BigInt(liquidationThreshold * 10**4);

  return min([
    parseFloat(divBigint((healthFactorRaw - minHF) * totalDebtBaseRaw / liquidationThresholdRaw / priceRaw, 10n**14n)),
    supplyBalance,
    availableLiquidity
  ])
}

export function getMaxBorrow(
  availableLiquidity: number,
  availableBorrowsBase: number,
  price: number
): number {
  return min([
    availableLiquidity,
    availableBorrowsBase / price
  ])
}