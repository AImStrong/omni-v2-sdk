import { EVM } from '../../config/chain';
import { pool, priceOracle, token, EVMOptions } from '../../config/evm/contract';
import { divBigint } from '../../utils/index';

export async function poolTotalMarketSize(
  hubChain: EVM,
  options: EVMOptions = {}
): Promise<number> {
  const poolContract = pool(hubChain, options);
  const priceOracleContract = priceOracle(hubChain, options);

  const assets: `0x{string}`[] = await poolContract.read.getReservesList() as `0x{string}`[];

  let totalPriceRaw: bigint = 0n;
  for (const asset of assets) {
    const [rawPrice, aToken, decimals] = await Promise.all([
      priceOracleContract.read.getAssetPrice([asset]),
      poolContract.read.getReserveAToken([asset]),
      token(hubChain, asset, options).read.decimals()
    ]);

    const supply: bigint = await token(hubChain, aToken, options).read.totalSupply()

    totalPriceRaw = totalPriceRaw + rawPrice * supply * 10n**19n / 10n**BigInt(decimals);
  }

  return parseFloat(divBigint(totalPriceRaw, 10n**27n, 2));
}

export async function poolTotalBorrows(
  hubChain: EVM,
  options: EVMOptions = {}
): Promise<number> {
  const poolContract = pool(hubChain, options);
  const priceOracleContract = priceOracle(hubChain, options);

  const assets: `0x{string}`[] = await pool(hubChain, options).read.getReservesList() as `0x{string}`[];

  let totalPriceRaw: bigint = 0n;
  for (const asset of assets) {
    const [rawPrice, debtToken, decimals] = await Promise.all([
      priceOracleContract.read.getAssetPrice([asset]),
      poolContract.read.getReserveVariableDebtToken([asset]),
      token(hubChain, asset, options).read.decimals()
    ]);

    const borrow: bigint = await token(hubChain, debtToken, options).read.totalSupply() as bigint;

    totalPriceRaw = totalPriceRaw + rawPrice * borrow * 10n**19n / 10n**BigInt(decimals);
  }

  return parseFloat(divBigint(totalPriceRaw, 10n**27n, 2));
}

export async function poolTotalAvailable(
  hubChain: EVM,
  options: EVMOptions = {}
): Promise<number> {
  const poolContract = pool(hubChain, options);
  const priceOracleContract = priceOracle(hubChain, options);

  const assets: `0x{string}`[] = await pool(hubChain, options).read.getReservesList() as `0x{string}`[];

  let totalPriceRaw: bigint = 0n;
  for (const asset of assets) {
    const [rawPrice, aToken, decimals] = await Promise.all([
      priceOracleContract.read.getAssetPrice([asset]),
      poolContract.read.getReserveAToken([asset]),
      token(hubChain, asset, options).read.decimals()
    ]);

    const available: bigint = await token(hubChain, asset, options).read.balanceOf([aToken]) as bigint;

    totalPriceRaw = totalPriceRaw + rawPrice * available * 10n**19n / 10n**BigInt(decimals);
  }

  return parseFloat(divBigint(totalPriceRaw, 10n**27n, 2));
}