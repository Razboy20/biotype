import type { Sample } from "@prisma/client/edge";
import { prisma } from "./db";
import { makeSample } from "./makeSample";
import meanDistance from "./meanDistance";
import { activeSamples } from "./updateActiveSamples";

export async function authenticate(uuid: string): Promise<string> {
  const active = activeSamples.get(uuid);
  if (active) return authenticateBySample(makeSample(active));
  return "";
}

async function authenticateBySample(sample: Sample): Promise<string> {
  const k = 0.5;
  const users = await prisma.user.findMany({
    include: {
      samples: true,
    },
  });

  let firstPlace = Number.MAX_VALUE;
  let firstPlaceUser = -1;
  let secondPlace = Number.MAX_VALUE;
  let secondPlaceUser = -1;

  for (let i = 0; i < users.length; i++) {
    const score = meanDistance(sample, users[i]);
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
    return "";
  }

  if (secondPlaceUser == -1) {
    secondPlace = 1;
  }

  if (firstPlace < k * Math.abs(secondPlace - users[firstPlaceUser].variance) + firstPlace) {
    return users[firstPlaceUser].name;
  }

  return "";
}
