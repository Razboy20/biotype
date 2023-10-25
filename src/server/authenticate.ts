import type { ParsedSample } from "./db";
import { userCache } from "./db";
import { makeSample } from "./makeSample";
import meanDistance from "./meanDistance";
import { activeSamples, updateActiveSamples } from "./updateActiveSamples";

export function authenticate(
  uuid: string,
  samples: [graph: string, startTime: number, endTime: number][],
): string | undefined {
  // bandaid fix
  updateActiveSamples(samples, uuid);

  const active = activeSamples.get(uuid);

  if (active) {
    if (active.length < 20) return;
    return authenticateBySample(makeSample(active));
  }
  return;
}

function authenticateBySample(sample: ParsedSample): string | undefined {
  const k = 0.75;
  let firstPlace = Number.MAX_VALUE;
  let firstPlaceUser;
  let secondPlace = Number.MAX_VALUE;
  let secondPlaceUser;

  for (const user of userCache.values()) {
    const score = meanDistance(sample, user);
    if (score < firstPlace) {
      secondPlace = firstPlace;
      secondPlaceUser = firstPlaceUser;
      firstPlace = score;
      firstPlaceUser = user;
    } else if (score < secondPlace) {
      secondPlace = score;
      secondPlaceUser = user;
    }
  }

  if (!firstPlaceUser) {
    return;
  }

  if (!secondPlaceUser) {
    secondPlace = 1;
  }

  // console.log("places: ", firstPlace, secondPlace);
  if (firstPlace < k * Math.abs(secondPlace - firstPlaceUser.variance) + firstPlaceUser.variance) {
    return firstPlaceUser.name;
  }

  return;
}
