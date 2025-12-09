export type LZMessageStatus =
  | "NOT_FOUND"
  | "UNKNOWN"
  | "DELIVERED"
  | "INFLIGHT"
  | "PAYLOAD_STORED"
  | "FAILED"
  | "BLOCKED"
  | "CONFIRMING";


export interface LZRawMessage {
  status?: {
    name?: string;
    message?: string;
  };

  source?: {
    tx?: {
      txHash?: string;
      [key: string]: any;
    };
  };

  destination?: {
    tx?: {
      txHash?: string;
      [key: string]: any;
    };
  };

  pathway?: {
    srcEid?: number;
    dstEid?: number;
  };

  [key: string]: any;
}

export interface LZStatusResponse {
  status: LZMessageStatus;
  srcTxHash?: string;
  dstTxHash?: string;
  srcChainId?: number;
  dstChainId?: number;
  raw?: LZRawMessage;
}

export type SimpleState = "none" | "pending" | "executed" | "failed";

export interface SimpleStatusResult {
  state: SimpleState;
  nextHash: string | null;
  detail: LZStatusResponse;
}
