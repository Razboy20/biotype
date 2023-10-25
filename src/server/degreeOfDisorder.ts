import type { ParsedSample } from "./db";

function degreeOfDisorder(arr1: ParsedSample, arr2: ParsedSample): number {
  const sample1 = new Set(arr1.graphs);
  const sample2 = new Set(arr2.graphs);

  const combination = new Set<string>();
  const intersection = new Set<string>();

  // for (let i = 0; i < sample1.length; i++) {
  //   if (i < sample2.length) {
  //     if (combination.has(sample2[i])) intersection.add(sample2[i]);
  //     else combination.add(sample2[i]);
  //   }
  //   if (combination.has(sample1[i])) intersection.add(sample1[i]);
  //   else combination.add(sample1[i]);
  // }

  for (const graph of sample1) {
    combination.add(graph);
  }

  for (const graph of sample2) {
    if (combination.has(graph)) intersection.add(graph);
    else combination.add(graph);
  }

  const sample1Arr = [];
  const sample2Arr = [];

  for (const graph of sample1) {
    if (intersection.has(graph)) sample1Arr.push(graph);
  }

  for (const graph of sample2) {
    if (intersection.has(graph)) sample2Arr.push(graph);
  }

  console.log("int size: ", intersection.size, "comb size:", combination.size);
  if (intersection.size <= 1) return 1;

  const maxDisorder = (intersection.size ** 2 - (intersection.size % 2)) / 2;
  const distances = [];

  // compute distances between elements in sample1 and sample2 (if they exist in intersection)

  for (let i = 0; i < Math.min(sample1.size, sample2.size); i++) {
    if (intersection.has(sample2Arr[i])) {
      distances.push(Math.abs(i - sample1Arr.indexOf(sample2Arr[i])));
    }
  }

  const disorder = distances.reduce((acc, curr) => acc + curr, 0);
  console.log(`${disorder} / ${maxDisorder}`);
  return disorder / maxDisorder;

  // // console.log(intersection.size);
  // const indicies = new Map<string, number[]>();

  // let index1 = 0;
  // let index2 = 0;

  // for (let i = 0; i < sample1.length; i++) {
  //   if (i < sample2.length) {
  //     const arr = indicies.get(sample2[i]);
  //     if (arr != undefined) {
  //       if (arr[1] == -1) {
  //         arr[1] = index2;
  //         index2++;
  //       }
  //     } else if (intersection.has(sample2[i])) {
  //       indicies.set(sample2[i], [-1, index2]);
  //       index2++;
  //     }
  //   }
  //   const arr = indicies.get(sample1[i]);
  //   if (arr != undefined) {
  //     if (arr[0] == -1) {
  //       arr[0] = index1;
  //       index1++;
  //     }
  //   } else if (intersection.has(sample1[i])) {
  //     indicies.set(sample1[i], [index1, -1]);
  //     index1++;
  //   }
  // }

  // let disorder = 0;
  // for (const [key, value] of indicies.entries()) {
  //   if (value[0] == -1 || value[1] == -1) {
  //     //disorder += 1;
  //     continue;
  //   } else {
  //     disorder += Math.abs(value[0] - value[1]);
  //   }
  // }

  // if (intersection.size == 1) {
  //   // don't divide by 0
  //   return 1;
  // }
  // return disorder / ((intersection.size ** 2 - (intersection.size % 2)) / 2);
}

// let S1: Sample = { graphs: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"], userName: null, id: "1" };
// let S2: Sample = { graphs: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"], userName: null, id: "1" };

// console.log(degreeOfDisorder(S1, S2));

// S1 = { graphs: ["h", "w", "c", "q", "m"], userName: null, id: "1" };
// S2 = { graphs: ["c", "h", "m", "q", "w"], userName: null, id: "1" };

// console.log(degreeOfDisorder(S1, S2));

// S1 = { graphs: ["ica", "mer", "ame", "eri", "ric"], userName: null, id: "1" };
// S2 = { graphs: ["mer", "ica", "ame", "ric", "eri"], userName: null, id: "1" };

// console.log(degreeOfDisorder(S1, S2));

// S1 = { graphs: ["c", "b", "a"], userName: null, id: "1" };
// S2 = { graphs: ["a", "b", "c"], userName: null, id: "1" };

// console.log(degreeOfDisorder(S1, S2));

// S1 = { graphs: [], userName: null, id: "1" };
// S2 = { graphs: ["mer", "ica", "ame", "ric", "eri"], userName: null, id: "1" };

// console.log(degreeOfDisorder(S1, S2));
export default degreeOfDisorder;
