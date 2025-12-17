import { Connection } from "@solana/web3.js";
import { Solana, chain } from "../chain.ts";
import * as anchor from "@coral-xyz/anchor";
import solanaClientIdl from './idl/solana_client.json';
import { SolanaClient } from './types/solana_client.ts';

export interface SolanaOptions {
  connection?: Connection;
  wallet?: anchor.Wallet;
  provider?: anchor.Provider;
}

export const solanaClientProgram = (chainType: Solana, options: SolanaOptions = {}): anchor.Program<SolanaClient> => {
  let provider = options.provider;
  if (!provider) {
    provider = new anchor.AnchorProvider(
      options.connection ? options.connection : chain[chainType].connection!,
      options.wallet ? options.wallet : {} as any,
      { commitment: "confirmed" }
    );
  }

  return new anchor.Program(
    solanaClientIdl,
    provider
  ) as anchor.Program<SolanaClient>;
}