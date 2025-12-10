import { chain, Solana } from '../config/chain';
import { Program, AnchorProvider, Idl } from "@coral-xyz/anchor";
import solanaClientIdl from '../config/solana/idl/solana_client.json';
import { SolanaClient } from '../config/solana/types/solana_client';

export const provider = (chainType: Solana): AnchorProvider => new AnchorProvider(
  chain[chainType].connection!,
  {} as any,
  AnchorProvider.defaultOptions()
);


export const program = (chainType: Solana): Program<SolanaClient> => new Program<SolanaClient>(
  solanaClientIdl as Idl,
  provider(chainType)
);