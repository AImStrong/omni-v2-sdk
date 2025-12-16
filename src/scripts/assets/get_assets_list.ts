import assets from '../../config/evm/assets/assets.json';
import omniAssets from '../../config/evm/assets/omni_assets.json';
import reserves from '../../config/evm/assets/reserves.json';
import { Chain, EVM } from '../../config/chain';
import { priceOracle, token, pool, EVMOptions } from '../../config/evm/contract';
import { divBigint } from '../../utils/index';

interface AssetInterface {
  id: number;
  name: string;
  symbol: string;
  decimals: number;
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

export async function getAssetsList(
  hubChain: EVM, 
  chains: Chain[],
  options: EVMOptions = {}
): Promise<Record<string, Record<string, AssetInterface>>> {
  let assetsList: Record<string, Record<string, AssetInterface>> = {};
  const priceOracleContract = priceOracle(hubChain, options);
  const poolContract = pool(hubChain, options);

  for (const ccc of chains) {
    const chainAssets: Record<string, AssetInterface> = {};
    for (const [key, value] of Object.entries(assets[ccc])) {

      const omniAssetAddress: `0x{string}` = (omniAssets as any)[ccc][key].omniAsset;
      const aToken: `0x{string}` = (omniAssets as any)[ccc][key].aToken;
      const debtToken: `0x{string}` = (omniAssets as any)[ccc][key].variableDebtToken;

      const [rawPrice, totalSupplyRaw, totalBorrowRaw, availableLiquidityRaw, reserve] = await Promise.all([
        priceOracleContract.read.getAssetPrice([omniAssetAddress]),
        token(hubChain, aToken, options).read.totalSupply(),
        token(hubChain, debtToken, options).read.totalSupply(),
        token(hubChain, omniAssetAddress, options).read.balanceOf([aToken]),
        poolContract.read.getReserveData([omniAssetAddress])
      ])

      const id: number = reserve.id;
      const price: number = parseFloat(divBigint(rawPrice, 10n**8n, 8));

      const asset: AssetInterface = {
        id: id,
        name: value.name,
        symbol: value.symbol,
        decimals: value.decimals,
        address: value.address,
        omniAssetAddress: omniAssetAddress,
        aTokenAddress: aToken,
        variableDebtTokenAddress: debtToken,
        price: price,
        ltv: parseFloat(divBigint(BigInt((reserves as any)[ccc][key].ltv), 10n**4n, 4)),
        liquidationThreshold: parseFloat(divBigint(BigInt((reserves as any)[ccc][key].liquidationThreshold), 10n**4n, 4)),
        liquidationBonus: parseFloat(divBigint(BigInt((reserves as any)[ccc][key].liquidationBonus), 10n**4n, 4)),
        reserveFactor: parseFloat(divBigint(BigInt((reserves as any)[ccc][key].reserveFactor), 10n**4n, 4)),
        optimalUsageRatio: parseFloat(divBigint(BigInt((reserves as any)[ccc][key].optimalUsageRatio), 10n**4n, 4)),
        baseBorrowRate: parseFloat(divBigint(BigInt((reserves as any)[ccc][key].baseBorrowRate), 10n**4n, 4)),
        slope1: parseFloat(divBigint(BigInt((reserves as any)[ccc][key].slope1), 10n**4n, 4)),
        slope2: parseFloat(divBigint(BigInt((reserves as any)[ccc][key].slope2), 10n**4n, 4)),
        totalSupplyRaw: totalSupplyRaw,
        totalBorrowRaw: totalBorrowRaw,
        availableLiquidityRaw: availableLiquidityRaw,
        supplyRateRaw: reserve.currentLiquidityRate,
        borrowRateRaw: reserve.currentVariableBorrowRate
      }

      chainAssets[key] = asset;
    }

    assetsList[ccc] = chainAssets;
  }

  return assetsList;
}