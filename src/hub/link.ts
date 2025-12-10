import { convertToBytes32, vecToBytes } from '../utils/index';
import { PublicKey } from "@solana/web3.js";
import { EVM } from '../config/chain';
import { pdas } from '../config/solana/program';
import { solanaProgram } from '../contract-program-getter/index';
import { hub } from '../contract-program-getter/index';

export async function isRequestLinking(
  hubChain: EVM,
  chain1: "evm" | "solana" | "solanaDevnet", acc1: string,
  chain2: "evm" | "solana" | "solanaDevnet", acc2: string,
  options = { rpc: undefined }
): Promise<boolean> {
  // acc1
  if (chain1 == "evm") {
    const pending = await hub(hubChain, options.rpc).read.pendingAccount([acc1]);
    if (pending != convertToBytes32(acc2)) return false;
  }
  else if (chain1 == "solana" || chain1 == "solanaDevnet") {
    try {
      const link = await solanaProgram(chain1).account.link.fetch(pdas.link(chain1, new PublicKey(acc1)));
      if (vecToBytes(link.account) != convertToBytes32(acc2)) return false;
    } catch {
      return false;
    }
  }

  // acc2
  if (chain2 == "evm") {
    const pending = await hub(hubChain, options.rpc).read.pendingAccount([acc2]);
    if (pending != convertToBytes32(acc1)) return false;
  }
  else if (chain2 == "solana" || chain2 == "solanaDevnet") {
    try {
      const link = await solanaProgram(chain2).account.link.fetch(pdas.link("solanaDevnet", new PublicKey(acc2)));
      if (vecToBytes(link.account) != convertToBytes32(acc1)) return false;
    } catch {
      return false;
    }
  }

  return true;
}

export async function isRequestUnlinking(
  hubChain: EVM,
  chain: "evm" | "solana" | "solanaDevnet", acc: string,
  options = { rpc: undefined }
): Promise<boolean> {
  if (chain == "evm") {
    const pending = await hub(hubChain, options.rpc).read.pendingAccount([acc]);
    if (pending != convertToBytes32(acc)) return false;
  }
  else if (chain == "solana" || chain == "solanaDevnet") {
    try {
      const link = await solanaProgram(chain).account.link.fetch(pdas.link(chain, new PublicKey(acc)));
      if (vecToBytes(link.account) != convertToBytes32(acc)) return false;
    } catch {
      return false;
    }
  }

  return true;
}