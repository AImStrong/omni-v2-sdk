import { Connection } from "@solana/web3.js";
import { Solana, chain } from "../chain.ts";
import { Provider, Program, AnchorProvider } from "@coral-xyz/anchor";
import solanaClientIdl from './idl/solana_client.json';
import { SolanaClient } from './types/solana_client.ts';

export interface SolanaOptions {
  connection?: Connection;
  wallet?: any;
  provider?: Provider;
}

export const solanaClientProgram = (chainType: Solana, options: SolanaOptions = {}): Program<SolanaClient> => {
  let provider = options.provider;
  if (!provider) {
    provider = new AnchorProvider(
      options.connection ? options.connection : chain[chainType].connection!,
      options.wallet ? options.wallet : {} as any,
      { commitment: "confirmed" }
    );
  }

  return new Program(
    solanaClientIdl,
    provider
  ) as Program<SolanaClient>;
}