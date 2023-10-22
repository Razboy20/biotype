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

async function rankBySample(sample: GraphSample): Promise<Map<number, string>> {
  const users = await prisma.user.findMany({
    include: {
      samples: {
        include: {
          graphs: true,
        },
      },
    },
  });
  const userMap: Map<number, string> = new Map<number, string>();
  for (const user of users) {
    userMap.set(Math.round((1 - meanDistance(sample, user)) * 100), user.name);
  }
  return userMap;
}
