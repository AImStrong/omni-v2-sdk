const { getSimpleStatus } = require("../dist");

async function main() {
  const tx = "0x..."; 

  console.log("Checking:", tx);
  const res = await getSimpleStatus(tx);

  console.log("\n=== RESULT ===");
  console.log(res);
}

main();
