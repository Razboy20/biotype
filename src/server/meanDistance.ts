import type { Sample, User } from "@prisma/client/edge";
import degreeOfDisorder from "./degreeOfDisorder";

function meanDistance(s: Sample, u: User & { samples: Sample[] }): number {
  let sum = 0;
  if (u.samples.length == 0) {
    return 1; // largest possible distance
  }
  for (const sample of u.samples) {
    sum += degreeOfDisorder(s, sample);
  }
  return sum / u.samples.length;
}

export default meanDistance;
