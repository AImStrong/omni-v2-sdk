import { pool, EVMOptions } from '../../config/evm/contract';
import { EVM } from '../../config/chain';
import { divBigint } from '../../utils/index';

interface DataInterface {
  totalCollateralBase: number;
  totalDebtBase: number;
  availableBorrowsBase: number;
  currentLiquidationThreshold: number;
  ltv: number;
  healthFactorRaw: bigint;
}

export async function getUserData(
  hubChain: EVM,
  account: `0x{string}`,
  options: EVMOptions = {}
): Promise<DataInterface> {
  const data: bigint[] = await pool(hubChain, options).read.getUserAccountData([account]) as bigint[];
  return {
    totalCollateralBase: parseFloat(divBigint(data[0], 10n**8n)),
    totalDebtBase: parseFloat(divBigint(data[1], 10n**8n)),
    availableBorrowsBase: parseFloat(divBigint(data[2], 10n**8n)),
    currentLiquidationThreshold: parseFloat(divBigint(data[3], 10n**4n)),
    ltv: parseFloat(divBigint(data[4], 10n**4n)),
    healthFactorRaw: data[5]
  }
}

export async function getUserConfiguration(
  hubChain: EVM,
  account: `0x{string}`,
  options: EVMOptions = {}
): Promise<bigint> {
  return (await pool(hubChain, options).read.getUserConfiguration([account]) as any).data as bigint;
}

interface UsingAsCollateralOrBorrowingInterface {
  isUsingAsCollateral: boolean;
  isBorrowing: boolean;
}

export function getUsingAsCollateralOrBorrowing(
  userConfig: bigint,
  assetId: number
): UsingAsCollateralOrBorrowingInterface {
  return {
    isUsingAsCollateral: ((userConfig >> (BigInt(assetId) << 1n) & 3n) != 0n),
    isBorrowing: ((userConfig >> (BigInt(assetId) << 1n) & 1n) != 0n)
  }
}