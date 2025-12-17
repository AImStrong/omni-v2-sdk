import { EVM, chain, Chain } from '../../config/chain';
import { EVMOptions, hubMessage, hub } from '../../config/evm/contract';
import { createPublicClient, http } from 'viem';

interface HubToClientBalanceInterface {
  balanceRaw: bigint;
  balanceRawNeededToBridge: bigint;
}

export async function hubToClientBalance(
  hubChain: EVM,
  clientChain: Chain,
  options: EVMOptions = {}
): Promise<HubToClientBalanceInterface> {
  const publicClient = createPublicClient({
    chain: chain[hubChain].viem,
    transport: http(options.rpc ? options.rpc : chain[hubChain].rpc)
  });

  const [balanceRaw, feeRaw] = await Promise.all([
    publicClient.getBalance({address: hub(hubChain, options).address}),
    hubMessage(hubChain, options).read.gasFee([chain[clientChain].id, "0x123", 500_000n])
  ])

  const balanceRawNeededToBridge: bigint = (balanceRaw < feeRaw) ? feeRaw - balanceRaw : 0n;

  return {
    balanceRaw: balanceRaw,
    balanceRawNeededToBridge: balanceRawNeededToBridge
  }
}