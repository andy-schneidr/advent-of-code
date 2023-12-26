const part1 = (input: string[]): string | number => {
  const nodes = new Map<string, Set<string>>();

  for (const line of input) {
    const [from, to] = line.split(": ");

    if (!nodes.has(from)) {
      nodes.set(from, new Set());
    }
    const allTo = to.split(" ");
    for (const t of allTo) {
      if (!nodes.has(t)) {
        nodes.set(t, new Set());
      }
      nodes.get(from)?.add(t);
      nodes.get(t)?.add(from);
    }
  }

  // Find all possible edges
  const allEdges = new Set<string>();
  for (const [node, to] of nodes) {
    for (const t of to) {
      allEdges.add([node, t].sort().join("-"));
    }
  }

  const allEdgesArray = Array.from(allEdges);

  const costsDueToRemoval: { edge: string; cost: number }[] = [];

  // I think Marc-Olivier Arsenault came up with this idea!
  for (let i1 = 0; i1 < allEdgesArray.length; i1++) {
    const edgeParts = allEdgesArray[i1].split("-");
    removeConnections(nodes, allEdgesArray[i1]);
    const cost = BFS(nodes, edgeParts[0], edgeParts[1]);
    costsDueToRemoval.push({ edge: allEdgesArray[i1], cost });
    addConnections(nodes, allEdgesArray[i1]);
  }

  costsDueToRemoval.sort((a, b) => b.cost - a.cost);

  removeConnections(
    nodes,
    costsDueToRemoval[0].edge,
    costsDueToRemoval[1].edge,
    costsDueToRemoval[2].edge
  );

  // Return the product of groupsizes
  const groupSizes = testTraversal(nodes);
  if (groupSizes.length === 2) {
    return groupSizes[0] * groupSizes[1];
  }

  return "dammit";
};

const testTraversal = (nodes: Map<string, Set<string>>): number[] => {
  const visited = new Set<string>();
  const groupSizes = [];
  for (const [node] of nodes) {
    if (visited.has(node)) {
      continue;
    }
    const groupSize = traverse(node, nodes, visited);
    groupSizes.push(groupSize);
  }

  return groupSizes;
};

// a modified version of BFS that stores predecessor
// of each vertex in array p
// and its distance from source in array d
const BFS = (
  nodes: Map<string, Set<string>>,
  src: string,
  end: string
): number => {
  // pred[x] gives predecessor of x
  const pred = new Map<string, string>();
  // dist[x] stores distance of x from src
  const dist = new Map<string, number>();
  const queue: string[] = [];

  let visited = new Set<string>();

  visited.add(src);
  dist.set(src, 0);
  queue.push(src);

  // standard BFS algorithm
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    const node = nodes.get(nodeId)!;
    // For each node connected to this one
    for (const adjNode of node) {
      if (!visited.has(adjNode)) {
        visited.add(adjNode);
        dist.set(adjNode, dist.get(nodeId)! + 1);
        pred.set(adjNode, nodeId);
        queue.push(adjNode);

        // We can stop BFS when we find the end
        if (adjNode === end) {
          return dist.get(adjNode)!;
        }
      }
    }
  }

  return -1;
};

const removeConnections = (
  nodes: Map<string, Set<string>>,
  ...edges: string[]
) => {
  for (const edge of edges) {
    const [from, to] = edge.split("-");
    nodes.get(from)?.delete(to);
    nodes.get(to)?.delete(from);
  }
};

const addConnections = (
  nodes: Map<string, Set<string>>,
  ...edges: string[]
) => {
  for (const edge of edges) {
    const [from, to] = edge.split("-");
    nodes.get(from)?.add(to);
    nodes.get(to)?.add(from);
  }
};

const traverse = (
  node: string,
  nodes: Map<string, Set<string>>,
  visited: Set<string>
): number => {
  if (visited.has(node)) {
    return 0;
  }
  let groupSize = 0;
  const visitStack = [node];
  while (visitStack.length > 0) {
    const current = visitStack.shift()!;
    if (visited.has(current)) {
      continue;
    }
    visited.add(current);
    groupSize++;
    visitStack.push(...(nodes.get(current) || []));
  }

  return groupSize;
};

const part2 = (input: string[]): string | number => {
  return "not implemented";
};

export default function useDay25() {
  return { part1, part2 };
}
