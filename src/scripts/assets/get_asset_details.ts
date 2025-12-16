import { Chain, EVM, chain } from '../../config/chain';
import { priceOracle, token, pool, EVMOptions, assetManager, rateModel } from '../../config/evm/contract';
import { divBigint, convertToBytes32 } from '../../utils/index';
import { decodeConfiguration } from '../lending/decode_configuration';

interface AssetInterface {
  id: number;
  address: string;
  omniAssetAddress: `0x{string}`;
  aTokenAddress: `0x{string}`;
  variableDebtTokenAddress: `0x{string}`;
  price: number;
  ltv: number;
  liquidationThreshold: number;
  liquidationBonus: number;
  reserveFactor: number;
  optimalUsageRatio: number;
  baseBorrowRate: number;
  slope1: number;
  slope2: number;
  totalSupplyRaw: bigint;
  totalBorrowRaw: bigint;
  availableLiquidityRaw: bigint;
  supplyRateRaw: bigint;
  borrowRateRaw: bigint;
}

export async function getAssetDetails(
  hubChain: EVM,
  originChain: Chain,
  asset: string,
  options: EVMOptions = {}
): Promise<AssetInterface> {

  const priceOracleContract = priceOracle(hubChain, options);
  const poolContract = pool(hubChain, options);
  const assetManagerContract = assetManager(hubChain, options);
  const rateModelContract = rateModel(hubChain, options);

  const omniAssetAddress: `0x{string}` = await assetManagerContract.read.getAsset([chain[originChain].id, convertToBytes32(asset)]);

  const [reserve, rawPrice, rateData] = await Promise.all([
    poolContract.read.getReserveData([omniAssetAddress]),
    priceOracleContract.read.getAssetPrice([omniAssetAddress]),
    rateModelContract.read.getInterestRateData([omniAssetAddress])
  ]);

  const id: number = reserve.id;
  const configuration = decodeConfiguration(reserve.configuration.data);
  const aToken: `0x{string}` = reserve.aTokenAddress;
  const debtToken: `0x{string}` = reserve.variableDebtTokenAddress;
  const price: number = parseFloat(divBigint(rawPrice, 10n ** 8n, 8));

  const [totalSupplyRaw, totalBorrowRaw, availableLiquidityRaw] = await Promise.all([
    token(hubChain, aToken, options).read.totalSupply(),
    token(hubChain, debtToken, options).read.totalSupply(),
    token(hubChain, omniAssetAddress, options).read.balanceOf([aToken])
  ]);

  return {
    id: id,
    address: asset,
    omniAssetAddress: omniAssetAddress,
    aTokenAddress: aToken,
    variableDebtTokenAddress: debtToken,
    price: price,
    ltv: parseFloat(divBigint(BigInt(configuration.ltv), 10n ** 4n, 4)),
    liquidationThreshold: parseFloat(divBigint(BigInt(configuration.liquidationThreshold), 10n ** 4n, 4)),
    liquidationBonus: parseFloat(divBigint(BigInt(configuration.liquidationBonus), 10n ** 4n, 4)),
    reserveFactor: parseFloat(divBigint(BigInt(configuration.reserveFactor), 10n ** 4n, 4)),
    optimalUsageRatio: parseFloat(divBigint(BigInt(rateData.optimalUsageRatio), 10n ** 27n, 4)),
    baseBorrowRate: parseFloat(divBigint(BigInt(rateData.baseVariableBorrowRate), 10n ** 27n, 4)),
    slope1: parseFloat(divBigint(BigInt(rateData.variableRateSlope1), 10n ** 27n, 4)),
    slope2: parseFloat(divBigint(BigInt(rateData.variableRateSlope2), 10n ** 27n, 4)),
    totalSupplyRaw: totalSupplyRaw,
    totalBorrowRaw: totalBorrowRaw,
    availableLiquidityRaw: availableLiquidityRaw,
    supplyRateRaw: reserve.currentLiquidityRate,
    borrowRateRaw: reserve.currentVariableBorrowRate
  }
}