import { ContractEVM } from "./config/evm/contract.evm";
import { ProgramSolana } from "./config/solana/program.solana";
import { Account } from './scripts/account/account';
import { Pool } from './scripts/pool/pool';
import { Asset } from './scripts/asset/asset';
import { Message } from './scripts/message/message';
import { User } from './scripts/user/user';
import { TrackTx } from './scripts/track-tx/track_tx';
import { EVM, Solana, ChainConfig } from "./config/chain";

export class OmniV2SDK {
  public contract: ContractEVM;
  public program: ProgramSolana;
  public account: Account;
  public asset: Asset;
  public pool: Pool;
  public message: Message;
  public user: User;
  public trackTx: TrackTx;

  constructor(
    evmConfig: Partial<Record<EVM, ChainConfig>> = {},
    solanaConfig: Partial<Record<Solana, ChainConfig>> = {}
  ) {
    this.contract = new ContractEVM(evmConfig);
    this.program = new ProgramSolana(solanaConfig);
    this.account = new Account(this.contract, this.program);
    this.asset = new Asset(this.contract, this.program);
    this.pool = new Pool(this.contract);
    this.message = new Message(this.contract, this.program);
    this.user = new User(this.contract, this.program);
    this.trackTx = new TrackTx();
  }
}