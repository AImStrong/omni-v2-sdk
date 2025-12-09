import { AxiosInstance } from "axios";
import { api } from "./client";
import {
  LZMessageStatus,
  LZRawMessage,
  LZStatusResponse,
  SimpleState,
  SimpleStatusResult
} from "./types";

/**
 * Fetch raw records from LayerZero Scan
 */
export async function fetchRawMessagesByTx(
  txHash: string,
  client: AxiosInstance = api
): Promise<LZRawMessage[]> {
  const resp = await client.get(`/messages/tx/${txHash}`);
  const arr = resp?.data?.data;
  return Array.isArray(arr) ? arr : [];
}

/**
 * parse message.status.name → normalized status
 */
function parseStatus(msg: LZRawMessage): LZMessageStatus {
  const raw = msg?.status?.name;
  if (!raw) return "UNKNOWN";

  const upper = raw.replace(/\s+/g, "_").toUpperCase();

  switch (upper) {
    case "DELIVERED":
      return "DELIVERED";

    case "INFLIGHT":
      return "INFLIGHT";

    case "PAYLOAD_STORED":
      return "PAYLOAD_STORED";

    case "FAILED":
      return "FAILED";

    case "BLOCKED":
      return "BLOCKED";

    case "CONFIRMING":
      return "CONFIRMING";

    default:
      return "UNKNOWN";
  }
}


/**
 * Build LayerZero Full Status
 */
export async function getLayerZeroStatus(
  txHash: string,
  client: AxiosInstance = api
): Promise<LZStatusResponse> {
  try {
    const msgs = await fetchRawMessagesByTx(txHash, client);

    if (!msgs.length) {
      return { status: "NOT_FOUND" };
    }

    const msg = msgs[0];

    const status = parseStatus(msg);
    const srcTx = msg.source?.tx?.txHash;
    const dstTx = msg.destination?.tx?.txHash;

    return {
      status,
      srcTxHash: srcTx,
      dstTxHash: dstTx,
      srcChainId: msg.pathway?.srcEid,
      dstChainId: msg.pathway?.dstEid,
      raw: msg
    };
  } catch {
    return { status: "NOT_FOUND" };
  }
}

/**
 * Only status
 */
export async function getStatusOnly(
  txHash: string,
  client: AxiosInstance = api
): Promise<LZMessageStatus> {
  return (await getLayerZeroStatus(txHash, client)).status;
}

/**
 * Map to simplified state form
 */
function toSimpleState(status: LZMessageStatus): SimpleState {
  if (status === "DELIVERED") return "executed";
  if (status === "FAILED") return "failed";
  if (status === "NOT_FOUND") return "none";

  // PAYLOAD_STORED / INFLIGHT / CONFIRMING / BLOCKED / UNKNOWN
  return "pending";
}


/**
 * Main function: (state, nextHash)
 */
export async function getSimpleStatus(
  txHash: string,
  client: AxiosInstance = api
): Promise<SimpleStatusResult> {
  const detail = await getLayerZeroStatus(txHash, client);

  const nextHash = detail.dstTxHash ?? null;
  const state = toSimpleState(detail.status);

  return {
    state,
    nextHash,
    detail
  };
}

/**
 * Wait until delivered/failed
 */
export async function waitUntilFinalized(
  txHash: string,
  intervalMs = 4000,
  client: AxiosInstance = api
): Promise<LZMessageStatus> {
  while (true) {
    const st = await getStatusOnly(txHash, client);
    console.log(`[LZ] ${txHash} → ${st}`);

    if (st === "DELIVERED" || st === "FAILED") {
      return st;
    }

    await new Promise((res) => setTimeout(res, intervalMs));
  }
}

/**
 * Wait until executed/failed/none
 */
export async function waitUntilExecutedSimple(
  txHash: string,
  intervalMs = 4000,
  client: AxiosInstance = api
): Promise<SimpleStatusResult> {
  while (true) {
    const s = await getSimpleStatus(txHash, client);
    console.log(`[LZ-SIMPLE] ${txHash} → state=${s.state}, nextHash=${s.nextHash}`);

    if (s.state === "executed" || s.state === "failed" || s.state === "none") {
      return s;
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}
