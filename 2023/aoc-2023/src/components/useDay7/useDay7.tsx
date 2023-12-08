enum HandType {
  HighCard,
  OnePair,
  TwoPairs,
  ThreeOfAKind,
  FullHouse,
  FourOfAKind,
  FiveOfAKind,
}

type Hand = {
  cards: number[];
  type: HandType;
  bid: number;
};

const letterToValueMapPart1: { [key: string]: number } = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
};

const letterToValueMapPart2: { [key: string]: number } = {
  ...letterToValueMapPart1,
  J: 1,
};

const getHandType = (cards: string[], jokers: boolean): HandType => {
  const counts: { [key: string]: number } = {};
  cards.forEach((card) => {
    counts[card] = (counts[card] || 0) + 1;
  });
  const sortableCounts: { card: string; count: number }[] = [];
  for (const card in counts) {
    sortableCounts.push({ card, count: counts[card] });
  }
  sortableCounts.sort((a, b) => b.count - a.count);

  if (jokers) {
    const jokersIndex = sortableCounts.findIndex((count) => count.card === "J");
    if (jokersIndex !== -1 && sortableCounts[0].count < 5) {
      const jokersCount = sortableCounts.splice(jokersIndex, 1)[0].count;
      sortableCounts[0].count += jokersCount;
    }
  }

  if (sortableCounts[0].count === 5) {
    return HandType.FiveOfAKind;
  }
  if (sortableCounts[0].count === 4) {
    return HandType.FourOfAKind;
  }
  if (sortableCounts[0].count === 3 && sortableCounts[1].count === 2) {
    return HandType.FullHouse;
  }
  if (sortableCounts[0].count === 3) {
    return HandType.ThreeOfAKind;
  }
  if (sortableCounts[0].count === 2 && sortableCounts[1].count === 2) {
    return HandType.TwoPairs;
  }
  if (sortableCounts[0].count === 2) {
    return HandType.OnePair;
  }
  return HandType.HighCard;
};

const part1 = (input: string[]): string | number => {
  const allHands: Hand[] = [];
  for (let i = 0; i < input.length; i++) {
    if (input[i] === "") {
      continue;
    }
    let line = input[i];
    let [handRaw, bid] = line.split(" ");

    let cards = handRaw.split("");
    const hand: Hand = {
      cards: cards.map((card) => letterToValueMapPart1[card]),
      type: HandType.HighCard,
      bid: parseInt(bid),
    };
    hand.type = getHandType(cards.sort(), false);
    allHands.push(hand);
  }

  // Sort the hands in ascending order of type, then by card values
  allHands.sort((a, b) => {
    if (a.type === b.type) {
      for (let i = 0; i < a.cards.length; i++) {
        if (a.cards[i] !== b.cards[i]) {
          return a.cards[i] - b.cards[i];
        }
      }
      return 0;
    }
    return a.type - b.type;
  });

  let handXBidProducts = 0;
  for (let i = 0; i < allHands.length; i++) {
    handXBidProducts += allHands[i].bid * (i + 1);
  }
  return handXBidProducts;
};

const part2 = (input: string[]): string | number => {
  if (input.length < 2) {
    return "Invalid input";
  }
  const allHands: Hand[] = [];
  for (let i = 0; i < input.length; i++) {
    if (input[i] === "") {
      continue;
    }
    let line = input[i];
    let [handRaw, bid] = line.split(" ");

    let cards = handRaw.split("");
    const hand: Hand = {
      cards: cards.map((card) => letterToValueMapPart2[card]),
      type: HandType.HighCard,
      bid: parseInt(bid),
    };
    hand.type = getHandType(cards, true);
    allHands.push(hand);
  }

  // Sort the hands in ascending order of type, then by card values
  allHands.sort((a, b) => {
    if (a.type === b.type) {
      for (let i = 0; i < a.cards.length; i++) {
        if (a.cards[i] !== b.cards[i]) {
          return a.cards[i] - b.cards[i];
        }
      }
      return 0;
    }
    return a.type - b.type;
  });

  let handXBidProducts = 0;
  for (let i = 0; i < allHands.length; i++) {
    handXBidProducts += allHands[i].bid * (i + 1);
  }
  return handXBidProducts;
};

export default function useDay7() {
  return { part1, part2 };
}
