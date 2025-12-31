import { encodeFunctionData, maxUint256 } from 'viem';
import { EVM } from '../../config/chain';
import { ContractEVM } from '../../config/evm/contract.evm';
import { bytes32ToAddress, divBigint, minBigint } from '../../utils/index';
import erc20Abi from '../../config/evm/abis/ERC20PermitMock.abi';
import { decodeConfiguration } from './decode_configuration';

interface ReserveInterface {
  id: number;
  decimals: number;
  address: string;
  aTokenAddress: `0x${string}`;
  variableDebtTokenAddress: `0x${string}`;
  priceRaw: bigint;
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

interface MarketData {
  totalMarketSize: number;
  totalAvailable: number;
  totalBorrows: number;
}

interface UserDataInterface {
  totalCollateralBaseRaw: bigint;
  totalDebtBaseRaw: bigint;
  availableBorrowsBaseRaw: bigint;
  currentLiquidationThresholdRaw: bigint;
  ltvRaw: bigint;
  healthFactorRaw: bigint;
  configuration: bigint;
}

interface UserReserveStateInterface {
  isUsingAsCollateral: boolean;
  isBorrowing: boolean;
}

export class Pool {
  public contract: ContractEVM;

  constructor(__contract__: ContractEVM) {
    this.contract = __contract__;
  }

  public async getReservesList(chain: EVM): Promise<ReserveInterface[]> {
    const priceOracleContract = this.contract.priceOracle(chain);
    const poolContract = this.contract.pool(chain);
    const rateModelContract = this.contract.rateModel(chain);
    const multicallContract = this.contract.multicall(chain);

    const assets: `0x${string}`[] = await poolContract.read.getReservesList() as `0x${string}`[];
    if (assets.length == 0) return [];

    const dataToCall = [];
    for (let i = 0; i < assets.length; i++) {
      dataToCall.push(...[
        {
          to: priceOracleContract.address,
          value: 0,
          data: encodeFunctionData({ abi: priceOracleContract.abi, functionName: "getAssetPrice", args: [assets[i]] })
        },
        {
          to: poolContract.address,
          value: 0,
          data: encodeFunctionData({ abi: poolContract.abi, functionName: "getReserveData", args: [assets[i]] })
        },
        {
          to: rateModelContract.address,
          value: 0,
          data: encodeFunctionData({ abi: rateModelContract.abi, functionName: "getInterestRateData", args: [assets[i]] })
        },
        {
          to: assets[i],
          value: 0,
          data: encodeFunctionData({ abi: erc20Abi, functionName: "decimals", args: [] })
        }
      ])
    }

    const data: any = await multicallContract.read.read([dataToCall]);
    let dataId = 0;

    const prices: bigint[] = [];
    const reserveDatas: any[] = [];
    const rateDatas: any[] = [];
    const decimalses: number[] = [];

    for (let i = 0; i < assets.length; i++) {
      prices.push(BigInt(data[dataId]));
      reserveDatas.push(this.contract.decodeMulticallData(data[dataId + 1]));
      rateDatas.push(this.contract.decodeMulticallData(data[dataId + 2]));
      decimalses.push(Number(data[dataId + 3]));
      dataId += 4
    }

    while (dataToCall.length > 0) dataToCall.pop();

    for (let i = 0; i < assets.length; i++) {
      const aToken: `0x${string}` = bytes32ToAddress(reserveDatas[i][8]);
      const debtToken: `0x${string}` = bytes32ToAddress(reserveDatas[i][10]);
      dataToCall.push(...[
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
          to: assets[i],
          value: 0,
          data: encodeFunctionData({ abi: erc20Abi, functionName: 'balanceOf', args: [aToken] })
        }
      ])
    }

    const balanceData: any = await multicallContract.read.read([dataToCall]);
    dataId = 0;
    const reserves: ReserveInterface[] = [];

    for (let i = 0; i < assets.length; i++) {
      const configuration = decodeConfiguration(BigInt(reserveDatas[i][0]));

      reserves.push({
        id: Number(reserveDatas[i][7]),
        decimals: decimalses[i],
        address: assets[i],
        aTokenAddress: bytes32ToAddress(reserveDatas[i][8]),
        variableDebtTokenAddress: bytes32ToAddress(reserveDatas[i][10]),
        priceRaw: prices[i],
        ltv: parseFloat(divBigint(BigInt(configuration.ltv), 10n ** 4n, 4)),
        liquidationThreshold: parseFloat(divBigint(BigInt(configuration.liquidationThreshold), 10n ** 4n, 4)),
        liquidationBonus: parseFloat(divBigint(BigInt(configuration.liquidationBonus), 10n ** 4n, 4)),
        reserveFactor: parseFloat(divBigint(BigInt(configuration.reserveFactor), 10n ** 4n, 4)),
        optimalUsageRatio: parseFloat(divBigint(BigInt(rateDatas[i][0]), 10n ** 27n, 4)),
        baseBorrowRate: parseFloat(divBigint(BigInt(rateDatas[i][1]), 10n ** 27n, 4)),
        slope1: parseFloat(divBigint(BigInt(rateDatas[i][2]), 10n ** 27n, 4)),
        slope2: parseFloat(divBigint(BigInt(rateDatas[i][3]), 10n ** 27n, 4)),
        totalSupplyRaw: BigInt(balanceData[dataId]),
        totalBorrowRaw: BigInt(balanceData[dataId + 1]),
        availableLiquidityRaw: BigInt(balanceData[dataId + 2]),
        supplyRateRaw: BigInt(reserveDatas[i][2]),
        borrowRateRaw: BigInt(reserveDatas[i][4])
      });

      dataId += 3;
    }

    return reserves;
  }

  public async getMarketData(chain: EVM): Promise<MarketData> {
    const reserves = await this.getReservesList(chain);
    let totalMarketSizeRaw: bigint = 0n;
    let totalBorrowsRaw: bigint = 0n;
    let totalAvailableRaw: bigint = 0n;
    for (const reserve of reserves) {
      totalMarketSizeRaw += reserve.priceRaw * reserve.totalSupplyRaw * 10n ** 19n / 10n ** BigInt(reserve.decimals);
      totalBorrowsRaw += reserve.priceRaw * reserve.totalBorrowRaw * 10n ** 19n / 10n ** BigInt(reserve.decimals);
      totalAvailableRaw += reserve.priceRaw * reserve.availableLiquidityRaw * 10n ** 19n / 10n ** BigInt(reserve.decimals);
    }
    return {
      totalMarketSize: parseFloat(divBigint(totalMarketSizeRaw, 10n ** 27n, 2)),
      totalBorrows: parseFloat(divBigint(totalBorrowsRaw, 10n ** 27n, 2)),
      totalAvailable: parseFloat(divBigint(totalAvailableRaw, 10n ** 27n, 2)),
    }
  }

  public async getUserData(chain: EVM, user: `0x${string}`): Promise<UserDataInterface> {
    const pool = this.contract.pool(chain);
    const data: any = await this.contract.multicall(chain).read.read([[
      {
        to: pool.address,
        value: 0,
        data: encodeFunctionData({ abi: pool.abi, functionName: "getUserAccountData", args: [user] })
      },
      {
        to: pool.address,
        value: 0,
        data: encodeFunctionData({ abi: pool.abi, functionName: "getUserConfiguration", args: [user] })
      }
    ]]);

    const userData = this.contract.decodeMulticallData(data[0]);
    return {
      totalCollateralBaseRaw: BigInt(userData[0]),
      totalDebtBaseRaw: BigInt(userData[1]),
      availableBorrowsBaseRaw: BigInt(userData[2]),
      currentLiquidationThresholdRaw: BigInt(userData[3]),
      ltvRaw: BigInt(userData[4]),
      healthFactorRaw: BigInt(userData[5]),
      configuration: BigInt(data[1])
    }
  }

  public getUserReserveState(userConfig: bigint, reserveId: number): UserReserveStateInterface {
    return {
      isUsingAsCollateral: ((userConfig >> (BigInt(reserveId) << 1n) & 3n) != 0n),
      isBorrowing: ((userConfig >> (BigInt(reserveId) << 1n) & 1n) != 0n)
    }
  }

  public getMaxWithdrawRaw(
    userTotalDebtBaseRaw: bigint,
    userHealthFactorRaw: bigint,
    userSupplyBalanceRaw: bigint,
    poolAvailableLiquidityRaw: bigint,
    reserveLiquidationThreshold: number,
    assetPriceRaw: bigint,
    assetDecimals: number,
    userUsingAsCollateral: boolean
  ): bigint {
    const minHF: bigint = 10n ** 18n + 10n ** 16n;
    if (userHealthFactorRaw < minHF) return 0n;

    if (
      userTotalDebtBaseRaw == 0n ||
      userHealthFactorRaw == maxUint256 ||
      !userUsingAsCollateral ||
      reserveLiquidationThreshold == 0 ||
      assetPriceRaw == 0n
    ) return minBigint(userSupplyBalanceRaw, poolAvailableLiquidityRaw);

    const reserveLiquidationThresholdRaw: bigint = BigInt(reserveLiquidationThreshold * 10 ** 4);

    return minBigint(
      (userHealthFactorRaw - minHF) * userTotalDebtBaseRaw * 10n ** BigInt(assetDecimals) / reserveLiquidationThresholdRaw / assetPriceRaw / 10n ** 14n,
      userSupplyBalanceRaw,
      poolAvailableLiquidityRaw
    )
  }

  public getMaxBorrowRaw(
    poolAvailableLiquidityRaw: bigint,
    userAvailableBorrowsBaseRaw: bigint,
    priceRaw: bigint,
    assetDecimals: number,
  ): bigint {
    return minBigint(poolAvailableLiquidityRaw, userAvailableBorrowsBaseRaw * 10n ** BigInt(assetDecimals) / priceRaw);
  }

  public simulateHFSupply(
    userTotalCollateralBaseRaw: bigint,
    userTotalDebtBaseRaw: bigint,
    userCurrentLiquidationThresholdRaw: bigint,
    userHealthFactorRaw: bigint,
    reserveLiquidationThreshold: number,
    userSupplyBalanceRaw: bigint,
    userSupplyAmountRaw: bigint,
    assetPriceRaw: bigint,
    userUsingAsCollateral: boolean,
    assetDecimals: number
  ): bigint {
    if (userSupplyBalanceRaw == 0n) userUsingAsCollateral = true;

    if (
      userTotalDebtBaseRaw == 0n ||
      !userUsingAsCollateral ||
      assetPriceRaw == 0n ||
      reserveLiquidationThreshold == 0
    ) return userHealthFactorRaw;

    const reserveLiquidationThresholdRaw: bigint = BigInt(reserveLiquidationThreshold * 10 ** 4);
    const userSupplyValueRaw: bigint = userSupplyAmountRaw * assetPriceRaw / (10n ** BigInt(assetDecimals));
    const userNewCollateralRaw: bigint = userTotalCollateralBaseRaw + userSupplyValueRaw;
    const userNewLiquidationThresholdRaw: bigint = (userTotalCollateralBaseRaw * userCurrentLiquidationThresholdRaw + userSupplyValueRaw * reserveLiquidationThresholdRaw) / userNewCollateralRaw;

    return userNewCollateralRaw * userNewLiquidationThresholdRaw * 10n ** 14n / userTotalDebtBaseRaw;
  }

  public simulateHFWithdraw(
    userTotalCollateralBaseRaw: bigint,
    userTotalDebtBaseRaw: bigint,
    userCurrentLiquidationThresholdRaw: bigint,
    userHealthFactorRaw: bigint,
    reserveLiquidationThreshold: number,
    userSupplyBalanceRaw: bigint,
    userWithdrawAmountRaw: bigint,
    assetPriceRaw: bigint,
    userUsingAsCollateral: boolean,
    assetDecimals: number
  ): bigint {
    if (userWithdrawAmountRaw > userSupplyBalanceRaw) userWithdrawAmountRaw = userSupplyBalanceRaw;

    if (
      userTotalDebtBaseRaw == 0n ||
      !userUsingAsCollateral ||
      assetPriceRaw == 0n ||
      reserveLiquidationThreshold == 0
    ) return userHealthFactorRaw;

    const reserveLiquidationThresholdRaw: bigint = BigInt(reserveLiquidationThreshold * 10 ** 4);
    const userWithdrawValueRaw: bigint = userWithdrawAmountRaw * assetPriceRaw / (10n ** BigInt(assetDecimals));
    const userNewCollateralRaw: bigint = userTotalCollateralBaseRaw - userWithdrawValueRaw;
    const userNewLiquidationThresholdRaw: bigint = (userTotalCollateralBaseRaw * userCurrentLiquidationThresholdRaw - userWithdrawValueRaw * reserveLiquidationThresholdRaw) / userNewCollateralRaw;

    return userNewCollateralRaw * userNewLiquidationThresholdRaw * 10n ** 14n / userTotalDebtBaseRaw;
  }

  public simulateHFBorrow(
    userTotalCollateralBaseRaw: bigint,
    userTotalDebtBaseRaw: bigint,
    userCurrentLiquidationThresholdRaw: bigint,
    userBorrowAmountRaw: bigint,
    assetPriceRaw: bigint,
    assetDecimals: number
  ): bigint {
    const userNewDebtRaw = userTotalDebtBaseRaw + userBorrowAmountRaw * assetPriceRaw / (10n ** BigInt(assetDecimals));
    return userTotalCollateralBaseRaw * userCurrentLiquidationThresholdRaw * 10n ** 14n / userNewDebtRaw;
  }

  public simulateHFRepay(
    userTotalCollateralBaseRaw: bigint,
    userTotalDebtBaseRaw: bigint,
    userCurrentLiquidationThresholdRaw: bigint,
    userBorrowBalanceRaw: bigint,
    userRepayAmountRaw: bigint,
    assetPriceRaw: bigint,
    assetDecimals: number
  ): bigint {
    if (userRepayAmountRaw > userBorrowBalanceRaw) userRepayAmountRaw = userBorrowBalanceRaw;

    const newDebtRaw = userTotalDebtBaseRaw - userRepayAmountRaw * assetPriceRaw / (10n ** BigInt(assetDecimals));
    if (newDebtRaw == 0n) return maxUint256;

    return userTotalCollateralBaseRaw * userCurrentLiquidationThresholdRaw * 10n ** 14n / newDebtRaw;
  }

  public simulateHFSetAsCollateral(
    userTotalCollateralBaseRaw: bigint,
    userTotalDebtBaseRaw: bigint,
    userCurrentLiquidationThresholdRaw: bigint,
    userHealthFactorRaw: bigint,
    reserveLiquidationThreshold: number,
    userSupplyBalanceRaw: bigint,
    assetPriceRaw: bigint,
    userUsingAsCollateralCurrent: boolean,
    assetDecimals: number
  ): bigint {
    if (
      userTotalDebtBaseRaw == 0n ||
      assetPriceRaw == 0n ||
      reserveLiquidationThreshold == 0
    ) return userHealthFactorRaw;

    const reserveLiquidationThresholdRaw: bigint = BigInt(reserveLiquidationThreshold * 10 ** 4);

    if (userUsingAsCollateralCurrent == false) {
      const userSupplyValueRaw: bigint = userSupplyBalanceRaw * assetPriceRaw / (10n ** BigInt(assetDecimals));
      const userNewCollateralRaw: bigint = userTotalCollateralBaseRaw + userSupplyValueRaw;
      const userNewLiquidationThresholdRaw: bigint = (userTotalCollateralBaseRaw * userCurrentLiquidationThresholdRaw + userSupplyValueRaw * reserveLiquidationThresholdRaw) / userNewCollateralRaw;

      return userNewCollateralRaw * userNewLiquidationThresholdRaw * 10n ** 14n / userTotalDebtBaseRaw;
    }
    else {
      const userWithdrawValueRaw: bigint = userSupplyBalanceRaw * assetPriceRaw / (10n ** BigInt(assetDecimals));
      const userNewCollateralRaw: bigint = userTotalCollateralBaseRaw - userWithdrawValueRaw;
      const userNewLiquidationThresholdRaw: bigint = (userTotalCollateralBaseRaw * userCurrentLiquidationThresholdRaw - userWithdrawValueRaw * reserveLiquidationThresholdRaw) / userNewCollateralRaw;

      return userNewCollateralRaw * userNewLiquidationThresholdRaw * 10n ** 14n / userTotalDebtBaseRaw;
    }
  }
}