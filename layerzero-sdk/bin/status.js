#!/usr/bin/env node

/**
 * LayerZero Status CLI
 * Usage:
 *   node .\bin\status.js <txhash>
 */

const { getSimpleStatus } = require("../dist/status");

async function main() {
  const txHash = process.argv[2];

  if (!txHash) {
    console.log("❌ Missing transaction hash");
    console.log("Usage: node .\bin\status.js <txhash>");
    process.exit(1);
  }

  console.log(`🔍 Checking LayerZero status for TX:\n${txHash}\n`);

  try {
    const res = await getSimpleStatus(txHash);

    console.log("=== LayerZero TX Status ===");
    console.log(`State:     ${res.state}`);
    console.log(`Next Hash: ${res.nextHash ?? "N/A"}`);

    if (res.detail) {
      console.log("\n--- Detail ---");
      console.log(`Source Chain: ${res.detail.srcChainId}`);
      console.log(`Dest Chain:   ${res.detail.dstChainId}`);
      console.log(`Raw Status:   ${res.detail.status}`);
    }

    console.log("\n✔ Done.");
  } catch (err) {
    console.error("❌ Error:", err.message || err);
    process.exit(1);
  }
}

main();
