// import { convertToBytes32, accountManager, pool, token } from './index';
import { getAssetsList, getAssetDetails, getAddressesList } from './index';
// import { poolTotalMarketSize, poolTotalBorrows, poolTotalAvailable } from './index';
// import { hubPermit, isLinked, isRequestLinking, isRequestUnlinking } from './index';
// import { getUserData, getUserDataRaw, getUserConfiguration, getUsingAsCollateralOrBorrowing } from './index';
// import { getMaxWithdraw, getMaxBorrow } from './index';
// import { simulateHFSupply, simulateHFWithdraw, simulateHFBorrow, simulateHFRepay, simulateHFSetAsCollateral } from './index';
import { quoteEVM, quoteSolana } from './index'
// import { isERC20Permit } from './index';
// import { pendingAccountEVM, pendingAccountSolana, detechBytes32ToEVMOrSolana } from './index';
import { Keypair } from '@solana/web3.js';
import { Wallet } from '@coral-xyz/anchor';
import { token } from './index';
import { bscTestnet } from 'viem/chains';
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const wallet = new Wallet(Keypair.fromSecretKey(new Uint8Array([139,151,153,132,205,21,196,101,29,157,33,142,252,151,220,143,216,119,99,59,187,61,70,208,128,160,249,38,135,191,96,49,99,166,130,93,207,158,144,93,216,215,207,91,188,171,107,92,252,180,250,142,31,38,139,17,13,10,51,99,35,149,5,52])))

async function main() {
  
}

main().then().catch(err => console.log(err));