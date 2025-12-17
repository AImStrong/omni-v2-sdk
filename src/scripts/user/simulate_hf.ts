import { maxUint256 } from 'viem';

export function simulateHFSupply(
  totalCollateralBaseRaw: bigint,
  totalDebtBaseRaw: bigint,
  currentLiquidationThresholdRaw: bigint,
  healthFactorRaw: bigint,
  liquidationThreshold: number,
  supplyBalanceRaw: bigint,
  supplyAmountRaw: bigint,
  priceRaw: bigint,
  usingAsCollateral: boolean,
  decimals: number
): bigint {
  if (supplyBalanceRaw == 0n) usingAsCollateral = true;

  if (
    totalDebtBaseRaw == 0n ||
    !usingAsCollateral ||
    priceRaw == 0n ||
    liquidationThreshold == 0
  ) return healthFactorRaw;

  const liquidationThresholdRaw: bigint = BigInt(liquidationThreshold * 10 ** 4);
  const supplyValueRaw: bigint = supplyAmountRaw * priceRaw / (10n ** BigInt(decimals));
  const newCollateralRaw: bigint = totalCollateralBaseRaw + supplyValueRaw;
  const newLiquidationThresholdRaw: bigint = (totalCollateralBaseRaw * currentLiquidationThresholdRaw + supplyValueRaw * liquidationThresholdRaw) / newCollateralRaw;

  return newCollateralRaw * newLiquidationThresholdRaw * 10n ** 14n / totalDebtBaseRaw;
}

export function simulateHFWithdraw(
  totalCollateralBaseRaw: bigint,
  totalDebtBaseRaw: bigint,
  currentLiquidationThresholdRaw: bigint,
  healthFactorRaw: bigint,
  liquidationThreshold: number,
  supplyBalanceRaw: bigint,
  withdrawAmountRaw: bigint,
  priceRaw: bigint,
  usingAsCollateral: boolean,
  decimals: number
): bigint {
  if (withdrawAmountRaw > supplyBalanceRaw) withdrawAmountRaw = supplyBalanceRaw;

  if (
    totalDebtBaseRaw == 0n ||
    !usingAsCollateral ||
    priceRaw == 0n ||
    liquidationThreshold == 0
  ) return healthFactorRaw;

  const liquidationThresholdRaw: bigint = BigInt(liquidationThreshold * 10 ** 4);
  const withdrawValueRaw: bigint = withdrawAmountRaw * priceRaw / (10n ** BigInt(decimals));
  const newCollateralRaw: bigint = totalCollateralBaseRaw - withdrawValueRaw;
  const newLiquidationThresholdRaw: bigint = (totalCollateralBaseRaw * currentLiquidationThresholdRaw - withdrawValueRaw * liquidationThresholdRaw) / newCollateralRaw;

  return newCollateralRaw * newLiquidationThresholdRaw * 10n ** 14n / totalDebtBaseRaw;
}

export function simulateHFBorrow(
  totalCollateralBaseRaw: bigint,
  totalDebtBaseRaw: bigint,
  currentLiquidationThresholdRaw: bigint,
  borrowAmountRaw: bigint,
  priceRaw: bigint,
  decimals: number
): bigint {
  const newDebtRaw = totalDebtBaseRaw + borrowAmountRaw * priceRaw / (10n ** BigInt(decimals));
  return totalCollateralBaseRaw * currentLiquidationThresholdRaw * 10n ** 14n / newDebtRaw;
}

export function simulateHFRepay(
  totalCollateralBaseRaw: bigint,
  totalDebtBaseRaw: bigint,
  currentLiquidationThresholdRaw: bigint,
  borrowBalanceRaw: bigint,
  borrowAmountRaw: bigint,
  priceRaw: bigint,
  decimals: number
): bigint {
  if (borrowAmountRaw > borrowBalanceRaw) borrowAmountRaw = borrowBalanceRaw;

  const newDebtRaw = totalDebtBaseRaw - borrowAmountRaw * priceRaw / (10n ** BigInt(decimals));
  if (newDebtRaw == 0n) return maxUint256;

  return totalCollateralBaseRaw * currentLiquidationThresholdRaw * 10n ** 14n / newDebtRaw;
}

export function simulateHFSetAsCollateral(
  totalCollateralBaseRaw: bigint,
  totalDebtBaseRaw: bigint,
  currentLiquidationThresholdRaw: bigint,
  healthFactorRaw: bigint,
  liquidationThreshold: number,
  supplyBalanceRaw: bigint,
  priceRaw: bigint,
  usingAsCollateralCurrent: boolean,
  decimals: number
): bigint {
  if (
    totalDebtBaseRaw == 0n ||
    priceRaw == 0n ||
    liquidationThreshold == 0
  ) return healthFactorRaw;

  const liquidationThresholdRaw: bigint = BigInt(liquidationThreshold * 10 ** 4);

  if (usingAsCollateralCurrent == false) {
    const supplyValueRaw: bigint = supplyBalanceRaw * priceRaw / (10n ** BigInt(decimals));
    const newCollateralRaw: bigint = totalCollateralBaseRaw + supplyValueRaw;
    const newLiquidationThresholdRaw: bigint = (totalCollateralBaseRaw * currentLiquidationThresholdRaw + supplyValueRaw * liquidationThresholdRaw) / newCollateralRaw;

    return newCollateralRaw * newLiquidationThresholdRaw * 10n ** 14n / totalDebtBaseRaw;
  }
  else {
    const withdrawValueRaw: bigint = supplyBalanceRaw * priceRaw / (10n ** BigInt(decimals));
    const newCollateralRaw: bigint = totalCollateralBaseRaw - withdrawValueRaw;
    const newLiquidationThresholdRaw: bigint = (totalCollateralBaseRaw * currentLiquidationThresholdRaw - withdrawValueRaw * liquidationThresholdRaw) / newCollateralRaw;

    return newCollateralRaw * newLiquidationThresholdRaw * 10n ** 14n / totalDebtBaseRaw;
  }
}