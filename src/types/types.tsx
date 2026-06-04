export type Rank = "A" | "K" | "Q" | "J" | "10"
  | "9" | "8" | "7" | "6" | "5"
  | "4" | "3" | "2";

export type Suit = "S" | "H" | "C" | "D";

export type CardCode = `${Rank}${Suit}`;

export type Weapon = {
  strength: number,
  limit: number | null,
  limitSuite: string | null,
}

