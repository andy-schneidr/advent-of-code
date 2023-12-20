import { find } from "isbot";

enum State {
  OFF,
  ON,
}

enum Pulse {
  LOW,
  HIGH,
}

type SentPulse = {
  nodeFrom: string;
  nodeTo: string;
  pulse: Pulse;
};

class Node {
  id: string;
  desinationNodes: string[];
  inputs: Map<string, Pulse>;

  public constructor(id: string, desinationNodes: string[] = []) {
    this.id = id;
    this.desinationNodes = desinationNodes;
    this.inputs = new Map<string, Pulse>();
  }

  addInput(node: string) {
    this.inputs.set(node, Pulse.LOW);
  }

  public receivePulse(sentPulse: SentPulse): SentPulse[] {
    return [];
  }
}

class FlipFlop extends Node {
  state: State;

  constructor(id: string, destinationNodes: string[]) {
    super(id, destinationNodes);
    this.state = State.OFF;
  }

  receivePulse(sentPulse: SentPulse): SentPulse[] {
    if (sentPulse.pulse === Pulse.LOW) {
      this.state = this.state === State.OFF ? State.ON : State.OFF;
      const results: SentPulse[] = [];
      for (const node of this.desinationNodes) {
        results.push({
          nodeFrom: this.id,
          nodeTo: node,
          pulse: this.state === State.OFF ? Pulse.LOW : Pulse.HIGH,
        });
      }
      return results;
    }
    return [];
  }
}

class Conjunction extends Node {
  receivePulse(sentPulse: SentPulse): SentPulse[] {
    this.inputs.set(sentPulse.nodeFrom, sentPulse.pulse);
    const results: SentPulse[] = [];
    if (
      Array.from(this.inputs.values()).every((value) => value === Pulse.HIGH)
    ) {
      for (const node of this.desinationNodes) {
        results.push({ nodeFrom: this.id, nodeTo: node, pulse: Pulse.LOW });
      }
    } else {
      for (const node of this.desinationNodes) {
        results.push({ nodeFrom: this.id, nodeTo: node, pulse: Pulse.HIGH });
      }
    }
    return results;
  }
}

class Broadcast extends Node {
  receivePulse(sentPulse: SentPulse): SentPulse[] {
    const sentPulses: SentPulse[] = [];
    for (const node of this.desinationNodes) {
      sentPulses.push({
        nodeFrom: this.id,
        nodeTo: node,
        pulse: sentPulse.pulse,
      });
    }
    return sentPulses;
  }
}

const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b);
const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

const parseNodes = (input: string[]): Map<string, Node> => {
  const nodes = new Map<string, Node>();
  // find all the nodes
  for (let i = 0; i < input.length; i++) {
    const parts = input[i].split(" -> ");
    const destinationNodes = parts[1].split(", ");
    const name = parts[0].substring(1);
    if (parts[0].startsWith("&")) {
      nodes.set(name, new Conjunction(name, destinationNodes));
    }
    if (parts[0].startsWith("broadcaster")) {
      nodes.set(parts[0], new Broadcast(parts[0], destinationNodes));
    } else if (parts[0].startsWith("%")) {
      nodes.set(name, new FlipFlop(name, destinationNodes));
    }
  }

  // populate the inputs for all nodes
  for (let i = 0; i < input.length; i++) {
    const parts = input[i].split(" -> ");
    const destinationNodes = parts[1].split(", ");
    const name = parts[0].substring(1);
    for (const node of destinationNodes) {
      if (nodes.has(node)) {
        nodes.get(node)?.addInput(name);
      }
    }
  }
  return nodes;
};
const compute = (
  nodes: Map<string, Node>,
  presses: number,
  findDestination?: string,
  findDestinationEmission?: Pulse
): number => {
  let totalHighPulses = 0;
  let totalLowPulses = 0;

  let sentPulses: SentPulse[] = [];
  let totalPresses = 0;

  while (
    sentPulses.length > 0 ||
    totalPresses < presses ||
    findDestination !== undefined
  ) {
    if (sentPulses.length === 0) {
      totalPresses++;
      sentPulses.push({
        nodeFrom: "button",
        nodeTo: "broadcaster",
        pulse: Pulse.LOW,
      });
      continue;
    }

    let sentPulse = sentPulses.shift();
    if (!sentPulse) {
      console.log("WTF no sent pulse??");
      break;
    }

    // console.log(
    //   `${sentPulse.nodeFrom} - ${sentPulse.pulse} -> ${sentPulse.nodeTo}`
    // );

    if (sentPulse.pulse === Pulse.HIGH) {
      totalHighPulses++;
    } else {
      totalLowPulses++;
    }

    if (
      sentPulse.nodeFrom === findDestination &&
      sentPulse.pulse === findDestinationEmission
    ) {
      console.log(
        "Presses to make ",
        findDestination,
        " emit ",
        findDestinationEmission,
        " : ",
        totalPresses
      );
      return totalPresses;
    }

    const nodeTo = nodes.get(sentPulse.nodeTo);
    if (!nodeTo) {
      // console.log("WTF no nodeTo?? ", sentPulse.nodeTo);
      continue;
    }
    sentPulses.push(...nodeTo.receivePulse(sentPulse));
  }

  return totalHighPulses * totalLowPulses;
};

const part1 = (input: string[]): string | number => {
  const nodes = parseNodes(input);
  return compute(nodes, 1000);
};

const part2 = (input: string[]): string | number => {
  let nodes = parseNodes(input);
  // Find the node that is the source of the rx node
  const rxSourceNode = Array.from(nodes.values()).find((node) =>
    node.desinationNodes.includes("rx")
  );
  // This is kind of a cop-out, since I'm lazy and I don't have
  // another way to test if it would work, assert that
  // rxSourceNode is a Conjunction
  if (!(rxSourceNode instanceof Conjunction)) {
    return "WTF rxSourceNode is not a Conjunction";
  }

  // anyway, find the nodes that are the source of THAT node
  const rxSourceSourceNodes = Array.from(nodes.values()).filter((node) =>
    node.desinationNodes.includes(rxSourceNode.id)
  );

  const lowestTimesToEmitHigh: number[] = [];
  for (const node of rxSourceSourceNodes) {
    // This is just the easiest way to reset everything I guess haha
    let nodes = parseNodes(input);
    lowestTimesToEmitHigh.push(compute(nodes, 0, node.id, Pulse.HIGH));
  }

  return lowestTimesToEmitHigh.reduce(lcm);
};

export default function useDay20() {
  return { part1, part2 };
}
