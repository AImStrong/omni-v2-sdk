import { EVM, chain } from '../../config/chain';
import { token, EVMOptions } from '../../config/evm/contract';
import { parseSignature } from 'viem';

export async function isERC20Permit(
  chainType: EVM, 
  assetAddress: `0x{string}`,
  options: EVMOptions = {}
): Promise<boolean> {
  try {
    await token(chainType, assetAddress, options).read.DOMAIN_SEPARATOR();
    return true;
  } catch {
    return false;
  }
}

interface PermitInterface {
  deadline: bigint;
  permitV: number;
  permitR: `0x{string}`;
  permitS: `0x{string}`
}

export async function getPermit(
  chainType: EVM, 
  assetAddress: `0x{string}`,
  spender: `0x{string}`, 
  amount: bigint,
  options: EVMOptions = {}
): Promise<PermitInterface|null> {
  if (!options.wallet) return null;

  const asset = token(chainType, assetAddress, options);

  try {
    await asset.read.DOMAIN_SEPARATOR();
  } catch (error) {
    return null;
  }
  
  const chainId = chain[chainType].id;

  const [name, nonce] = await Promise.all([
    asset.read.name(),
    asset.read.nonces([options.wallet.account.address])
  ]);

  const deadline = Math.floor(Date.now() / 1000) + 3600;

  const domain = {
    name: name,
    version: "1",
    chainId: chainId,
    verifyingContract: asset.address,
  };

  const types = {
    Permit: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  };

  const message = {
    owner: options.wallet.account.address,
    spender: spender,
    value: amount,
    nonce,
    deadline
  };

  const signature = await options.wallet.signTypedData({
    account: options.wallet.account,
    domain: domain as any,
    types: types,
    primaryType: "Permit",
    message: message,
  });

  const { v, r, s } = parseSignature(signature);

  return {
    deadline: BigInt(deadline),
    permitV: Number(v)!,
    permitR: r as `0x{string}`,
    permitS: s as `0x{string}`
  }
}