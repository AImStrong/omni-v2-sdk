export default [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint32",
        "name": "chainId",
        "type": "uint32"
      },
      {
        "indexed": true,
        "internalType": "uint128",
        "name": "nonce",
        "type": "uint128"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "message",
        "type": "bytes"
      }
    ],
    "name": "MessageReceived",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint32",
        "name": "chainId",
        "type": "uint32"
      },
      {
        "indexed": true,
        "internalType": "uint128",
        "name": "nonce",
        "type": "uint128"
      }
    ],
    "name": "MessageResent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint32",
        "name": "chainId",
        "type": "uint32"
      },
      {
        "indexed": true,
        "internalType": "uint128",
        "name": "nonce",
        "type": "uint128"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "rawMessage",
        "type": "bytes"
      }
    ],
    "name": "MessageSent",
    "type": "event"
  },
  {
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "inputs": [],
    "name": "ADDRESSES_PROVIDER",
    "outputs": [
      {
        "internalType": "contract IAddressesProvider",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DEFAULT_CHAIN_ID",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DEFAULT_DESTINATION_CHAIN_ID",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "IS_HUB",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "chainId",
        "type": "uint32"
      }
    ],
    "name": "bridge",
    "outputs": [
      {
        "internalType": "contract IBridgeModule",
        "name": "module",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "chainId_",
        "type": "uint32"
      },
      {
        "internalType": "bytes",
        "name": "rawMessage_",
        "type": "bytes"
      },
      {
        "internalType": "uint128",
        "name": "gasLimit_",
        "type": "uint128"
      }
    ],
    "name": "gasFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "chainId",
        "type": "uint32"
      },
      {
        "internalType": "uint128",
        "name": "nonce",
        "type": "uint128"
      }
    ],
    "name": "inboundNonce",
    "outputs": [
      {
        "internalType": "bool",
        "name": "received",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IAddressesProvider",
        "name": "provider",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "bridge",
        "type": "address"
      }
    ],
    "name": "isBridge",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isBridge",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "chainId",
        "type": "uint32"
      },
      {
        "internalType": "uint128",
        "name": "nonce",
        "type": "uint128"
      }
    ],
    "name": "messageSent",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "chainId",
        "type": "uint32"
      }
    ],
    "name": "outboundNonce",
    "outputs": [
      {
        "internalType": "uint128",
        "name": "nonce",
        "type": "uint128"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "rawMessage_",
        "type": "bytes"
      }
    ],
    "name": "receiveMessage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "chainId_",
        "type": "uint32"
      },
      {
        "internalType": "uint128",
        "name": "nonce_",
        "type": "uint128"
      },
      {
        "internalType": "uint128",
        "name": "gasLimit_",
        "type": "uint128"
      }
    ],
    "name": "resendMessage",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "chainId_",
        "type": "uint32"
      },
      {
        "internalType": "bytes",
        "name": "rawMessage_",
        "type": "bytes"
      },
      {
        "internalType": "uint128",
        "name": "gasLimit_",
        "type": "uint128"
      }
    ],
    "name": "sendMessage",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "destinationChainid_",
        "type": "uint32"
      },
      {
        "internalType": "address",
        "name": "bridge_",
        "type": "address"
      }
    ],
    "name": "setBridge",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "chainId_",
        "type": "uint32"
      }
    ],
    "name": "setDefaultDestinationChainId",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];
