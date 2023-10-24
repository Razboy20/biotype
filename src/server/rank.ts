import type { ParsedSample } from "./db";
import { userCache } from "./db";
import { makeSample } from "./makeSample";
import meanDistance from "./meanDistance";
import { activeSamples } from "./updateActiveSamples";

export function rank(uuid: string): Map<string, number> {
  const active = activeSamples.get(uuid);
  if (active) return rankBySample(makeSample(active));
  return new Map();
}

function rankBySample(sample: ParsedSample): Map<string, number> {
  const userMap: Map<string, number> = new Map();
  for (const user of userCache.values()) {
    userMap.set(user.name, Math.round((1 - meanDistance(sample, user)) * 1000) / 10);
  }
  return userMap;
}
