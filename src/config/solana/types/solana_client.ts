/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solana_client.json`.
 */
export type SolanaClient = {
  "address": "7vf6XHz6uepANiLrRNrzHdh9Cpf2ATMG4NHZryzCsDwJ",
  "metadata": {
    "name": "solanaClient",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
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
          "name": "client"
        },
        {
          "name": "clientVault",
          "writable": true
        },
        {
          "name": "tokenMint",
          "writable": true
        },
        {
          "name": "borrowerAta",
          "writable": true
        },
        {
          "name": "clientVaultAta",
          "writable": true
        },
        {
          "name": "borrower",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "message",
          "writable": true
        },
        {
          "name": "lastMessage",
          "writable": true
        },
        {
          "name": "store"
        },
        {
          "name": "systemProgram"
        }
      ],
      "args": [
        {
          "name": "receiver",
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
          "name": "gasLimit",
          "type": "u128"
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
      "name": "initClientVault",
      "discriminator": [
        169,
        227,
        219,
        101,
        143,
        130,
        82,
        14
      ],
      "accounts": [
        {
          "name": "client"
        },
        {
          "name": "clientVault",
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
          "name": "client"
        },
        {
          "name": "message",
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
          "name": "client"
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
      "name": "linkAccount",
      "discriminator": [
        68,
        68,
        218,
        40,
        15,
        50,
        106,
        97
      ],
      "accounts": [
        {
          "name": "link",
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
          "name": "client"
        },
        {
          "name": "clientVault",
          "writable": true
        },
        {
          "name": "payerAta",
          "writable": true
        },
        {
          "name": "clientVaultAta",
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
          "name": "message",
          "writable": true
        },
        {
          "name": "lastMessage",
          "writable": true
        },
        {
          "name": "store"
        },
        {
          "name": "systemProgram"
        },
        {
          "name": "tokenProgram"
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
          "name": "gasLimit",
          "type": "u128"
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
          "name": "message",
          "writable": true
        },
        {
          "name": "clientVault",
          "writable": true
        },
        {
          "name": "user"
        },
        {
          "name": "tokenMint"
        },
        {
          "name": "clientVaultAta"
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
        }
      ],
      "args": [
        {
          "name": "message",
          "type": "bytes"
        },
        {
          "name": "gasLimit",
          "type": "u128"
        }
      ],
      "returns": {
        "defined": {
          "name": "messagingFee"
        }
      }
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
          "name": "client"
        },
        {
          "name": "clientVault",
          "writable": true
        },
        {
          "name": "tokenMint",
          "writable": true
        },
        {
          "name": "payerAta",
          "writable": true
        },
        {
          "name": "clientVaultAta",
          "writable": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "message",
          "writable": true
        },
        {
          "name": "lastMessage",
          "writable": true
        },
        {
          "name": "store"
        },
        {
          "name": "systemProgram"
        }
      ],
      "args": [
        {
          "name": "receiver",
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
          "name": "gasLimit",
          "type": "u128"
        },
        {
          "name": "gasFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "resetInboundNonce",
      "discriminator": [
        173,
        47,
        38,
        54,
        202,
        228,
        201,
        172
      ],
      "accounts": [
        {
          "name": "client"
        },
        {
          "name": "message",
          "writable": true
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "resetOutboundNonce",
      "discriminator": [
        24,
        131,
        254,
        152,
        197,
        18,
        121,
        193
      ],
      "accounts": [
        {
          "name": "client"
        },
        {
          "name": "message",
          "writable": true
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "send",
      "discriminator": [
        102,
        251,
        20,
        187,
        65,
        75,
        12,
        69
      ],
      "accounts": [
        {
          "name": "store",
          "docs": [
            "OApp Store PDA that signs the send instruction"
          ]
        },
        {
          "name": "message"
        },
        {
          "name": "lastMessage"
        }
      ],
      "args": [
        {
          "name": "sender",
          "type": "pubkey"
        },
        {
          "name": "gasLimit",
          "type": "u128"
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
          "name": "client"
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
          "name": "message",
          "writable": true
        },
        {
          "name": "lastMessage",
          "writable": true
        },
        {
          "name": "store"
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
          "name": "gasLimit",
          "type": "u128"
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
          "name": "client",
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
          "name": "client",
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
          "name": "client"
        },
        {
          "name": "clientVault",
          "writable": true
        },
        {
          "name": "tokenMint",
          "writable": true
        },
        {
          "name": "payerAta",
          "writable": true
        },
        {
          "name": "clientVaultAta",
          "writable": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "message",
          "writable": true
        },
        {
          "name": "lastMessage",
          "writable": true
        },
        {
          "name": "store"
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
          "name": "gasLimit",
          "type": "u128"
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
          "name": "client"
        },
        {
          "name": "clientVault",
          "writable": true
        },
        {
          "name": "tokenMint",
          "writable": true
        },
        {
          "name": "withdrawerAta",
          "writable": true
        },
        {
          "name": "clientVaultAta",
          "writable": true
        },
        {
          "name": "withdrawer",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "message",
          "writable": true
        },
        {
          "name": "lastMessage",
          "writable": true
        },
        {
          "name": "store"
        },
        {
          "name": "systemProgram"
        }
      ],
      "args": [
        {
          "name": "receiver",
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
          "name": "gasLimit",
          "type": "u128"
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
      "name": "client",
      "discriminator": [
        221,
        237,
        145,
        143,
        170,
        194,
        133,
        115
      ]
    },
    {
      "name": "clientVault",
      "discriminator": [
        26,
        124,
        111,
        142,
        216,
        66,
        17,
        42
      ]
    },
    {
      "name": "lastMessage",
      "discriminator": [
        0,
        238,
        239,
        171,
        78,
        184,
        70,
        218
      ]
    },
    {
      "name": "link",
      "discriminator": [
        90,
        57,
        179,
        207,
        13,
        91,
        161,
        190
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
      "name": "message",
      "discriminator": [
        110,
        151,
        23,
        110,
        198,
        6,
        125,
        181
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
      "name": "messageReceived",
      "msg": "message received"
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
      "name": "client",
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
          }
        ]
      }
    },
    {
      "name": "clientVault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
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
      "name": "lastMessage",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "message",
            "type": "bytes"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "link",
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
      "name": "message",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "outboundNonce",
            "type": "u128"
          },
          {
            "name": "inboundNonce",
            "type": "u128"
          },
          {
            "name": "bump",
            "type": "u8"
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
      "name": "clientVaultSeed",
      "type": "bytes",
      "value": "[67, 76, 73, 69, 78, 84, 95, 86, 65, 85, 76, 84, 95, 83, 69, 69, 68]"
    },
    {
      "name": "linkSeed",
      "type": "bytes",
      "value": "[76, 73, 78, 75, 95, 83, 69, 69, 68]"
    },
    {
      "name": "lzDstEid",
      "type": "u32",
      "value": "40161"
    },
    {
      "name": "messageSeed",
      "type": "bytes",
      "value": "[77, 69, 83, 83, 65, 71, 69, 95, 83, 69, 69, 68]"
    },
    {
      "name": "solanaChainId",
      "type": "u32",
      "value": "103"
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
