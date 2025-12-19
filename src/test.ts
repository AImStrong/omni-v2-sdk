// import { convertToBytes32, accountManager, pool, token } from './index';
import { getAssetsList, getAssetDetails, getAddressesList } from './index';
// import { poolTotalMarketSize, poolTotalBorrows, poolTotalAvailable } from './index';
// import { hubPermit, isLinked, isRequestLinking, isRequestUnlinking } from './index';
// import { getUserData, getUserDataRaw, getUserConfiguration, getUsingAsCollateralOrBorrowing } from './index';
// import { getMaxWithdraw, getMaxBorrow } from './index';
// import { simulateHFSupply, simulateHFWithdraw, simulateHFBorrow, simulateHFRepay, simulateHFSetAsCollateral } from './index';
// import { quoteEVM, quoteSolana } from './index'
// import { isERC20Permit } from './index';
import { pendingAccountEVM, pendingAccountSolana, detechBytes32ToEVMOrSolana } from './index';

async function main() {
  console.log(detechBytes32ToEVMOrSolana(await pendingAccountEVM("sepolia", '0x86A36A5baAa5C60036e758CAa1a4dAd32E6a5af4' as `0x{string}`)));
  console.log(detechBytes32ToEVMOrSolana(await pendingAccountSolana("solanaDevnet", "L2a8G9ChYseNtPQv6G5ZMLg6mpVQB9Pi7WiaL3317Rd")));
}

main().then().catch(err => console.log(err));