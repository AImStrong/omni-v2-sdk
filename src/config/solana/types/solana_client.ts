/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solana_client.json`.
 */
export type SolanaClient = {
  "address": "8oEZisP7U671sivnGDKcPPxR43xVn4CNhtQxDfiueUaT",
  "metadata": {
    "name": "solanaClient",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "approve",
      "discriminator": [
        69,
        74,
        217,
        36,
        115,
        117,
        97,
        76
      ],
      "accounts": [
        {
          "name": "clientInfo"
        },
        {
          "name": "client",
          "writable": true
        },
        {
          "name": "messageInfo",
          "writable": true
        },
        {
          "name": "tokenMint",
          "writable": true
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "ownerAta",
          "writable": true
        },
        {
          "name": "clientAta",
          "writable": true
        },
        {
          "name": "store"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram"
        }
      ],
      "args": [
        {
          "name": "spender",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "amount",
          "type": "u128"
        },
        {
          "name": "options",
          "type": "bytes"
        },
        {
          "name": "gasFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "borrowToken",
      "discriminator": [
        80,
        33,
        22,
        50,
        103,
        128,
        181,
        231
      ],
      "accounts": [
        {
          "name": "clientInfo"
        },
        {
          "name": "client",
          "writable": true
        },
        {
          "name": "messageInfo",
          "writable": true
        },
        {
          "name": "tokenMint",
          "writable": true
        },
        {
          "name": "receiver",
          "writable": true,
          "signer": true
        },
        {
          "name": "receiverAta",
          "writable": true
        },
        {
          "name": "clientAta",
          "writable": true
        },
        {
          "name": "store"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram"
        }
      ],
      "args": [
        {
          "name": "borrower",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "amount",
          "type": "u128"
        },
        {
          "name": "options",
          "type": "bytes"
        },
        {
          "name": "gasFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initClient",
      "discriminator": [
        30,
        50,
        186,
        118,
        60,
        68,
        27,
        155
      ],
      "accounts": [
        {
          "name": "clientInfo",
          "writable": true
        },
        {
          "name": "client",
          "writable": true
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram"
        }
      ],
      "args": []
    },
    {
      "name": "initMessage",
      "discriminator": [
        53,
        45,
        47,
        55,
        36,
        238,
        208,
        76
      ],
      "accounts": [
        {
          "name": "clientInfo"
        },
        {
          "name": "messageInfo",
          "writable": true
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram"
        }
      ],
      "args": [
        {
          "name": "defaultChainId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "initStore",
      "discriminator": [
        250,
        74,
        6,
        95,
        163,
        188,
        19,
        181
      ],
      "accounts": [
        {
          "name": "clientInfo"
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "store",
          "writable": true
        },
        {
          "name": "lzReceiveTypesAccounts",
          "writable": true
        },
        {
          "name": "systemProgram"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "initStoreParams"
            }
          }
        }
      ]
    },
    {
      "name": "interestBearingTokenTransfer",
      "discriminator": [
        133,
        124,
        218,
        3,
        176,
        218,
        144,
        208
      ],
      "accounts": [
        {
          "name": "clientInfo"
        },
        {
          "name": "client",
          "writable": true
        },
        {
          "name": "messageInfo",
          "writable": true
        },
        {
          "name": "tokenMint",
          "writable": true
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "ownerAta",
          "writable": true
        },
        {
          "name": "clientAta",
          "writable": true
        },
        {
          "name": "store"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram"
        }
      ],
      "args": [
        {
          "name": "spender",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "amount",
          "type": "u128"
        },
        {
          "name": "options",
          "type": "bytes"
        },
        {
          "name": "gasFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "liquidation",
      "discriminator": [
        73,
        229,
        88,
        235,
        101,
        34,
        69,
        90
      ],
      "accounts": [
        {
          "name": "clientInfo"
        },
        {
          "name": "client",
          "writable": true
        },
        {
          "name": "messageInfo",
          "writable": true
        },
        {
          "name": "debt",
          "writable": true
        },
        {
          "name": "liquidator",
          "writable": true,
          "signer": true
        },
        {
          "name": "liquidatorAta",
          "writable": true
        },
        {
          "name": "clientAta",
          "writable": true
        },
        {
          "name": "store"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram"
        }
      ],
      "args": [
        {
          "name": "violator",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "collateral",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "collateralChainId",
          "type": "u32"
        },
        {
          "name": "debtToCover",
          "type": "u128"
        },
        {
          "name": "options",
          "type": "bytes"
        },
        {
          "name": "gasFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "lzReceive",
      "discriminator": [
        8,
        179,
        120,
        109,
        33,
        118,
        189,
        80
      ],
      "accounts": [
        {
          "name": "store",
          "docs": [
            "OApp Store PDA.  This account represents the \"address\" of your OApp on",
            "Solana and can contain any state relevant to your application.",
            "Customize the fields in `Store` as needed."
          ],
          "writable": true
        },
        {
          "name": "clientInfo",
          "writable": true
        },
        {
          "name": "client",
          "writable": true
        },
        {
          "name": "messageInfo",
          "writable": true
        },
        {
          "name": "user"
        },
        {
          "name": "tokenMint"
        },
        {
          "name": "clientAta"
        },
        {
          "name": "userAta"
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "lzReceiveParams"
            }
          }
        }
      ]
    },
    {
      "name": "lzReceiveTypes",
      "discriminator": [
        221,
        17,
        246,
        159,
        248,
        128,
        31,
        96
      ],
      "accounts": [
        {
          "name": "store"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "lzReceiveParams"
            }
          }
        }
      ],
      "returns": {
        "vec": {
          "defined": {
            "name": "lzAccount"
          }
        }
      }
    },
    {
      "name": "quoteSend",
      "discriminator": [
        207,
        0,
        49,
        214,
        160,
        211,
        76,
        211
      ],
      "accounts": [
        {
          "name": "store"
        },
        {
          "name": "messageInfo"
        }
      ],
      "args": [
        {
          "name": "message",
          "type": "bytes"
        },
        {
          "name": "options",
          "type": "bytes"
        }
      ],
      "returns": {
        "defined": {
          "name": "messagingFee"
        }
      }
    },
    {
      "name": "receiveFee",
      "discriminator": [
        64,
        133,
        34,
        163,
        44,
        108,
        30,
        18
      ],
      "accounts": [
        {
          "name": "clientInfo",
          "writable": true
        },
        {
          "name": "client",
          "writable": true
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram"
        }
      ],
      "args": [
        {
          "name": "value",
          "type": "u64"
        }
      ]
    },
    {
      "name": "repayToken",
      "discriminator": [
        225,
        36,
        46,
        189,
        139,
        152,
        107,
        13
      ],
      "accounts": [
        {
          "name": "clientInfo"
        },
        {
          "name": "client",
          "writable": true
        },
        {
          "name": "messageInfo",
          "writable": true
        },
        {
          "name": "tokenMint",
          "writable": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "payerAta",
          "writable": true
        },
        {
          "name": "clientAta",
          "writable": true
        },
        {
          "name": "store"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram"
        }
      ],
      "args": [
        {
          "name": "repayer",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "amount",
          "type": "u128"
        },
        {
          "name": "options",
          "type": "bytes"
        },
        {
          "name": "gasFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setAsCollateral",
      "discriminator": [
        252,
        180,
        230,
        20,
        189,
        103,
        26,
        129
      ],
      "accounts": [
        {
          "name": "clientInfo"
        },
        {
          "name": "client",
          "writable": true
        },
        {
          "name": "messageInfo",
          "writable": true
        },
        {
          "name": "tokenMint",
          "writable": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "userAta",
          "writable": true
        },
        {
          "name": "clientAta",
          "writable": true
        },
        {
          "name": "store"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram"
        }
      ],
      "args": [
        {
          "name": "useAsCollateral",
          "type": "bool"
        },
        {
          "name": "options",
          "type": "bytes"
        },
        {
          "name": "gasFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setClientAdmin",
      "discriminator": [
        135,
        130,
        124,
        199,
        107,
        208,
        82,
        172
      ],
      "accounts": [
        {
          "name": "clientInfo",
          "writable": true
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "newAdmin",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "setClientPause",
      "discriminator": [
        29,
        172,
        210,
        94,
        211,
        181,
        38,
        186
      ],
      "accounts": [
        {
          "name": "clientInfo",
          "writable": true
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "pause",
          "type": "bool"
        }
      ]
    },
    {
      "name": "setDestination",
      "discriminator": [
        153,
        118,
        17,
        95,
        172,
        62,
        206,
        93
      ],
      "accounts": [
        {
          "name": "clientInfo",
          "writable": true
        },
        {
          "name": "messageInfo",
          "writable": true
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "destinationChainId",
          "type": "u32"
        },
        {
          "name": "destination",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "setPendingAccount",
      "discriminator": [
        179,
        172,
        228,
        221,
        155,
        62,
        75,
        133
      ],
      "accounts": [
        {
          "name": "clientInfo"
        },
        {
          "name": "client",
          "writable": true
        },
        {
          "name": "pendingAccount",
          "writable": true
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram"
        }
      ],
      "args": [
        {
          "name": "account",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "setPendingAccountFee",
      "discriminator": [
        246,
        73,
        201,
        65,
        134,
        42,
        87,
        238
      ],
      "accounts": [
        {
          "name": "clientInfo",
          "writable": true
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "fee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "supplyToken",
      "discriminator": [
        196,
        142,
        213,
        16,
        236,
        5,
        36,
        186
      ],
      "accounts": [
        {
          "name": "clientInfo"
        },
        {
          "name": "client",
          "writable": true
        },
        {
          "name": "messageInfo",
          "writable": true
        },
        {
          "name": "tokenMint",
          "writable": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "payerAta",
          "writable": true
        },
        {
          "name": "clientAta",
          "writable": true
        },
        {
          "name": "store"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram"
        }
      ],
      "args": [
        {
          "name": "supplier",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "amount",
          "type": "u128"
        },
        {
          "name": "options",
          "type": "bytes"
        },
        {
          "name": "gasFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawToken",
      "discriminator": [
        136,
        235,
        181,
        5,
        101,
        109,
        57,
        81
      ],
      "accounts": [
        {
          "name": "clientInfo"
        },
        {
          "name": "client",
          "writable": true
        },
        {
          "name": "messageInfo",
          "writable": true
        },
        {
          "name": "tokenMint",
          "writable": true
        },
        {
          "name": "receiver",
          "writable": true,
          "signer": true
        },
        {
          "name": "receiverAta",
          "writable": true
        },
        {
          "name": "clientAta",
          "writable": true
        },
        {
          "name": "store"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram"
        }
      ],
      "args": [
        {
          "name": "withdrawer",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "amount",
          "type": "u128"
        },
        {
          "name": "options",
          "type": "bytes"
        },
        {
          "name": "gasFee",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "clientInfo",
      "discriminator": [
        182,
        212,
        93,
        195,
        37,
        224,
        196,
        131
      ]
    },
    {
      "name": "lzReceiveTypesAccounts",
      "discriminator": [
        248,
        87,
        167,
        117,
        5,
        251,
        21,
        126
      ]
    },
    {
      "name": "messageInfo",
      "discriminator": [
        67,
        192,
        181,
        94,
        5,
        197,
        213,
        97
      ]
    },
    {
      "name": "pendingAccountInfo",
      "discriminator": [
        142,
        83,
        93,
        68,
        20,
        10,
        148,
        186
      ]
    },
    {
      "name": "store",
      "discriminator": [
        130,
        48,
        247,
        244,
        182,
        191,
        30,
        26
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidInboundNonce",
      "msg": "invalid inbound nonce"
    },
    {
      "code": 6001,
      "name": "notEnoughGasFee",
      "msg": "not enough gas fee"
    },
    {
      "code": 6002,
      "name": "invalidCaller",
      "msg": "invalid caller"
    },
    {
      "code": 6003,
      "name": "invalidMessage",
      "msg": "invalid message"
    }
  ],
  "types": [
    {
      "name": "clientInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "paused",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "pendingAccountFee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "initStoreParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "endpoint",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "lzAccount",
      "docs": [
        "same to anchor_lang::prelude::AccountMeta"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pubkey",
            "type": "pubkey"
          },
          {
            "name": "isSigner",
            "type": "bool"
          },
          {
            "name": "isWritable",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "lzReceiveParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "srcEid",
            "type": "u32"
          },
          {
            "name": "sender",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "nonce",
            "type": "u64"
          },
          {
            "name": "guid",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "message",
            "type": "bytes"
          },
          {
            "name": "extraData",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "lzReceiveTypesAccounts",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "store",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "messageInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "outboundNonce",
            "type": "u128"
          },
          {
            "name": "inboundNonceBitmap",
            "type": {
              "array": [
                "u128",
                11
              ]
            }
          },
          {
            "name": "inboundNonceBuff",
            "type": {
              "array": [
                "u128",
                11
              ]
            }
          },
          {
            "name": "inboundNonceMax",
            "type": "u128"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "defaultChainId",
            "type": "u32"
          },
          {
            "name": "destination",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "destinationChainId",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "messagingFee",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nativeFee",
            "type": "u64"
          },
          {
            "name": "lzTokenFee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "pendingAccountInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "account",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "store",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "endpointProgram",
            "type": "pubkey"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "clientSeed",
      "type": "bytes",
      "value": "[67, 76, 73, 69, 78, 84, 95, 83, 69, 69, 68]"
    },
    {
      "name": "messageInfoSeed",
      "type": "bytes",
      "value": "[77, 69, 83, 83, 65, 71, 69, 95, 73, 78, 70, 79, 95, 83, 69, 69, 68]"
    },
    {
      "name": "pendingAccountInfoSeed",
      "type": "bytes",
      "value": "[80, 69, 78, 68, 73, 78, 71, 95, 65, 67, 67, 79, 85, 78, 84, 95, 73, 78, 70, 79, 95, 83, 69, 69, 68]"
    },
    {
      "name": "storeSeed",
      "type": "bytes",
      "value": "[83, 116, 111, 114, 101]"
    },
    {
      "name": "supplyFlag",
      "type": "u8",
      "value": "0"
    }
  ]
};
