import { prisma } from "./db";
import type { GraphSample } from "./degreeOfDisorder";
import { makeSample } from "./makeSample";
import meanDistance from "./meanDistance";
import { activeSamples } from "./updateActiveSamples";

export async function rank(uuid: string): Promise<Map<string, number>> {
  const active = activeSamples.get(uuid);
  if (active) return rankBySample(makeSample(active));
  return new Map();
}

let lastCall = 0;
let usersCache: { name: string; variance: number; samples: GraphSample[] }[] = [];

async function rankBySample(sample: GraphSample): Promise<Map<string, number>> {
  const currTime = Date.now();
  if (currTime - lastCall > 10000) {
    usersCache = await prisma.user.findMany({
      include: {
        samples: {
          include: {
            graphs: true,
          },
        },
      },
    });

    lastCall = currTime;
  }

  const userMap: Map<string, number> = new Map();
  for (const user of usersCache) {
    userMap.set(user.name, Math.round((1 - meanDistance(sample, user)) * 1000) / 10);
  }
  return userMap;
}
