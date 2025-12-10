import { PublicKey } from "@solana/web3.js";

export const assets = {
  solana: {
    USDC: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
    USDT: new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"),
    WSOL: new PublicKey("So11111111111111111111111111111111111111112"),
  },
  solanaDevnet: {
    USDT: new PublicKey("3QVttuQ9p1ZLVTYw2UVkWdnHKbo7y8CKdnqd3SXwUjtS"),
  }
}