import { AxiosInstance } from "axios";
import { LZMessageStatus, LZRawMessage, LZStatusResponse, SimpleStatusResult } from "./types";
/**
 * Fetch raw records from LayerZero Scan
 */
export declare function fetchRawMessagesByTx(txHash: string, client?: AxiosInstance): Promise<LZRawMessage[]>;
/**
 * Build LayerZero Full Status
 */
export declare function getLayerZeroStatus(txHash: string, client?: AxiosInstance): Promise<LZStatusResponse>;
/**
 * Only status
 */
export declare function getStatusOnly(txHash: string, client?: AxiosInstance): Promise<LZMessageStatus>;
/**
 * Main function: (state, nextHash)
 */
export declare function getSimpleStatus(txHash: string, client?: AxiosInstance): Promise<SimpleStatusResult>;
/**
 * Wait until delivered/failed
 */
export declare function waitUntilFinalized(txHash: string, intervalMs?: number, client?: AxiosInstance): Promise<LZMessageStatus>;
/**
 * Wait until executed/failed/none
 */
export declare function waitUntilExecutedSimple(txHash: string, intervalMs?: number, client?: AxiosInstance): Promise<SimpleStatusResult>;
