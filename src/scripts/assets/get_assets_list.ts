import { encodeFunctionData } from 'viem';
import assets from '../../config/assets/assets.asset';
import omniAssets from '../../config/assets/omni_assets.asset';
import reserves from '../../config/assets/reserves.asset';
import { Chain, EVM } from '../../config/chain';
import { priceOracle, token, pool, EVMOptions, rateModel } from '../../config/evm/contract.evm';
import { divBigint } from '../../utils/index';
import erc20Abi from '../../config/evm/abis/ERC20PermitMock.abi';
import { multicall } from '../../multicall/multicall.contract';
import { decodeMulticallData } from '../../multicall/muticall.helper';
import { decodeConfiguration } from '../lending/decode_configuration';

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
  const rateModelContract = rateModel(hubChain, options);
  const multicallContract = multicall(hubChain, options);

  const dataToCall = [];

  for (const ccc of chains) {
    for (const [key, value] of Object.entries(assets[ccc])) {

      const omniAssetAddress: `0x{string}` = (omniAssets as any)[ccc][key].omniAsset;
      const aToken: `0x{string}` = (omniAssets as any)[ccc][key].aToken;
      const debtToken: `0x{string}` = (omniAssets as any)[ccc][key].variableDebtToken;

      dataToCall.push(...[
        {
          to: priceOracleContract.address,
          value: 0,
          data: encodeFunctionData({ abi: priceOracleContract.abi, functionName: "getAssetPrice", args: [omniAssetAddress] })
        },
        {
          to: aToken,
          value: 0,
          data: encodeFunctionData({ abi: erc20Abi, functionName: "totalSupply", args: [] })
        },
        {
          to: debtToken,
          value: 0,
          data: encodeFunctionData({ abi: erc20Abi, functionName: "totalSupply", args: [] })
        },
        {
          to: omniAssetAddress,
          value: 0,
          data: encodeFunctionData({ abi: erc20Abi, functionName: "balanceOf", args: [aToken] })
        },
        {
          to: poolContract.address,
          value: 0,
          data: encodeFunctionData({ abi: poolContract.abi, functionName: "getReserveData", args: [omniAssetAddress] })
        },
        {
          to: rateModelContract.address,
          value: 0,
          data: encodeFunctionData({ abi: rateModelContract.abi, functionName: "getInterestRateData", args: [omniAssetAddress] })
        }
      ]);
    }
  }

  const data: any = await multicallContract.read.read([dataToCall]);
  let dataId = 0;

  for (const ccc of chains) {
    const chainAssets: Record<string, AssetInterface> = {};
    for (const [key, value] of Object.entries(assets[ccc])) {

      const omniAssetAddress: `0x{string}` = (omniAssets as any)[ccc][key].omniAsset;
      const aToken: `0x{string}` = (omniAssets as any)[ccc][key].aToken;
      const debtToken: `0x{string}` = (omniAssets as any)[ccc][key].variableDebtToken;

      const rawPrice: bigint = BigInt(data[dataId]);
      const totalSupplyRaw: bigint = BigInt(data[dataId + 1]);
      const totalBorrowRaw: bigint = BigInt(data[dataId + 2]);
      const availableLiquidityRaw: bigint = BigInt(data[dataId + 3]);
      const decodedReserve = decodeMulticallData(data[dataId + 4]);
      const decodedRateData = decodeMulticallData(data[dataId + 5]);
      dataId += 6;

      const id: number = Number(decodedReserve[7]);
      const price: number = parseFloat(divBigint(rawPrice, 10n ** 8n, 8));
      const configuration = decodeConfiguration(BigInt(decodedReserve[0]));

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
        ltv: parseFloat(divBigint(BigInt(configuration.ltv), 10n ** 4n, 4)),
        liquidationThreshold: parseFloat(divBigint(BigInt(configuration.liquidationThreshold), 10n ** 4n, 4)),
        liquidationBonus: parseFloat(divBigint(BigInt(configuration.liquidationBonus), 10n ** 4n, 4)),
        reserveFactor: parseFloat(divBigint(BigInt(configuration.reserveFactor), 10n ** 4n, 4)),
        optimalUsageRatio: parseFloat(divBigint(BigInt(decodedRateData[0]), 10n ** 27n, 4)),
        baseBorrowRate: parseFloat(divBigint(BigInt(decodedRateData[1]), 10n ** 27n, 4)),
        slope1: parseFloat(divBigint(BigInt(decodedRateData[2]), 10n ** 27n, 4)),
        slope2: parseFloat(divBigint(BigInt(decodedRateData[3]), 10n ** 27n, 4)),
        totalSupplyRaw: totalSupplyRaw,
        totalBorrowRaw: totalBorrowRaw,
        availableLiquidityRaw: availableLiquidityRaw,
        supplyRateRaw: BigInt(decodedReserve[2]),
        borrowRateRaw: BigInt(decodedReserve[4])
      }

      chainAssets[key] = asset;
    }

    assetsList[ccc] = chainAssets;
  }

  return assetsList;
}