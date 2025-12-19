import assets from '../../config/assets/assets.asset';
import { Chain } from '../../config/chain';

export function getAddressesList(
  chains: Chain[],
): Record<string, string[]> {
  let assetsList: Record<string, string[]> = {};

  for (const ccc of chains) {
    const chainAssets: string[] = [];
    for (const [key, value] of Object.entries(assets[ccc])) {
      chainAssets.push(value.address);
    }

    assetsList[ccc] = chainAssets;
  }

  return assetsList;
}