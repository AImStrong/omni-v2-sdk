import { EVM, Solana } from '../../config/chain';
import { clientMessage, EVMOptions } from '../../config/evm/contract';
import { solanaClientProgram, SolanaOptions } from '../../config/solana/program';
import { pdas, accounts } from '../../config/solana/config';
import { divBigint } from '../../utils/index';
import { Options } from "@layerzerolabs/lz-v2-utilities";
import { Keypair } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

interface FeeInterface {
  feeRaw: bigint;
  fee: number;
}

export async function quoteEVM(
  clientChain: EVM,
  destinationChainId: number,
  gasLimit: bigint,
  options: EVMOptions = {}
): Promise<FeeInterface> {
  const feeRaw: bigint = await clientMessage(clientChain, options).read.gasFee([destinationChainId, "0x123", gasLimit]);
  return {
    feeRaw: feeRaw,
    fee: parseFloat(divBigint(feeRaw, 10n ** 18n, 18))
  }
}

const testWallet = new anchor.Wallet(Keypair.fromSecretKey(new Uint8Array([139,151,153,132,205,21,196,101,29,157,33,142,252,151,220,143,216,119,99,59,187,61,70,208,128,160,249,38,135,191,96,49,99,166,130,93,207,158,144,93,216,215,207,91,188,171,107,92,252,180,250,142,31,38,139,17,13,10,51,99,35,149,5,52])));
export async function quoteSolana(
  clientChain: Solana,
  gasLimit: bigint,
  options: SolanaOptions = {}
): Promise<FeeInterface> {
  options = {wallet: testWallet, ...options};
  const program = solanaClientProgram(clientChain, options);

  const lzOptions = Buffer.from(Options.newOptions().addExecutorLzReceiveOption(gasLimit).toBytes())

  const feeRaw = BigInt((await program.methods.quoteSend(Buffer.from([1, 1]), lzOptions).accounts({
    store: pdas.store(clientChain),
    messageInfo: pdas.messageInfo(clientChain)
  }).remainingAccounts(await accounts.remainingAccountsForQuote(clientChain, program.provider.publicKey, options)).view()).nativeFee.toString());

  return {
    feeRaw: feeRaw,
    fee: parseFloat(divBigint(feeRaw, 10n ** 9n, 9)),
  }
}