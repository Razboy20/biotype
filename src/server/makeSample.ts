import type { ParsedSample } from "./db";

export function makeSample(data: [duration: number, graph: string][]): ParsedSample {
  const graphs: string[] = [];

  for (const [_, graph] of data) {
    graphs.push(graph);
  }
  return {
    graphs: graphs,
  };
}
