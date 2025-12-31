import { AccountMeta, ComputeBudgetProgram, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { ChainConfig, Solana, chainConfig } from "../chain.ts";
import { AnchorProvider, Program, Provider } from "@coral-xyz/anchor";
import solanaClientIdl from './idl/solana_client.json';
import { SolanaClient } from './types/solana_client.ts';
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { EndpointProgram, UlnProgram } from '@layerzerolabs/lz-solana-sdk-v2';
import { endpointConfig, chainIdToEid } from "../layerzero.ts";
import { divBigint, vecToBytes } from "../../utils/index.ts";
import { web3 } from "@coral-xyz/anchor";

interface BalanceInterface {
  balanceRaw: bigint;
  balance: number;
}

export class ProgramSolana {
  public config: Partial<Record<Solana, ChainConfig>> = {};
  public solanaClient: Partial<Record<Solana, Program<SolanaClient>>> = {};
  public endpoint: Partial<Record<Solana, EndpointProgram.Endpoint>> = {};

  constructor(newConfig: Partial<Record<Solana, ChainConfig>> = {}) {
    for (let [key, value] of Object.entries(chainConfig)) {
      if (value.connection) this.config[key as Solana] = value;
    }
    for (let [key, value] of Object.entries(newConfig)) {
      this.config[key as Solana] = value;
    }
    for (let [key, value] of Object.entries(this.config)) {
      this.solanaClient[key as Solana] = new Program(
        solanaClientIdl,
        new AnchorProvider(this.config[key as Solana]!.connection!, {} as any, { commitment: "confirmed" })
      ) as Program<SolanaClient>;

      this.endpoint[key as Solana] = new EndpointProgram.Endpoint(endpointConfig[key as Solana].endpoint as PublicKey);
    }
  }

  public seed: Record<string, Buffer> = {
    CLIENT_SEED: Buffer.from("CLIENT_SEED"),
    CLIENT_INFO_SEED: Buffer.from("CLIENT_INFO_SEED"),
    MESSAGE_INFO_SEED: Buffer.from("MESSAGE_INFO_SEED"),
    STORE_SEED: Buffer.from("Store"),
    LZ_RECEIVE_TYPES_SEED: Buffer.from("LzReceiveTypes"),
    PENDING_ACCOUNT_INFO_SEED: Buffer.from("PENDING_ACCOUNT_INFO_SEED"),
  }

  public pda = {
    ata: (tokenMint: PublicKey, pubkey: PublicKey, isPda: boolean) => getAssociatedTokenAddressSync(tokenMint, pubkey, isPda),
    client: (chain: Solana) => PublicKey.findProgramAddressSync([this.seed.CLIENT_SEED], this.solanaClient[chain]!.programId)[0],
    clientInfo: (chain: Solana) => PublicKey.findProgramAddressSync([this.seed.CLIENT_INFO_SEED], this.solanaClient[chain]!.programId)[0],
    messageInfo: (chain: Solana) => PublicKey.findProgramAddressSync([this.seed.MESSAGE_INFO_SEED], this.solanaClient[chain]!.programId)[0],
    store: (chain: Solana) => PublicKey.findProgramAddressSync([this.seed.STORE_SEED], this.solanaClient[chain]!.programId)[0],
    lzReceiveTypes: (chain: Solana) => PublicKey.findProgramAddressSync([this.seed.LZ_RECEIVE_TYPES_SEED, this.pda.store(chain).toBuffer()], this.solanaClient[chain]!.programId)[0],
    pendingAccountInfo: (chain: Solana, pubkey: PublicKey) => PublicKey.findProgramAddressSync([this.seed.PENDING_ACCOUNT_INFO_SEED, pubkey.toBuffer()], this.solanaClient[chain]!.programId)[0],
  }

  public account: {
    remainingAccountsForSend: (chain: Solana, pubkey: PublicKey) => Promise<AccountMeta[]>;
    remainingAccountsForRegisterOApp: (chain: Solana, pubkey: PublicKey) => AccountMeta[];
    remainingAccountsForQuote: (chain: Solana, pubkey: PublicKey) => Promise<AccountMeta[]>;
  } = {
      remainingAccountsForSend: async (chain: Solana, pubkey: PublicKey) => {
        const program = this.solanaClient[chain]!;
        const message_info = await program.account.messageInfo.fetch(this.pda.messageInfo(chain));
        const sendLib = await this.endpoint[chain]!.getSendLibrary(program.provider.connection as any, this.pda.store(chain), chainIdToEid[message_info.destinationChainId]);

        return await this.endpoint[chain]!.getSendIXAccountMetaForCPI(
          program.provider.connection as any,
          pubkey,
          {
            sender: vecToBytes(Array.from(this.pda.store(chain).toBytes())),
            dstEid: chainIdToEid[message_info.destinationChainId],
            receiver: vecToBytes(Array.from(message_info.destination))
          },
          new UlnProgram.Uln(sendLib.programId)
        );
      },
      remainingAccountsForRegisterOApp: (chain: Solana, pubkey: PublicKey) => {
        return this.endpoint[chain]!.getRegisterOappIxAccountMetaForCPI(pubkey, this.pda.store(chain));
      },
      remainingAccountsForQuote: async (chain: Solana, pubkey: PublicKey) => {
        const program = this.solanaClient[chain]!;
        const message_info = await program.account.messageInfo.fetch(this.pda.messageInfo(chain));
        const sendLib = await this.endpoint[chain]!.getSendLibrary(program.provider.connection as any, this.pda.store(chain), chainIdToEid[message_info.destinationChainId]);

        return await this.endpoint[chain]!.getQuoteIXAccountMetaForCPI(
          program.provider.connection as any,
          pubkey,
          {
            sender: vecToBytes(Array.from(this.pda.store(chain).toBytes())),
            dstEid: chainIdToEid[message_info.destinationChainId],
            receiver: vecToBytes(Array.from(message_info.destination))
          },
          new UlnProgram.Uln(sendLib.programId)
        );
      }
    }

  public async sendAndConfirm(ix: TransactionInstruction | TransactionInstruction[], provider: Provider) {
    const tx = new web3.Transaction().add(...(Array.isArray(ix) ? ix : [ix]));
    const sig = await provider.sendAndConfirm!(tx);
    return sig;
  }

  public async sendAndConfirmWithComputeUnit(ix: TransactionInstruction | TransactionInstruction[], computeUnit: number, provider: Provider) {
    const tx = new web3.Transaction().add(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: computeUnit
      }),
      ...(Array.isArray(ix) ? ix : [ix])
    );
    const sig = await provider.sendAndConfirm!(tx);
    return sig;
  }

  public async getNativeBalance(chain: Solana, pubkey: PublicKey): Promise<BalanceInterface> {
    try {
      const account = await this.config[chain]!.connection!.getAccountInfo(pubkey);
      if (!account) return { balanceRaw: 0n, balance: 0 };
      const balanceRaw = BigInt(account.lamports.toString());

      return {
        balanceRaw: balanceRaw,
        balance: parseFloat(divBigint(balanceRaw, 10n ** 9n))
      }
    } catch {
      return { balanceRaw: 0n, balance: 0 }
    }
  }
}