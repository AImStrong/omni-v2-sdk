export default {
  arbitrum: {
    USDC: {
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"
    },
    USDT: {
      name: "USD₮0",
      symbol: "USD₮0",
      decimals: 6,
      address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"
    },
    WETH: {
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"
    },
    WBTC: {
      name: "Wrapped BTC",
      symbol: "WBTC",
      decimals: 8,
      address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f"
    }
  },

  base: {
    USDC: {
      name: "USDC",
      symbol: "USDC",
      decimals: 6,
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
    },
    USDT: {
      name: "Bridged Tether USD",
      symbol: "USDT",
      decimals: 6,
      address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2"
    },
    WETH: {
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      address: "0x4200000000000000000000000000000000000006"
    },
    cbBTC: {
      name: "Coinbase Wrapped BTC",
      symbol: "cbBTC",
      decimals: 8,
      address: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf"
    }
  },

  bsc: {
    USDC: {
      name: "USD Coin",
      symbol: "USDC",
      decimals: 18,
      address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d"
    },
    USDT: {
      name: "Tether USD",
      symbol: "USDT",
      decimals: 18,
      address: "0x55d398326f99059fF775485246999027B3197955"
    },
    WBNB: {
      name: "Wrapped BNB",
      symbol: "WBNB",
      decimals: 18,
      address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
    }
  },

  solana: {},

  bscTestnet: {
    WBTC: {
      name: "Wrapped Bitcoin",
      symbol: "WBTC",
      decimals: 8,
      address: "0x11b5498e6a85ab62925a7e66fea707d096ee23f1"
    },
    SOL: {
      name: "Native Solana",
      symbol: "SOL",
      decimals: 9,
      address: "0xb28ee1f4ae2c8082a6c06c446c79ad8173d988e4"
    },
    DAI: {
      name: "Dai Stablecoin",
      symbol: "DAI",
      decimals: 18,
      address: "0x136fdfa51e67c0881dd189e5edc814bd796f49d2"
    }
  },

  sepolia: {
    USDC: {
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      address: "0xb293ebf681941cc4c83fd72b5eae39cc724bfdc7"
    },
    WETH: {
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      address: "0xf6bc69be9162fce10412175d96fea4c673bc3c74"
    }
  },

  solanaDevnet: {
    USDT: {
      name: "Solana Tether USD",
      symbol: "USDT",
      decimals: 9,
      address: "3QVttuQ9p1ZLVTYw2UVkWdnHKbo7y8CKdnqd3SXwUjtS"
    }
  }
}
