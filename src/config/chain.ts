import * as viemChains from "viem/chains";
import { Connection, clusterApiUrl } from "@solana/web3.js";

export type Chain = "sepolia" | "bscTestnet" | "arbitrum" | "base" | "bsc" | "solana" | "solanaDevnet";
export type EVM = "sepolia" | "bscTestnet" | "arbitrum" | "base" | "bsc";
export type Solana = "solana" | "solanaDevnet";

export interface ChainConfig {
  viem?: viemChains.Chain;
  id: number;
  rpc?: string;
  connection?: Connection;
}

export const chainConfig: Record<Chain, ChainConfig> = {
  sepolia: {
    viem: viemChains.sepolia,
    id: 11155111,
    rpc: "https://ethereum-sepolia-rpc.publicnode.com"
  },
  bscTestnet: {
    viem: viemChains.bscTestnet,
    id: 97,
    rpc: "https://bsc-testnet-rpc.publicnode.com",
  },
  arbitrum: {
    viem: viemChains.arbitrum,
    id: 42161,
    rpc: "https://arbitrum.drpc.org",
  },
  base: {
    viem: viemChains.base,
    id: 8453,
    rpc: "https://base.llamarpc.com",
  },
  bsc: {
    viem: viemChains.bsc,
    id: 56,
    rpc: "https://binance.llamarpc.com",
  },
  solana: {
    id: 101,
    connection: new Connection(clusterApiUrl("mainnet-beta"), "confirmed"),
  },
  solanaDevnet: {
    id: 103,
    connection: new Connection(clusterApiUrl("devnet"), "confirmed"),
  }
}

export const idToChain: Record<number, Chain> = {
  11155111          : "sepolia",
  97                : "bscTestnet",
  42161             : "arbitrum",
  8453              : "base",
  56                : "bsc",
  101               : "solana",
  103               : "solanaDevnet",
}