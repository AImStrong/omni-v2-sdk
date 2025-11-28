"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.BASE_URL = void 0;
const axios_1 = __importDefault(require("axios"));
exports.BASE_URL = "https://scan.layerzero-api.com/v1";
exports.api = axios_1.default.create({
    baseURL: exports.BASE_URL,
    timeout: 8000
});
