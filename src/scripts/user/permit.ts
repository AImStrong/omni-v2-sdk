import { EVM, chain } from '../../config/chain';
import { token, EVMOptions } from '../../config/evm/contract.evm';
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