import { create } from "zustand";
import type { CardCode } from "../types/types";

const apibase = "https://deckofcardsapi.com/api/";

const rawget = async (uri: string) => {
  return (await fetch(apibase + uri)).json();
};

export type ShuffleResponse = {
  success: boolean;
  deck_id: string;
  shuffled: boolean;
  remaining: number;
};

export type DrawResponse = {
  success: boolean;
  cards: CardDraw[];
  remaining: number;
};

export type CardDraw = {
  code: CardCode;
  image: string;
  value: number;
  suit: string;
};

type DeckState = {
  deckId: string | null;
  remaining: number;
  newDeck: () => Promise<void>;
  draw: (amount: number) => Promise<{ cards: CardDraw[]; remaining: number }>;
  toBottom: (cardCodes: CardCode[]) => Promise<void>;
};

export const useDeckOfCards = create<DeckState>((set, get) => ({
  deckId: null,
  remaining: 44,

  newDeck: async () => {
    const res = (await rawget(
  "deck/new/shuffle/?cards=" +
  [
    // Clubs
    "AC","2C","3C","4C","5C","6C","7C","8C","9C","0C","JC","QC","KC",

    // Diamonds (without J,Q,K,A)
    "2D","3D","4D","5D","6D","7D","8D","9D","0D",

    // Hearts (without J,Q,K,A)
    "2H","3H","4H","5H","6H","7H","8H","9H","0H",

    // Spades
    "AS","2S","3S","4S","5S","6S","7S","8S","9S","0S","JS","QS","KS"
  ].join(",")
)) as ShuffleResponse;

    set({
      deckId: res.deck_id,
      remaining: res.remaining,
    });
  },

  draw: async (amount: number) => {
    console.log("drawn " + amount + " cards")
    const deckId = get().deckId ?? "new";

    const res = (await rawget(
      `deck/${deckId}/draw?count=${amount}`
    )) as DrawResponse;

    set({
      remaining: res.remaining,
    });

    return { cards: res.cards, remaining: res.remaining };
  },

  toBottom: async (cardCodes: CardCode[]) => {
    const deckId = get().deckId;
    if (!deckId) return;

    const res = await rawget(
      `deck/${deckId}/return/?cards=${cardCodes.join(",")}`
    );

    set({
      remaining: res.remaining,
    });
  },
}));