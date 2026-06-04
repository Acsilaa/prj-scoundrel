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
  draw: (amount: number) => Promise<CardDraw[]>;
  toBottom: (cardCodes: CardCode[]) => Promise<void>;
};

export const useDeckOfCards = create<DeckState>((set, get) => ({
  deckId: null,
  remaining: 52,

  newDeck: async () => {
    const res = (await rawget(
      "deck/new/shuffle?deck_count=1&remove=JOKER_BLACK,JOKER_RED,JD,QD,KD,AD,JH,QH,KH,AH"
    )) as ShuffleResponse;

    set({
      deckId: res.deck_id,
      remaining: res.remaining,
    });
  },

  draw: async (amount: number) => {
    const deckId = get().deckId ?? "new";

    const res = (await rawget(
      `deck/${deckId}/draw?count=${amount}`
    )) as DrawResponse;

    set({
      remaining: res.remaining,
    });

    return res.cards;
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