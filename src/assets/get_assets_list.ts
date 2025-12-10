import assets from '../config/evm/assets/assets.json';
import omniAssets from '../config/evm/assets/omni_assets.json';
import reserves from '../config/evm/assets/reserves.json';
import { Chain, EVM } from '../config/chain';
import { priceOracle, token, pool } from '../contract-program-getter/index';
import { divBigint } from '../utils/index';

interface Options {
  rpc?: string;
}

interface AssetInterface {
  name: string;
  symbol: string;
  decimal: number;
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
  options: Options = {}
): Promise<Record<string, Record<string, AssetInterface>>> {
  let assetsList: Record<string, Record<string, AssetInterface>> = {};

  for (const ccc of chains) {
    const chainAssets: Record<string, AssetInterface> = {};
    for (const [key, value] of Object.entries(assets[ccc])) {

      const omniAssetAddress: `0x{string}` = (omniAssets as any)[ccc][key].omniAsset;
      const aToken: `0x{string}` = (omniAssets as any)[ccc][key].aToken;
      const debtToken: `0x{string}` = (omniAssets as any)[ccc][key].variableDebtToken;

      const rawPrice: bigint = await priceOracle(hubChain, options.rpc).read.getAssetPrice([omniAssetAddress]) as bigint;
      const price: number = parseFloat(divBigint(rawPrice, 10n**8n, 8));

      const totalSupplyRaw: bigint = await token(hubChain, aToken, options.rpc).read.totalSupply() as bigint;
      const totalBorrowRaw: bigint = await token(hubChain, debtToken, options.rpc).read.totalSupply() as bigint;
      const availableLiquidityRaw: bigint = await token(hubChain, omniAssetAddress, options.rpc).read.balanceOf([aToken]) as bigint;

      const reserve = await pool(hubChain, options.rpc).read.getReserveData([omniAssetAddress]) as any;

      const asset: AssetInterface = {
        name: value.name,
        symbol: value.symbol,
        decimal: value.decimals,
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