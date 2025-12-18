import { AccountMeta, PublicKey } from "@solana/web3.js"
import { EndpointProgram, UlnProgram } from '@layerzerolabs/lz-solana-sdk-v2';
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { vecToBytes } from "../../utils/index.ts";
import { endpoints, chainIdToEid } from '../layerzero.ts';
import { Solana } from '../chain.ts';
import { solanaClientProgram, SolanaOptions } from './program.ts';

export const seeds = {
    CLIENT_SEED: Buffer.from("CLIENT_SEED"),
    CLIENT_INFO_SEED: Buffer.from("CLIENT_INFO_SEED"),
    MESSAGE_INFO_SEED: Buffer.from("MESSAGE_INFO_SEED"),
    STORE_SEED: Buffer.from("Store"),
    LZ_RECEIVE_TYPES_SEED: Buffer.from("LzReceiveTypes"),
    PENDING_ACCOUNT_INFO_SEED: Buffer.from("PENDING_ACCOUNT_INFO_SEED"),
}

export const pdas = {
    ata: (tokenMint: PublicKey, pubkey: PublicKey, isPda: boolean) => getAssociatedTokenAddressSync(tokenMint, pubkey, isPda),
    client: (chainType: Solana) => PublicKey.findProgramAddressSync([seeds.CLIENT_SEED], solanaClientProgram(chainType).programId)[0],
    clientInfo: (chainType: Solana) => PublicKey.findProgramAddressSync([seeds.CLIENT_INFO_SEED], solanaClientProgram(chainType).programId)[0],
    messageInfo: (chainType: Solana) => PublicKey.findProgramAddressSync([seeds.MESSAGE_INFO_SEED], solanaClientProgram(chainType).programId)[0],
    store: (chainType: Solana) => PublicKey.findProgramAddressSync([seeds.STORE_SEED], solanaClientProgram(chainType).programId)[0],
    lzReceiveTypes: (chainType: Solana) => PublicKey.findProgramAddressSync([seeds.LZ_RECEIVE_TYPES_SEED, pdas.store(chainType).toBuffer()], solanaClientProgram(chainType).programId)[0],
    pendingAccountInfo: (chainType: Solana, pubkey: PublicKey) => PublicKey.findProgramAddressSync([seeds.PENDING_ACCOUNT_INFO_SEED, pubkey.toBuffer()], solanaClientProgram(chainType).programId)[0],
}

export const accounts: {
    remainingAccountsForSend: (chainType: Solana, pubkey: PublicKey, options?: SolanaOptions) => Promise<AccountMeta[]>;
    remainingAccountsForRegisterOApp: (chainType: Solana, pubkey: PublicKey) => AccountMeta[];
    remainingAccountsForQuote: (chainType: Solana, pubkey: PublicKey, options?: SolanaOptions) => Promise<AccountMeta[]>;
} = {
    remainingAccountsForSend: async (chainType: Solana, pubkey: PublicKey, options: SolanaOptions = {}) => {
        const endpoint = new EndpointProgram.Endpoint(endpoints[chainType].endpoint as PublicKey);
        const program = solanaClientProgram(chainType, options);
        const message_info = await program.account.messageInfo.fetch(pdas.messageInfo(chainType));
        const sendLib = await endpoint.getSendLibrary(program.provider.connection as any, pdas.store(chainType), chainIdToEid[message_info.destinationChainId]);

        return await endpoint.getSendIXAccountMetaForCPI(
            program.provider.connection as any,
            pubkey,
            {
                sender: vecToBytes(Array.from(pdas.store(chainType).toBytes())),
                dstEid: chainIdToEid[message_info.destinationChainId],
                receiver: vecToBytes(Array.from(message_info.destination))
            },
            new UlnProgram.Uln(sendLib.programId)
        );
    },
    remainingAccountsForRegisterOApp: (chainType: Solana, pubkey: PublicKey) => {
        const endpoint = new EndpointProgram.Endpoint(endpoints[chainType].endpoint as PublicKey);
        return endpoint.getRegisterOappIxAccountMetaForCPI(pubkey, pdas.store(chainType));
    },
    remainingAccountsForQuote: async (chainType: Solana, pubkey: PublicKey, options: SolanaOptions = {}) => {
        const endpoint = new EndpointProgram.Endpoint(endpoints[chainType].endpoint as PublicKey);
        const program = solanaClientProgram(chainType, options);
        const message_info = await program.account.messageInfo.fetch(pdas.messageInfo(chainType));
        const sendLib = await endpoint.getSendLibrary(program.provider.connection as any, pdas.store(chainType), chainIdToEid[message_info.destinationChainId]);

        return await endpoint.getQuoteIXAccountMetaForCPI(
            program.provider.connection as any,
            pubkey,
            {
                sender: vecToBytes(Array.from(pdas.store(chainType).toBytes())),
                dstEid: chainIdToEid[message_info.destinationChainId],
                receiver: vecToBytes(Array.from(message_info.destination))
            },
            new UlnProgram.Uln(sendLib.programId)
        );
    }
}