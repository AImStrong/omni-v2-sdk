export function decodeConfiguration(data: bigint) {
  return {
    ltv: Number(data & 0xFFFFn),
    liquidationThreshold: Number((data >> 16n) & 0xFFFFn),
    liquidationBonus: Number((data >> 32n) & 0xFFFFn),
    decimals: Number((data >> 48n) & 0xFFn),
    active: Boolean((data >> 56n) & 0x1n),
    frozen: Boolean((data >> 57n) & 0x1n),
    borrowingEnabled: Boolean((data >> 58n) & 0x1n),
    paused: Boolean((data >> 60n) & 0x1n),
    borrowableInIsolation: Boolean((data >> 61n) & 0x1n),
    siloedBorrowing: Boolean((data >> 62n) & 0x1n),
    flashloanEnabled: Boolean((data >> 63n) & 0x1n),
    reserveFactor: Number((data >> 64n) & 0xFFFFn),
    borrowCap: Number((data >> 80n) & 0xFFFFFFFFFn),
    supplyCap: Number((data >> 116n) & 0xFFFFFFFFFn),
    liquidationProtocolFee: Number((data >> 152n) & 0xFFFFn),
    debtCeiling: Number((data >> 212n) & 0xFFFFFFFFFFn),
    virtualAccActive: Boolean((data >> 252n) & 0x1n),
  };
}