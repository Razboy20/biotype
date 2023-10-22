import type { User } from "@prisma/client/edge";
import type { GraphSample } from "./degreeOfDisorder";
import degreeOfDisorder from "./degreeOfDisorder";

function meanDistance(s: GraphSample, u: User & { samples: GraphSample[] }): number {
  let sum = 0;
  if (u.samples.length == 0) {
    return 1; // largest possible distance
  }
  for (const sample of u.samples) {
    sum += degreeOfDisorder(s, sample);
  }
  // console.log("mean distance", sum / u.samples.length);
  return sum / u.samples.length;
}

export default meanDistance;
