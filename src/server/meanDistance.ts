import type { User } from "@prisma/client/edge";
import type { GraphSample } from "./degreeOfDisorder";
import degreeOfDisorder from "./degreeOfDisorder";

function meanDistance(s: GraphSample, u: User & { samples: GraphSample[] }): number {
  let sum = 0;
  if (u.samples.length == 0) {
    return 1; // largest possible distance
  }
  // console.log(u.name);
  const indicies: number[] = [];
  for (let i = 0; i < u.samples.length; i++) {
    indicies.push(i);
  }
  while (indicies.length > 10) {
    indicies.splice(Math.floor(Math.random() * indicies.length), 1);
  }

  for (const index of indicies) {
    sum += degreeOfDisorder(s, u.samples[index]);
  }
  // console.log("mean distance", sum / u.samples.length);
  const out = (sum * (4 - indicies.length < 1 ? 1 : 4 - indicies.length)) / indicies.length;
  return out < 1 ? out : 1;
}

export default meanDistance;
