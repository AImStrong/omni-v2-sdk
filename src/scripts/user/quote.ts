import { EVM, Solana } from '../../config/chain';
import { clientMessage, EVMOptions } from '../../config/evm/contract';
import { solanaClientProgram, SolanaOptions } from '../../config/solana/program';
import { pdas, accounts } from '../../config/solana/config';
import { divBigint } from '../../utils/index';
import { Options } from "@layerzerolabs/lz-v2-utilities";

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

export async function quoteSolana(
  clientChain: Solana,
  gasLimit: bigint,
  options: SolanaOptions = {}
): Promise<FeeInterface> {
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