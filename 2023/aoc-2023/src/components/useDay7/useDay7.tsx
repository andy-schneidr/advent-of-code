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

const getHandType = (cards: number[]): HandType => {
  const c1 = cards[0];
  const c2 = cards[1];
  const c3 = cards[2];
  const c4 = cards[3];
  const c5 = cards[4];
  if (c1 === c2 && c2 === c3 && c3 === c4 && c4 === c5) {
    return HandType.FiveOfAKind;
  }
  if (
    (c1 === c2 && c2 === c3 && c3 === c4) ||
    (c2 === c3 && c3 === c4 && c4 === c5)
  ) {
    return HandType.FourOfAKind;
  }
  if (
    (c1 === c2 && c2 === c3 && c4 === c5) ||
    (c1 === c2 && c3 === c4 && c4 === c5)
  ) {
    return HandType.FullHouse;
  }
  if (
    (c1 === c2 && c2 === c3) ||
    (c2 === c3 && c3 === c4) ||
    (c3 === c4 && c4 === c5)
  ) {
    return HandType.ThreeOfAKind;
  }
  if (
    (c1 === c2 && c3 === c4) ||
    (c1 === c2 && c4 === c5) ||
    (c2 === c3 && c4 === c5)
  ) {
    return HandType.TwoPairs;
  }
  if (c1 === c2 || c2 === c3 || c3 === c4 || c4 === c5) {
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
    const cardValues = cards.map((card) => letterToValueMapPart1[card]);
    const hand: Hand = {
      cards: cardValues,
      type: HandType.HighCard,
      bid: parseInt(bid),
    };
    const cardsCopy = [...hand.cards];
    cardsCopy.sort();
    hand.type = getHandType(cardsCopy);
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

const letterToValueMapPart2: { [key: string]: number } = {
  A: 14,
  K: 13,
  Q: 12,
  T: 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
  J: 1,
};

const getHandTypeGivenOnes = (type: HandType, numOnes: number): HandType => {
  if (numOnes === 0) {
    return type;
  }
  switch (type) {
    case HandType.HighCard:
      if (numOnes === 1) {
        return HandType.OnePair;
      }
      return HandType.HighCard;
    case HandType.OnePair:
      if (numOnes === 1 || numOnes === 2) {
        return HandType.ThreeOfAKind;
      }
      return HandType.OnePair;

    case HandType.TwoPairs:
      if (numOnes === 1) {
        return HandType.FullHouse;
      } else if (numOnes === 2) {
        return HandType.FourOfAKind;
      }
      return HandType.TwoPairs;
    case HandType.ThreeOfAKind:
      if (numOnes === 1) {
        return HandType.FourOfAKind;
      } else if (numOnes === 3) {
        return HandType.FourOfAKind;
      }
      return HandType.ThreeOfAKind;
    case HandType.FullHouse:
      if (numOnes === 2 || numOnes === 3) {
        return HandType.FiveOfAKind;
      }
      return HandType.FullHouse;
    case HandType.FourOfAKind:
      if (numOnes === 1 || numOnes === 4) {
        return HandType.FiveOfAKind;
      }
      return HandType.FourOfAKind;
    case HandType.FiveOfAKind:
      return HandType.FiveOfAKind;
  }
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
    const cardValues = cards.map((card) => letterToValueMapPart2[card]);
    const hand: Hand = {
      cards: cardValues,
      type: HandType.HighCard,
      bid: parseInt(bid),
    };
    const numOnes = hand.cards.filter((card) => card === 1).length;
    const cardsCopy = [...hand.cards].map((card) => (card === 1 ? 0 : card));
    cardsCopy.sort();
    hand.type = getHandType(cardsCopy);
    hand.type = getHandTypeGivenOnes(hand.type, numOnes);
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
