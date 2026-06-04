import type { CardCode, Weapon } from "../types/types"

export type GameState = {
    deck_id: string,
    health: number,
    weapon: Weapon | null,
    currentRoom: CardCode[],
    healCooldown: number,
    skipCooldown: number,
}

export const saveToLS = (gamestate: GameState) => {
    localStorage.setItem('savedgame', JSON.stringify(gamestate))
}

export const loadFromLS = () => {
    return JSON.parse(localStorage.getItem('savedgame')!) as GameState;
}