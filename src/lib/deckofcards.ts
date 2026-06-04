import type { CardCode } from "../types/types";

const apibase = "https://deckofcardsapi.com/api/";
const rawget = async (uri: string) => {return (await fetch(apibase + uri)).json()};
const newdeck = async () => {
    const received = await rawget('deck/new/shuffle?deck_count=1&remove=JOKER_BLACK,JOKER_RED,JD,QD,KD,AD,JH,QH,KH,AH') as ShuffleResponse;
    DeckOfCardsAPI.deck_id = received.deck_id;
}
const draw = async (amount: number) => {
    const response =  (await rawget('deck/' + (DeckOfCardsAPI.deck_id ?? 'new') + '/draw?count=' + amount) as DrawResponse);
    DeckOfCardsAPI.remaining = response.remaining;
    return response.cards;
}
const tobottom = async (cardCodes: CardCode[]) => {
    const response = await rawget('deck/' + DeckOfCardsAPI.deck_id + '/return/?cards=' + (cardCodes.join(',')));
    DeckOfCardsAPI.remaining = response.remaining
}
export const DeckOfCardsAPI: {
    rawget: (uri:string) => Promise<any>,
    deck_id: null|string,
    newdeck: ()=>Promise<void>,
    draw: (amount: number) => Promise<CardDraw[]>,
    tobottom: (cardCodes: CardCode[]) => Promise<void>,
    remaining: number,
} = {
    rawget: rawget,
    deck_id: null,
    newdeck: newdeck,
    draw: draw,
    tobottom: tobottom,
    remaining: 52,
}

export type ShuffleResponse = {
    success: boolean,
    deck_id: string,
    shuffled: boolean,
    remaining: number,
}

export type DrawResponse = {
    success: boolean,
    cards: CardDraw[],
    remaining: number,
}

export type CardDraw = {
    code: CardCode,
    image: string,
    value: number,
    suit: string,
}