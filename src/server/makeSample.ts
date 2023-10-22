import type { Graph, Sample } from "@prisma/client/edge";

export function makeSample(data: [number, string][]) {
  const graphs: Graph[] = [];
  for (let i = 0; i < data.length; i++) {
    const [id, graph] = data[i];
    graphs.push({
      value: graph,
    } as Graph);
  }
  // console.log(graphs);
  return {
    graphs: graphs,
  } as Sample & {
    graphs: Graph[];
  };
}
