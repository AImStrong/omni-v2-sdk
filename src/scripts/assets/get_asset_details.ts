import { Chain, EVM, chain } from '../../config/chain';
import { priceOracle, token, pool, EVMOptions, assetManager, rateModel } from '../../config/evm/contract.evm';
import { divBigint, convertToBytes32, bytes32ToAddress } from '../../utils/index';
import { decodeConfiguration } from '../lending/decode_configuration';
import { multicall } from '../../multicall/multicall.contract';
import { decodeMulticallData } from '../../multicall/muticall.helper';
import { encodeFunctionData } from 'viem';
import erc20Abi from '../../config/evm/abis/ERC20PermitMock.abi';

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
  const multicallContract = multicall(hubChain, options);

  const omniAssetAddress: `0x{string}` = await assetManagerContract.read.getAsset([chain[originChain].id, convertToBytes32(asset)]) as `0x{string}`;

  const data: any = await multicallContract.read.read([[
    {
      to: poolContract.address,
      value: 0,
      data: encodeFunctionData({ abi: poolContract.abi, functionName: "getReserveData", args: [omniAssetAddress] })
    },
    {
      to: priceOracleContract.address,
      value: 0,
      data: encodeFunctionData({ abi: priceOracleContract.abi, functionName: "getAssetPrice", args: [omniAssetAddress] })
    },
    {
      to: rateModelContract.address,
      value: 0,
      data: encodeFunctionData({ abi: rateModelContract.abi, functionName: "getInterestRateData", args: [omniAssetAddress] })
    }
  ]]);

  const decodedReserve = decodeMulticallData(data[0]);
  const decodedRateData = decodeMulticallData(data[2]);

  const id: number = Number(decodedReserve[7]);
  const configuration = decodeConfiguration(BigInt(decodedReserve[0]));
  const aToken: `0x{string}` = bytes32ToAddress(decodedReserve[8]);
  const debtToken: `0x{string}` = bytes32ToAddress(decodedReserve[10]);
  const price: number = parseFloat(divBigint(BigInt(data[1]), 10n ** 8n, 8));

  const balanceData: any = await multicallContract.read.read([[
    {
      to: aToken,
      value: 0,
      data: encodeFunctionData({ abi: erc20Abi, functionName: 'totalSupply', args: [] })
    },
    {
      to: debtToken,
      value: 0,
      data: encodeFunctionData({ abi: erc20Abi, functionName: 'totalSupply', args: [] })
    },
    {
      to: omniAssetAddress,
      value: 0,
      data: encodeFunctionData({ abi: erc20Abi, functionName: 'balanceOf', args: [aToken] })
    }
  ]])

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
    optimalUsageRatio: parseFloat(divBigint(BigInt(decodedRateData[0]), 10n ** 27n, 4)),
    baseBorrowRate: parseFloat(divBigint(BigInt(decodedRateData[1]), 10n ** 27n, 4)),
    slope1: parseFloat(divBigint(BigInt(decodedRateData[2]), 10n ** 27n, 4)),
    slope2: parseFloat(divBigint(BigInt(decodedRateData[3]), 10n ** 27n, 4)),
    totalSupplyRaw: BigInt(balanceData[0]),
    totalBorrowRaw: BigInt(balanceData[1]),
    availableLiquidityRaw: BigInt(balanceData[2]),
    supplyRateRaw: BigInt(decodedReserve[2]),
    borrowRateRaw: BigInt(decodedReserve[4])
  }
}