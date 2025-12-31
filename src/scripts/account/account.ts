import { PublicKey, SystemProgram } from '@solana/web3.js';
import { EVM, Solana } from '../../config/chain';
import { ContractEVM } from '../../config/evm/contract.evm';
import { ProgramSolana } from '../../config/solana/program.solana';
import { bytesToVec, convertToBytes32, divBigint, numberToBytes32, vecToBase58, vecToBytes } from '../../utils';
import { encodeFunctionData } from 'viem';
import { Provider } from '@coral-xyz/anchor';

interface AddressDetechedInterface {
  address: string;
  chain: "evm" | "solana"
}

interface FeeInterface {
  feeRaw: bigint;
  fee: number;
}

export class Account {
  public contract: ContractEVM;
  public program: ProgramSolana;

  constructor(__contract__: ContractEVM, __program__: ProgramSolana) {
    this.contract = __contract__;
    this.program = __program__
  }

  public async getAccount(chain: EVM, user: string): Promise<`0x${string}`> {
    return await this.contract.accountManager(chain).read.getAccount([convertToBytes32(user)]) as `0x${string}`;
  }

  public async getSalt(chain: EVM, user: string): Promise<bigint> {
    return await this.contract.accountManager(chain).read.userToSalt([convertToBytes32(user)]) as bigint;
  }

  public async getAccountBySalt(chain: EVM, salt: bigint): Promise<`0x${string}`> {
    return await this.contract.accountManager(chain).read.getAccountBySalt([salt]) as `0x${string}`;
  }

  public async getSaltGroup(chain: EVM, salt: bigint): Promise<AddressDetechedInterface[]> {
    const group = await this.contract.accountManager(chain).read.getSaltGroup([salt]) as `0x${string}`[];
    const detechedGroup: AddressDetechedInterface[] = [];
    for (let i = 0; i < group.length; i++) {
      if (/^0{24}$/i.test(group[i].slice(2, 2 + 24))) {
        detechedGroup.push({
          address: "0x" + group[i].slice(-40),
          chain: "evm"
        })
      }
      else {
        detechedGroup.push({
          address: vecToBase58(bytesToVec(group[i])),
          chain: "solana"
        })
      }
    }
    return detechedGroup;
  }

  public async createAccount(chain: EVM, user: string, wallet: any): Promise<`0x${string}`> {
    const accountManager = this.contract.accountManager(chain);
    return await this.contract.writeContract(chain, accountManager.address, accountManager.abi, "createAccount", [convertToBytes32(user)], 0n, wallet);
  }

  public async getPendingAccountEVM(chain: EVM, user: `0x${string}`): Promise<`0x${string}`> {
    return await this.contract.hub(chain).read.pendingAccount([user]) as `0x${string}`;
  }

  public async getPendingAccountSolana(chain: Solana, user: string): Promise<`0x${string}`> {
    try {
      const pending_account = await this.program.solanaClient[chain]!.account.pendingAccountInfo.fetch(this.program.pda.pendingAccountInfo(chain, new PublicKey(user)));
      return vecToBytes(pending_account.account);
    } catch {
      return numberToBytes32(0);
    }
  }

  public async getPendingAccountFeeEVM(chain: EVM): Promise<FeeInterface> {
    const feeRaw = await this.contract.hub(chain).read.pendingAccountFee() as bigint;
    return {
      feeRaw: feeRaw,
      fee: parseFloat(divBigint(feeRaw, 10n ** 18n))
    }
  }

  public async getPendingAccountFeeSolana(chain: Solana): Promise<FeeInterface> {
    const client_info = await this.program.solanaClient[chain]!.account.clientInfo.fetch(this.program.pda.clientInfo(chain));
    const feeRaw = BigInt(client_info.pendingAccountFee.toString());
    return {
      feeRaw: feeRaw,
      fee: parseFloat(divBigint(feeRaw, 10n ** 9n))
    }
  }

  public async setPendingAccountEVM(chain: EVM, account: string, wallet: any): Promise<`0x${string}`> {
    const hub = this.contract.hub(chain);
    return await this.contract.writeContract(chain, hub.address, hub.abi, 'setPendingAccount', [convertToBytes32(account)], (await this.getPendingAccountFeeEVM(chain)).feeRaw, wallet);
  }

  public async setPendingAccountSolana(chain: Solana, account: string, provider: Provider): Promise<string> {
    const ix = await this.program.solanaClient[chain]!.methods.setPendingAccount(bytesToVec(convertToBytes32(account))).accounts({
      clientInfo: this.program.pda.clientInfo(chain),
      client: this.program.pda.client(chain),
      pendingAccount: this.program.pda.pendingAccountInfo(chain, provider.publicKey!),
      signer: provider.publicKey!,
      systemProgram: SystemProgram.programId
    }).instruction();
    return (await this.program.sendAndConfirm(ix, provider));
  }

  public async isHubPermit(chain: EVM, user: `0x${string}`): Promise<boolean> {
    return await this.contract.hub(chain).read.hubPermit([user]) as boolean;
  }

  public async isRequestLinking(
    hubChain: EVM,
    chain1: "evm" | "solana" | "solanaDevnet", acc1: string,
    chain2: "evm" | "solana" | "solanaDevnet", acc2: string,
  ): Promise<boolean> {
    if (chain1 == 'evm') {
      if ((await this.getPendingAccountEVM(hubChain, acc1 as `0x${string}`)) != convertToBytes32(acc2)) return false;
    } else if (chain1 == 'solana' || chain1 == 'solanaDevnet') {
      if ((await this.getPendingAccountSolana(chain1, acc1)) != convertToBytes32(acc2)) return false;
    }

    if (chain2 == 'evm') {
      if ((await this.getPendingAccountEVM(hubChain, acc2 as `0x${string}`)) != convertToBytes32(acc1)) return false;
    } else if (chain2 == 'solana' || chain2 == 'solanaDevnet') {
      if ((await this.getPendingAccountSolana(chain2, acc2)) != convertToBytes32(acc1)) return false;
    }

    return true;
  }

  public async isRequestUnlinking(
    hubChain: EVM,
    chain: "evm" | "solana" | "solanaDevnet", acc: string
  ): Promise<boolean> {
    if (chain == 'evm') {
      if ((await this.getPendingAccountEVM(hubChain, acc as `0x${string}`)) != convertToBytes32(acc)) return false;
    } else if (chain == 'solana' || chain == 'solanaDevnet') {
      if ((await this.getPendingAccountSolana(chain, acc)) != convertToBytes32(acc)) return false;
    }

    return true;
  }

  public async isLinked(chain: EVM, account1: string, account2: string): Promise<boolean> {
    const accountManagerContract = this.contract.accountManager(chain);

    const data: any = await this.contract.multicall(chain).read.read([[
      {
        to: accountManagerContract.address,
        value: 0,
        data: encodeFunctionData({ abi: accountManagerContract.abi, functionName: "userToSalt", args: [convertToBytes32(account1)] })
      },
      {
        to: accountManagerContract.address,
        value: 0,
        data: encodeFunctionData({ abi: accountManagerContract.abi, functionName: "userToSalt", args: [convertToBytes32(account2)] })
      }
    ]]);

    if (BigInt(data[0]) == 0n) return false;
    return BigInt(data[0]) == BigInt(data[1]);
  }

  public async linkAccount(chain: EVM, salt: bigint, account: string, wallet: any): Promise<`0x${string}`> {
    const hub = this.contract.hub(chain);
    return await this.contract.writeContract(chain, hub.address, hub.abi, "linkAccount", [salt, convertToBytes32(account)], 0n, wallet);
  }

  public async unlinkAccount(chain: EVM, salt: bigint, account: string, wallet: any): Promise<`0x${string}`> {
    const hub = this.contract.hub(chain);
    return await this.contract.writeContract(chain, hub.address, hub.abi, "unlinkAccount", [salt, convertToBytes32(account)], 0n, wallet);
  }
}