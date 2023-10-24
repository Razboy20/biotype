import { getUser, updateUser } from "./db";
import degreeOfDisorder from "./degreeOfDisorder";
import { makeSample } from "./makeSample";
import { activeSamples } from "./updateActiveSamples";

export async function addSample(uuid: string, userId: string): Promise<boolean> {
  if (userId == "") return false;
  // console.log("userId:", userId);

  const prospectiveSample = activeSamples.get(uuid);

  if (!prospectiveSample) return false;
  const sample = makeSample(prospectiveSample);
  let user = await getUser(userId);

  if (!user) {
    // create user and add sample to user.samples
    user = {
      name: userId,
      variance: 0,
      samples: [],
    };
  }

  const currentVariance = user.variance;
  const sampleCount = user.samples.length;
  const clique = (sampleCount * (sampleCount - 1)) / 2;
  let sum = 0;
  for (const userSample of user.samples) {
    sum += degreeOfDisorder(sample, userSample);
  }
  let newVariance = 0; // value if new sample will be only sample
  if (sampleCount != 0) {
    newVariance = (currentVariance * clique + sum) / (clique + sampleCount);
  }

  await updateUser(userId, newVariance, sample);
  return true;
}
