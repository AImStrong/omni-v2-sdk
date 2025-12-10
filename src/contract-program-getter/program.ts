import { chain, Solana } from '../config/chain';
import { Program, AnchorProvider, Idl } from "@coral-xyz/anchor";
import solanaClientIdl from '../config/solana/idl/solana_client.json';
import { SolanaClient } from '../config/solana/types/solana_client';

export const solanaProvider = (chainType: Solana): AnchorProvider => new AnchorProvider(
  chain[chainType].connection!,
  {} as any,
  AnchorProvider.defaultOptions()
);

export const solanaProgram = (chainType: Solana): Program<SolanaClient> => new Program<SolanaClient>(
  solanaClientIdl as Idl,
  solanaProvider(chainType)
);