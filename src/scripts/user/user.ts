import { Provider } from "@coral-xyz/anchor";
import { EVM, Solana } from "../../config/chain";
import { ContractEVM } from "../../config/evm/contract.evm";
import { ProgramSolana } from "../../config/solana/program.solana";
import { convertToBytes32 } from "../../utils";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import { PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { createAssociatedTokenAccountInstruction, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import BN from 'bn.js';

interface ERC20PermitInterface {
  deadline: bigint;
  permitV: number;
  permitR: `0x${string}`;
  permitS: `0x${string}`
}

export class User {
  public contract: ContractEVM;
  public program: ProgramSolana;

  constructor(__contract__: ContractEVM, __program__: ProgramSolana) {
    this.contract = __contract__;
    this.program = __program__
  }

  public async supplyEVM(chain: EVM, asset: `0x${string}`, amount: bigint, gasLimit: bigint, gasFee: bigint, onBehalf: string, wallet: any): Promise<`0x${string}`> {
    const client = this.contract.client(chain);
    return await this.contract.writeContract(
      chain,
      client.address, client.abi,
      "supply",
      [convertToBytes32(onBehalf), asset, amount, gasLimit],
      gasFee,
      wallet
    );
  }

  public async supplyWithPermitEVM(chain: EVM, asset: `0x${string}`, amount: bigint, gasLimit: bigint, gasFee: bigint, onBehalf: string, permit: ERC20PermitInterface, wallet: any): Promise<`0x${string}`> {
    const client = this.contract.client(chain);
    return await this.contract.writeContract(
      chain,
      client.address, client.abi,
      "supplyWithPermit",
      [
        convertToBytes32(onBehalf), asset, amount, gasLimit,
        permit.deadline, permit.permitV, permit.permitR, permit.permitS
      ],
      gasFee,
      wallet
    );
  }

  public async supplySolana(chain: Solana, asset: string, amount: bigint, gasLimit: bigint, gasFee: bigint, onBehalf: string, provider: Provider): Promise<string> {
    const options = Buffer.from(Options.newOptions().addExecutorLzReceiveOption(gasLimit).toBytes());
    const tokenMint = new PublicKey(asset);

    const ixs: TransactionInstruction[] = [];

    if (!(await provider.connection.getAccountInfo(this.program.pda.ata(tokenMint, this.program.pda.client(chain), true)))) {
      ixs.push(createAssociatedTokenAccountInstruction(
        provider.publicKey!,
        this.program.pda.ata(tokenMint, this.program.pda.client(chain), true),
        this.program.pda.client(chain),
        tokenMint
      ))
    }

    if (!(await provider.connection.getAccountInfo(this.program.pda.ata(tokenMint, provider.publicKey!, false)))) {
      ixs.push(createAssociatedTokenAccountInstruction(
        provider.publicKey!,
        this.program.pda.ata(tokenMint, provider.publicKey!, false),
        provider.publicKey!,
        tokenMint
      ))
    }

    const ix = await this.program.solanaClient[chain]!.methods.supplyToken(Array.from((new PublicKey(onBehalf)).toBytes()), new BN(amount), options, new BN(gasFee)).accounts({
      clientInfo: this.program.pda.clientInfo(chain),
      client: this.program.pda.client(chain),
      messageInfo: this.program.pda.messageInfo(chain),
      tokenMint: tokenMint,
      payer: provider.publicKey,
      payerAta: this.program.pda.ata(tokenMint, provider.publicKey!, false),
      clientAta: this.program.pda.ata(tokenMint, this.program.pda.client(chain), true),
      store: this.program.pda.store(chain),
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId
    }).remainingAccounts(await this.program.account.remainingAccountsForSend(chain, provider.publicKey!)).instruction();

    ixs.push(ix);

    const sig = await this.program.sendAndConfirmWithComputeUnit(ixs, 300_000, provider);
    return sig;
  }

  public async withdrawEVM(chain: EVM, asset: `0x${string}`, amount: bigint, gasLimit: bigint, gasFee: bigint, onBehalf: string, wallet: any): Promise<`0x${string}`> {
    const client = this.contract.client(chain);
    return await this.contract.writeContract(
      chain,
      client.address, client.abi,
      "withdraw",
      [convertToBytes32(onBehalf), asset, amount, gasLimit],
      gasFee,
      wallet
    );
  }

  public async withdrawSolana(chain: Solana, asset: string, amount: bigint, gasLimit: bigint, gasFee: bigint, onBehalf: string, provider: Provider): Promise<string> {
    const options = Buffer.from(Options.newOptions().addExecutorLzReceiveOption(gasLimit).toBytes());
    const tokenMint = new PublicKey(asset);

    const ixs: TransactionInstruction[] = [];

    if (!(await provider.connection.getAccountInfo(this.program.pda.ata(tokenMint, this.program.pda.client(chain), true)))) {
      ixs.push(createAssociatedTokenAccountInstruction(
        provider.publicKey!,
        this.program.pda.ata(tokenMint, this.program.pda.client(chain), true),
        this.program.pda.client(chain),
        tokenMint
      ))
    }

    if (!(await provider.connection.getAccountInfo(this.program.pda.ata(tokenMint, provider.publicKey!, false)))) {
      ixs.push(createAssociatedTokenAccountInstruction(
        provider.publicKey!,
        this.program.pda.ata(tokenMint, provider.publicKey!, false),
        provider.publicKey!,
        tokenMint
      ))
    }

    const ix = await this.program.solanaClient[chain]!.methods.withdrawToken(Array.from((new PublicKey(onBehalf)).toBytes()), new BN(amount), options, new BN(gasFee)).accounts({
      clientInfo: this.program.pda.clientInfo(chain),
      client: this.program.pda.client(chain),
      messageInfo: this.program.pda.messageInfo(chain),
      tokenMint: tokenMint,
      receiver: provider.publicKey,
      receiverAta: this.program.pda.ata(tokenMint, provider.publicKey!, false),
      clientAta: this.program.pda.ata(tokenMint, this.program.pda.client(chain), true),
      store: this.program.pda.store(chain),
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId
    }).remainingAccounts(await this.program.account.remainingAccountsForSend(chain, provider.publicKey!)).instruction();

    ixs.push(ix);

    const sig = await this.program.sendAndConfirmWithComputeUnit(ixs, 300_000, provider);
    return sig;
  }

  public async borrowEVM(chain: EVM, asset: `0x${string}`, amount: bigint, gasLimit: bigint, gasFee: bigint, onBehalf: string, wallet: any): Promise<`0x${string}`> {
    const client = this.contract.client(chain);
    return await this.contract.writeContract(
      chain,
      client.address, client.abi,
      "borrow",
      [convertToBytes32(onBehalf), asset, amount, gasLimit],
      gasFee,
      wallet
    );
  }

  public async borrowSolana(chain: Solana, asset: string, amount: bigint, gasLimit: bigint, gasFee: bigint, onBehalf: string, provider: Provider): Promise<string> {
    const options = Buffer.from(Options.newOptions().addExecutorLzReceiveOption(gasLimit).toBytes());
    const tokenMint = new PublicKey(asset);

    const ixs: TransactionInstruction[] = [];

    if (!(await provider.connection.getAccountInfo(this.program.pda.ata(tokenMint, this.program.pda.client(chain), true)))) {
      ixs.push(createAssociatedTokenAccountInstruction(
        provider.publicKey!,
        this.program.pda.ata(tokenMint, this.program.pda.client(chain), true),
        this.program.pda.client(chain),
        tokenMint
      ))
    }

    if (!(await provider.connection.getAccountInfo(this.program.pda.ata(tokenMint, provider.publicKey!, false)))) {
      ixs.push(createAssociatedTokenAccountInstruction(
        provider.publicKey!,
        this.program.pda.ata(tokenMint, provider.publicKey!, false),
        provider.publicKey!,
        tokenMint
      ))
    }

    const ix = await this.program.solanaClient[chain]!.methods.borrowToken(Array.from((new PublicKey(onBehalf)).toBytes()), new BN(amount), options, new BN(gasFee)).accounts({
      clientInfo: this.program.pda.clientInfo(chain),
      client: this.program.pda.client(chain),
      messageInfo: this.program.pda.messageInfo(chain),
      tokenMint: tokenMint,
      receiver: provider.publicKey,
      receiverAta: this.program.pda.ata(tokenMint, provider.publicKey!, false),
      clientAta: this.program.pda.ata(tokenMint, this.program.pda.client(chain), true),
      store: this.program.pda.store(chain),
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId
    }).remainingAccounts(await this.program.account.remainingAccountsForSend(chain, provider.publicKey!)).instruction();

    ixs.push(ix);

    const sig = await this.program.sendAndConfirmWithComputeUnit(ixs, 300_000, provider);
    return sig;
  }

  public async repayEVM(chain: EVM, asset: `0x${string}`, amount: bigint, gasLimit: bigint, gasFee: bigint, onBehalf: string, wallet: any): Promise<`0x${string}`> {
    const client = this.contract.client(chain);
    return await this.contract.writeContract(
      chain,
      client.address, client.abi,
      "repay",
      [convertToBytes32(onBehalf), asset, amount, gasLimit],
      gasFee,
      wallet
    );
  }

  public async repayWithPermitEVM(chain: EVM, asset: `0x${string}`, amount: bigint, gasLimit: bigint, gasFee: bigint, onBehalf: string, permit: ERC20PermitInterface, wallet: any): Promise<`0x${string}`> {
    const client = this.contract.client(chain);
    return await this.contract.writeContract(
      chain,
      client.address, client.abi,
      "repayWithPermit",
      [
        convertToBytes32(onBehalf), asset, amount, gasLimit,
        permit.deadline, permit.permitV, permit.permitR, permit.permitS
      ],
      gasFee,
      wallet
    );
  }

  public async repaySolana(chain: Solana, asset: string, amount: bigint, gasLimit: bigint, gasFee: bigint, onBehalf: string, provider: Provider): Promise<string> {
    const options = Buffer.from(Options.newOptions().addExecutorLzReceiveOption(gasLimit).toBytes());
    const tokenMint = new PublicKey(asset);

    const ixs: TransactionInstruction[] = [];

    if (!(await provider.connection.getAccountInfo(this.program.pda.ata(tokenMint, this.program.pda.client(chain), true)))) {
      ixs.push(createAssociatedTokenAccountInstruction(
        provider.publicKey!,
        this.program.pda.ata(tokenMint, this.program.pda.client(chain), true),
        this.program.pda.client(chain),
        tokenMint
      ))
    }

    if (!(await provider.connection.getAccountInfo(this.program.pda.ata(tokenMint, provider.publicKey!, false)))) {
      ixs.push(createAssociatedTokenAccountInstruction(
        provider.publicKey!,
        this.program.pda.ata(tokenMint, provider.publicKey!, false),
        provider.publicKey!,
        tokenMint
      ))
    }

    const ix = await this.program.solanaClient[chain]!.methods.repayToken(Array.from((new PublicKey(onBehalf)).toBytes()), new BN(amount), options, new BN(gasFee)).accounts({
      clientInfo: this.program.pda.clientInfo(chain),
      client: this.program.pda.client(chain),
      messageInfo: this.program.pda.messageInfo(chain),
      tokenMint: tokenMint,
      payer: provider.publicKey,
      payerAta: this.program.pda.ata(tokenMint, provider.publicKey!, false),
      clientAta: this.program.pda.ata(tokenMint, this.program.pda.client(chain), true),
      store: this.program.pda.store(chain),
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId
    }).remainingAccounts(await this.program.account.remainingAccountsForSend(chain, provider.publicKey!)).instruction();

    ixs.push(ix);

    const sig = await this.program.sendAndConfirmWithComputeUnit(ixs, 300_000, provider);
    return sig;
  }

  public async setAsCollateralEVM(chain: EVM, asset: `0x${string}`, useAsCollateral: boolean, gasLimit: bigint, gasFee: bigint, wallet: any): Promise<`0x${string}`> {
    const client = this.contract.client(chain);
    return await this.contract.writeContract(
      chain,
      client.address, client.abi,
      "setAsCollateral",
      [asset, useAsCollateral, gasLimit],
      gasFee,
      wallet
    );
  }

  public async setAsCollateralSolana(chain: Solana, asset: string, useAsCollateral: boolean, gasLimit: bigint, gasFee: bigint, provider: Provider): Promise<string> {
    const options = Buffer.from(Options.newOptions().addExecutorLzReceiveOption(gasLimit).toBytes());
    const tokenMint = new PublicKey(asset);

    const ixs: TransactionInstruction[] = [];

    if (!(await provider.connection.getAccountInfo(this.program.pda.ata(tokenMint, this.program.pda.client(chain), true)))) {
      ixs.push(createAssociatedTokenAccountInstruction(
        provider.publicKey!,
        this.program.pda.ata(tokenMint, this.program.pda.client(chain), true),
        this.program.pda.client(chain),
        tokenMint
      ))
    }

    if (!(await provider.connection.getAccountInfo(this.program.pda.ata(tokenMint, provider.publicKey!, false)))) {
      ixs.push(createAssociatedTokenAccountInstruction(
        provider.publicKey!,
        this.program.pda.ata(tokenMint, provider.publicKey!, false),
        provider.publicKey!,
        tokenMint
      ))
    }

    const ix = await this.program.solanaClient[chain]!.methods.setAsCollateral(useAsCollateral, options, new BN(gasFee)).accounts({
      clientInfo: this.program.pda.clientInfo(chain),
      client: this.program.pda.client(chain),
      messageInfo: this.program.pda.messageInfo(chain),
      tokenMint: tokenMint,
      user: provider.publicKey,
      userAta: this.program.pda.ata(tokenMint, provider.publicKey!, false),
      clientAta: this.program.pda.ata(tokenMint, this.program.pda.client(chain), true),
      store: this.program.pda.store(chain),
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId
    }).remainingAccounts(await this.program.account.remainingAccountsForSend(chain, provider.publicKey!)).instruction();

    ixs.push(ix);

    const sig = await this.program.sendAndConfirmWithComputeUnit(ixs, 300_000, provider);
    return sig;
  }
}