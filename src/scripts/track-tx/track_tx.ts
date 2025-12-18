import axios from "axios";

interface FailedInterface {
  hash?: string;
  error?: string;
  reason?: string;
}

interface TxInterface {
  hash?: string;
  status: "SUCCEEDED" | "WAITING" | "SIMULATION_REVERTED";
  failed?: FailedInterface[]
}

export async function getNextTx(
  mode: "testnet" | "mainnet",
  srcTx: string,
): Promise<TxInterface | null> {
  const api = axios.create({
    baseURL: `https://scan${mode == "testnet" ? "-testnet" : ""}.layerzero-api.com/v1/messages/tx/`,
    timeout: 8000
  });

  srcTx = srcTx.toLowerCase();

  try {
    const res = await api.get(srcTx);
    if (!res || !res.data || !res.data.data || !res.data.data[0]) return null;

    const data = res.data.data[0];

    if (data.source.tx.txHash.toLowerCase() != srcTx) return null;

    if (data.destination.status == "WAITING") return {
      status: "WAITING"
    }
    else if (data.destination.status == "SUCCEEDED") return {
      status: "SUCCEEDED",
      hash: data.destination.tx.txHash
    }
    else if (data.destination.status == "SIMULATION_REVERTED") {
      const failed: FailedInterface[] = [];
      for (const o of data.destination.failedTx) {
        failed.push({
          hash: o.txHash,
          error: o.txError,
          reason: o.revertReason
        })
      }
      return {
        status: "SIMULATION_REVERTED",
        failed: failed
      }
    }
    else return null;

  } catch {
    return null;
  }
}