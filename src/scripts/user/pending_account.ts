import { EVM, Solana } from '../../config/chain';
import { hub, EVMOptions } from '../../config/evm/contract.evm';
import { solanaClientProgram, SolanaOptions } from '../../config/solana/program.solana';
import { pdas } from '../../config/solana/config.solana';
import { PublicKey } from '@solana/web3.js';
import { vecToBytes } from '../../utils';

export async function pendingAccountEVM(
  hubChain: EVM,
  userAddress: `0x{string}`,
  options: EVMOptions = {}
): Promise<`0x{string}`> {
  return await hub(hubChain, options).read.pendingAccount([userAddress]) as `0x{string}`;
}

export async function pendingAccountSolana(
  solanaChain: Solana,
  userAddress: string,
  options: SolanaOptions = {}
): Promise<`0x{string}`> {
  const pendingAccount = await solanaClientProgram(solanaChain, options).account.pendingAccountInfo.fetch(pdas.pendingAccountInfo(solanaChain, new PublicKey(userAddress)));
  return vecToBytes(pendingAccount.account);
}