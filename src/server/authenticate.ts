import { prisma } from "./db";
import type { GraphSample } from "./degreeOfDisorder";
import { makeSample } from "./makeSample";
import meanDistance from "./meanDistance";
import { activeSamples } from "./updateActiveSamples";

export async function authenticate(uuid: string): Promise<string | undefined> {
  const active = activeSamples.get(uuid);

  if (active) {
    if (active.length < 20) return;
    return authenticateBySample(makeSample(active));
  }
  return;
}

let lastCall = 0;
let usersCache: { name: string; variance: number; samples: GraphSample[] }[] = [];

async function authenticateBySample(sample: GraphSample): Promise<string | undefined> {
  const k = 0.5;

  const currTime = Date.now();
  if (usersCache.length == 0 || currTime - lastCall > 10000) {
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

  let firstPlace = Number.MAX_VALUE;
  let firstPlaceUser = -1;
  let secondPlace = Number.MAX_VALUE;
  let secondPlaceUser = -1;

  for (let i = 0; i < usersCache.length; i++) {
    const score = meanDistance(sample, usersCache[i]);
    if (score < firstPlace) {
      secondPlace = firstPlace;
      secondPlaceUser = firstPlaceUser;
      firstPlace = score;
      firstPlaceUser = i;
    } else if (score < secondPlace) {
      secondPlace = score;
      secondPlaceUser = i;
    }
  }

  if (firstPlaceUser == -1) {
    return;
  }

  if (secondPlaceUser == -1) {
    secondPlace = 1;
  }

  // console.log("places: ", firstPlace, secondPlace);
  if (
    firstPlace <
    k * Math.abs(secondPlace - usersCache[firstPlaceUser].variance) + usersCache[firstPlaceUser].variance
  ) {
    return usersCache[firstPlaceUser].name;
  }

  return;
}
