import { PublicKey } from "@solana/web3.js"
import { EndpointProgram, UlnProgram } from '@layerzerolabs/lz-solana-sdk-v2'
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { convertToBytes32, vecToBytes } from "../../utils/index";
import { endpoints } from '../layerzero';
import { Solana } from '../chain';

export const ids = {
  solanaDevnet: {
    PROGRAM_ID: new PublicKey("7vf6XHz6uepANiLrRNrzHdh9Cpf2ATMG4NHZryzCsDwJ"),
    DESTINATION_EID: 40161, // sepolia
    DESTINATION: convertToBytes32("0xb014bc8e152ef53f342511564538a744403773b3"),
  },
  solana: {
    PROGRAM_ID: new PublicKey("7vf6XHz6uepANiLrRNrzHdh9Cpf2ATMG4NHZryzCsDwJ"),
    DESTINATION_EID: 0,
    DESTINATION: convertToBytes32("0xb014bc8e152ef53f342511564538a744403773b3"),
  }
}

export const seeds = {
  CLIENT_SEED: Buffer.from("CLIENT_SEED"),
  CLIENT_VAULT_SEED: Buffer.from("CLIENT_VAULT_SEED"),
  MESSAGE_SEED: Buffer.from("MESSAGE_SEED"),
  LAST_MESSAGE_SEED: Buffer.from("LAST_MESSAGE_SEED"),
  STORE_SEED: Buffer.from("Store"),
  LZ_RECEIVE_TYPES_SEED: Buffer.from("LzReceiveTypes"),
  LINK_SEED: Buffer.from("LINK_SEED"),
}

export const pdas = {
  ata: (tokenMint: PublicKey, pubkey: PublicKey, isPda: boolean) => getAssociatedTokenAddressSync(tokenMint, pubkey, isPda),
  client: (chain: Solana) => PublicKey.findProgramAddressSync([seeds.CLIENT_SEED], ids[chain].PROGRAM_ID)[0],
  clientVault: (chain: Solana) => PublicKey.findProgramAddressSync([seeds.CLIENT_VAULT_SEED], ids[chain].PROGRAM_ID)[0],
  message: (chain: Solana) => PublicKey.findProgramAddressSync([seeds.MESSAGE_SEED], ids[chain].PROGRAM_ID)[0],
  lastMessage: (chain: Solana, pubkey: PublicKey) => PublicKey.findProgramAddressSync([seeds.LAST_MESSAGE_SEED, pubkey.toBuffer()], ids[chain].PROGRAM_ID)[0],
  store: (chain: Solana) => PublicKey.findProgramAddressSync([seeds.STORE_SEED], ids[chain].PROGRAM_ID)[0],
  lzReceiveTypes: (chain: Solana) => PublicKey.findProgramAddressSync([seeds.LZ_RECEIVE_TYPES_SEED, pdas.store(chain).toBuffer()], ids[chain].PROGRAM_ID)[0],
  link: (chain: Solana, pubkey: PublicKey) => PublicKey.findProgramAddressSync([seeds.LINK_SEED, pubkey.toBuffer()], ids[chain].PROGRAM_ID)[0],
}

export const accounts: any = {
  remainingAccountsForSend: async (chain: Solana, connection: any, pubkey: PublicKey) => {
    const endpoint = new EndpointProgram.Endpoint(endpoints[chain].endpoint as PublicKey);
    const sendLib = await endpoint.getSendLibrary(connection, pdas.store(chain), ids[chain].DESTINATION_EID);
    return await endpoint.getSendIXAccountMetaForCPI(
      connection,
      pubkey,
      {
        sender: vecToBytes(Array.from(pdas.store(chain).toBytes())),
        dstEid: ids[chain].DESTINATION_EID,
        receiver: ids[chain].DESTINATION
      },
      new UlnProgram.Uln(sendLib.programId)
    );
  },
  remainingAccountsForRegistryOApp: (chain: Solana, pubkey: PublicKey) => {
    const endpoint = new EndpointProgram.Endpoint(endpoints[chain].endpoint as PublicKey);
    return endpoint.getRegisterOappIxAccountMetaForCPI(pubkey, pdas.store(chain));
  },
  remainingAccountsForQuote: async (chain: Solana, connection: any, pubkey: PublicKey) => {
    const endpoint = new EndpointProgram.Endpoint(endpoints[chain].endpoint as PublicKey);
    const sendLib = await endpoint.getSendLibrary(connection, pdas.store(chain), ids[chain].DESTINATION_EID);
    return await endpoint.getQuoteIXAccountMetaForCPI(
      connection,
      pubkey,
      {
        sender: vecToBytes(Array.from(pdas.store(chain).toBytes())),
        dstEid: ids[chain].DESTINATION_EID,
        receiver: ids[chain].DESTINATION
      },
      new UlnProgram.Uln(sendLib.programId)
    );
  }
}