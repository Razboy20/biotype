import type { Sample } from "@prisma/client/edge";

export function makeSample(data: [number, string][]): Sample {
  const graphs: string[] = [];
  for (let i = 0; i < data.length; i++) {
    const [id, graph] = data[i];
    graphs.push(graph);
  }
  return {
    graphs: graphs,
  } as Sample;
}
