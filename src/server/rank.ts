import { prisma } from "./db";
import type { GraphSample } from "./degreeOfDisorder";
import { makeSample } from "./makeSample";
import meanDistance from "./meanDistance";
import { activeSamples } from "./updateActiveSamples";

export async function rank(uuid: string): Promise<Map<number, string>> {
  const active = activeSamples.get(uuid);
  if (active) return rankBySample(makeSample(active));
  return new Map<number, string>();
}

let lastCall = 0;
let usersCache: { name: string; variance: number; samples: GraphSample[] }[] = [];

async function rankBySample(sample: GraphSample): Promise<Map<number, string>> {
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

  const userMap: Map<number, string> = new Map<number, string>();
  for (const user of usersCache) {
    userMap.set(Math.round((1 - meanDistance(sample, user)) * 100), user.name);
  }
  return userMap;
}
