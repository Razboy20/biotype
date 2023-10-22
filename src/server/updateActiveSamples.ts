import { rank } from "./rank";

export const activeSamples = new Map<string, [number, string][]>();
const holdOuts = new Map<string, [string, number, number][]>();

const graphLength = 3;

export async function updateActiveSamples(update: [string, number, number][], uuid: string) {
  let activeSample = activeSamples.get(uuid);
  if (!activeSample) {
    activeSample = [];
  }
  let holdOut = holdOuts.get(uuid);
  if (!holdOut) {
    holdOut = [];
  }

  holdOut = holdOut.concat(update);

  // console.log(holdOut);
  // execute backspaces
  // for (let i = 1; i < update.length; i++) {
  //   const [id, start, end] = holdOut[i];
  //   if (id == "Backspace") {
  //     holdOut.splice(i - 1, 2);
  //     i -= 2;
  //     continue;
  //   }
  // }

  // while (holdOut[0][0] == "Backspace") {
  //   holdOut.shift();
  // }

  for (let i = graphLength - 1; i < holdOut.length; i++) {
    const [id, start, end] = holdOut[i - graphLength + 1];
    const [id2, start2, end2] = holdOut[i];

    let graph = "";

    for (let j = i - graphLength + 1; j <= i; j++) {
      graph += holdOut[j][0];
    }

    const duration = end2 - start;
    const insertionIndex = activeSample.findIndex((element) => element[0] > duration);
    if (insertionIndex == -1) activeSample.push([duration, graph]);
    else activeSample.splice(insertionIndex, 0, [duration, graph]);
  }

  activeSamples.set(uuid, activeSample);
  // console.log("active: ", activeSample);
  //set new holdouts
  holdOuts.set(uuid, update.slice(-graphLength + 1));

  return [...(await rank(uuid)).entries()];
}

// updateActiveSamples(
//   [
//     ["a", 0, 1],
//     ["b", 1, 3],
//     ["c", 3, 6],
//     ["d", 6, 10],
//     ["e", 10, 15],
//   ],
//   "1",
// );

// updateActiveSamples(
//   [
//     ["f", 15, 21],
//     ["g", 21, 28],
//   ],
//   "1",
// );

// console.log(activeSamples.get("1"));
