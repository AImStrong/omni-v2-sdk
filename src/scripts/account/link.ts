import { convertToBytes32, vecToBytes } from '../../utils/index';
import { PublicKey } from "@solana/web3.js";
import { EVM } from '../../config/chain';
import { pdas } from '../../config/solana/config.solana';
import { accountManager, EVMOptions, hub } from '../../config/evm/contract.evm';
import { solanaClientProgram, SolanaOptions } from '../../config/solana/program.solana';

export async function hubPermit(
  hubChain: EVM,
  user: `0x{string}`,
  options: EVMOptions = {}
): Promise<boolean> {
  return (await hub(hubChain, options).read.hubPermit([user]) as boolean);
}

export async function isRequestLinking(
  hubChain: EVM,
  chain1: "evm" | "solana" | "solanaDevnet", acc1: string,
  chain2: "evm" | "solana" | "solanaDevnet", acc2: string,
  evmOptions: EVMOptions = {},
  solanaOptions: SolanaOptions = {},
): Promise<boolean> {
  const hubContract = hub(hubChain, evmOptions);

  // acc1
  if (chain1 == "evm") {
    const pending = await hubContract.read.pendingAccount([acc1]);
    if (pending != convertToBytes32(acc2)) return false;
  }
  else if (chain1 == "solana" || chain1 == "solanaDevnet") {
    try {
      const pending = await solanaClientProgram(chain1, solanaOptions).account.pendingAccountInfo.fetch(pdas.pendingAccountInfo(chain1, new PublicKey(acc1)));
      if (vecToBytes(pending.account) != convertToBytes32(acc2)) return false;
    } catch {
      return false;
    }
  }

  // acc2
  if (chain2 == "evm") {
    const pending = await hubContract.read.pendingAccount([acc2]);
    if (pending != convertToBytes32(acc1)) return false;
  }
  else if (chain2 == "solana" || chain2 == "solanaDevnet") {
    try {
      const pending = await solanaClientProgram(chain2, solanaOptions).account.pendingAccountInfo.fetch(pdas.pendingAccountInfo(chain2, new PublicKey(acc2)));
      if (vecToBytes(pending.account) != convertToBytes32(acc1)) return false;
    } catch {
      return false;
    }
  }

  return true;
}

export async function isRequestUnlinking(
  hubChain: EVM,
  chain: "evm" | "solana" | "solanaDevnet", acc: string,
  evmOptions: EVMOptions = {},
  solanaOptions: SolanaOptions = {}
): Promise<boolean> {
  if (chain == "evm") {
    const pending = await hub(hubChain, evmOptions).read.pendingAccount([acc]);
    if (pending != convertToBytes32(acc)) return false;
  }
  else if (chain == "solana" || chain == "solanaDevnet") {
    try {
      const link = await solanaClientProgram(chain, solanaOptions).account.pendingAccountInfo.fetch(pdas.pendingAccountInfo(chain, new PublicKey(acc)));
      if (vecToBytes(link.account) != convertToBytes32(acc)) return false;
    } catch {
      return false;
    }
  }

  return true;
}

export async function isLinked(
  hubChain: EVM,
  acc1: string,
  acc2: string,
  options: EVMOptions = {}
): Promise<boolean> {
  const accountManagerContract = accountManager(hubChain, options);

  const [salt1, salt2] = await Promise.all([
    accountManagerContract.read.userToSalt([convertToBytes32(acc1)]),
    accountManagerContract.read.userToSalt([convertToBytes32(acc2)])
  ])

  if (salt1 == 0n) return false;
  return salt1 == salt2;
}