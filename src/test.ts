// import { convertToBytes32, accountManager, pool, token } from './index';
// import { getAssetsList, getAssetDetails, getAddressesList } from './index';
// import { poolTotalMarketSize, poolTotalBorrows, poolTotalAvailable } from './index';
// import { hubPermit, isLinked, isRequestLinking, isRequestUnlinking } from './index';
// import { getUserData, getUserDataRaw, getUserConfiguration, getUsingAsCollateralOrBorrowing } from './index';
// import { getMaxWithdraw, getMaxBorrow } from './index';
// import { simulateHFSupply, simulateHFWithdraw, simulateHFBorrow, simulateHFRepay, simulateHFSetAsCollateral } from './index';
// import { quoteEVM, quoteSolana } from './index'
// import { isERC20Permit, getPermit } from './index';
import { getNextTx } from './index';

async function main() {
  console.log(await getNextTx("testnet", "0x37b24d3815834b2c5709f6c119d0f27632c9764fd57068594fa198e3867a3b73"));
}

main().then().catch(err => console.log(err));