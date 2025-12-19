// import { convertToBytes32, accountManager, pool, token } from './index';
import { getAssetsList, getAssetDetails, getAddressesList } from './index';
// import { poolTotalMarketSize, poolTotalBorrows, poolTotalAvailable } from './index';
// import { hubPermit, isLinked, isRequestLinking, isRequestUnlinking } from './index';
// import { getUserData, getUserDataRaw, getUserConfiguration, getUsingAsCollateralOrBorrowing } from './index';
// import { getMaxWithdraw, getMaxBorrow } from './index';
// import { simulateHFSupply, simulateHFWithdraw, simulateHFBorrow, simulateHFRepay, simulateHFSetAsCollateral } from './index';
// import { quoteEVM, quoteSolana } from './index'
// import { isERC20Permit, getPermit } from './index';

async function main() {
  console.log(await getAssetsList("sepolia", ['sepolia', 'solanaDevnet']));
}

main().then().catch(err => console.log(err));