import { AnchorProvider, Program, Provider } from "@coral-xyz/anchor";
import { chainConfig, EVM, Solana } from "../../config/chain";
import { ContractEVM } from "../../config/evm/contract.evm";
import { ProgramSolana } from "../../config/solana/program.solana";
import { divBigint } from "../../utils";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import solanaClientIdl from '../../config/solana/idl/solana_client.json';

interface FeeInterface {
  feeRaw: bigint;
  fee: number;
}

interface BalanceInterface {
  balanceRaw: bigint;
  balance: number;
}

export class Message {
  public contract: ContractEVM;
  public program: ProgramSolana;

  constructor(__contract__: ContractEVM, __program__: ProgramSolana) {
    this.contract = __contract__;
    this.program = __program__
  }

  public async getFeeEVM(chain: EVM, destinationChain: EVM, gasLimit: bigint): Promise<FeeInterface> {
    const feeSupperRaw: bigint = await this.contract.clientMessage(chain).read.gasFee([chainConfig[destinationChain].id, "0x123", gasLimit]) as bigint;
    const feeRaw: bigint = feeSupperRaw + feeSupperRaw / 100n;
    return {
      feeRaw: feeRaw,
      fee: parseFloat(divBigint(feeRaw, 10n ** 18n, 18))
    }
  }

  public async getFeeSolana(chain: Solana, gasLimit: bigint, provider: Provider): Promise<FeeInterface|null> {
    if ((await this.program.getNativeBalance(chain, provider.publicKey!)).balanceRaw == 0n) return null;

    const program = new Program(
        solanaClientIdl,
        new AnchorProvider(provider.connection, provider.wallet!, { commitment: 'confirmed' })
    )

    const lzOptions = Buffer.from(Options.newOptions().addExecutorLzReceiveOption(gasLimit).toBytes())

    const feeSupperRaw = BigInt((await program.methods.quoteSend(Buffer.from([1, 1]), lzOptions).accounts({
      store: this.program.pda.store(chain),
      messageInfo: this.program.pda.messageInfo(chain)
    }).remainingAccounts(await this.program.account.remainingAccountsForQuote(chain, provider.publicKey!)).view()).nativeFee.toString());

    const feeRaw: bigint = feeSupperRaw + feeSupperRaw / 100n;

    return {
      feeRaw: feeRaw,
      fee: parseFloat(divBigint(feeRaw, 10n ** 9n, 9)),
    }
  }

  public async fundHub(chain: EVM, value: bigint, wallet: any): Promise<`0x${string}`> {
    const tx = await wallet.sendTransaction({
      to: this.contract.hub(chain).address,
      value: value,
      account: wallet.account!,
      chain: this.contract.publicClient[chain]!.chain
    });
    await this.contract.publicClient[chain]?.waitForTransactionReceipt({ hash: tx });
    return tx;
  }

  public async getHubBalance(chain: EVM): Promise<BalanceInterface> {
    return this.contract.getNativeBalance(chain, this.contract.hub(chain).address);
  }

  public async receiveFundHub(chain: EVM, value: bigint, wallet: any): Promise<`0x${string}`> {
    const hub = this.contract.hub(chain);
    return await this.contract.writeContract(chain, hub.address, hub.abi, "receiveFund", [value], 0n, wallet)
  }
}