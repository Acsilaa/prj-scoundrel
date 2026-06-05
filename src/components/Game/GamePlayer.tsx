import { useEffect, useRef, useState, type JSX } from "react";
import { useGameState } from "../../App";
import PlayingCard from "../PlayingCard/PlayingCard";
import Talon from "../PlayingCard/Talon";
import type { CardCode, Weapon } from "../../types/types";
import { useDeckOfCards } from "../../lib/deckofcards";
import WeaponDisplay from "./WeaponDisplay";
import { saveToLS, type GameState } from "../../lib/localstorage";
import { codeToNumber } from "../../lib/converter";

export default function GamePlayer() {
    const talonRef = useRef<HTMLDivElement>(null);
    const slot1Ref = useRef<HTMLDivElement>(null);
    const slot2Ref = useRef<HTMLDivElement>(null);
    const slot3Ref = useRef<HTMLDivElement>(null);
    const slot4Ref = useRef<HTMLDivElement>(null);
    const gamestate = useGameState();
    const [slotCards, setCards] = useState<(CardCode | null)[]>(gamestate.gamestate!.currentRoom);
    const [canInteract, setCanInteract] = useState(false);
    const DOC = useDeckOfCards();
    const [didInit, setDidInit] = useState(false);

    useEffect(() => {
        if (didInit) return;
        const init = async () => {
            if (gamestate.gamestate == null) return;
            const cards = gamestate.gamestate!.currentRoom;
            console.log(cards)

            let nullCount = 0;
            for (let i = 0; i < 4; i++) {
                if (cards[i] === null) nullCount++;
            }
            const newOrder = [...cards];
            if(nullCount >= 3){
                const drawn: CardCode[] = (await DOC.draw(nullCount)).map(c => c.code);
                let appended = 0;
                for (let i = 0; i < 4; i++) {
                    if (newOrder[i] == null) {
                        newOrder[i] = drawn[appended];
                        appended++;
                    }
                }
            }

            setCards([...newOrder]);
            setCanInteract(true);
            setDidInit(true);
            saveToLS({
                ...gamestate.gamestate!,
                currentRoom: newOrder,
                remaining: DOC.remaining,
            })
            return;
        }
        init();
    }, [gamestate.gamestate?.currentRoom])

    useEffect(()=>{
        if(!gamestate.gamestate) return;
        gamestate.set({...gamestate.gamestate!, remaining: DOC.remaining})
    }, [DOC.remaining])

    const cardClick = (slotIdx: number) => {
        if (!canInteract || slotCards[slotIdx] === null) return;
        const weaponAndHealChanges: { weapon: Weapon | null, healingCD: number, health: number } = processCardFight(slotCards[slotIdx]);
        const newCards = [...slotCards];
        newCards[slotIdx] = null;
        setCards([...newCards]);

        const newGameState: GameState = {
            ...gamestate.gamestate!,
            skipCooldown: 1, // cant skit this room anymore
            currentRoom: [...newCards], // update the room
            ...weaponAndHealChanges,
        }

        gamestate.set({ ...newGameState });

        saveToLS({ ...newGameState })
    }

    const processCardFight = (card: CardCode): { weapon: Weapon | null, healingCD: number, health: number } => { // TODO FACE CARD PARSE!!!
        if (['C', 'S'].includes(card[1])) { // battle

            const reduction = (gamestate.gamestate!.weapon?.limit ?? 1) - 1;
            const newHP = gamestate.gamestate!.health - ((codeToNumber(card)) - reduction);
            const newWeapon: Weapon | null = gamestate.gamestate!.weapon !== null ? {
                ...gamestate.gamestate!.weapon,
                limitSuite: card[1],
                limit: Math.min((gamestate.gamestate!.weapon.limit ?? 14), codeToNumber(card)),
            } : null;

            return {
                weapon: newWeapon,
                healingCD: gamestate.gamestate!.healCooldown, //heal cd stays the same
                health: newHP,
            }
        }
        if (card[1] == "D") { // weapon
            return {
                weapon: {
                    limit: null,
                    limitSuite: null,
                    strength: codeToNumber(card),
                },
                healingCD: gamestate.gamestate!.healCooldown, //heal cd stays the same
                health: gamestate.gamestate!.health,
            }
        }
        // heal
        const canHeal = gamestate.gamestate!.healCooldown == 0;
        const newHP = gamestate.gamestate!.health + (canHeal ? codeToNumber(card) : 0);
        const healCD = 1;

        return {
            weapon: gamestate.gamestate!.weapon,
            healingCD: healCD,
            health: newHP,
        }

    }

    return <>
        <h1 className="text-center text-4xl mb-20">Scoundrel</h1>
        <div className="w-8/12 mx-auto flex items-center justify-between">
            <div className="group relative">
                <Talon remaining={gamestate.gamestate!.remaining} max={5} ref={talonRef} />
                <span className={`hidden absolute group-hover:block top-full left-1/2 -translate-x-1/2 translate-y-2 ${gamestate.gamestate!.skipCooldown != 0 ? 'text-red-800' : ''}`}>Skip</span>
                <span className={`hidden absolute group-hover:block top-full left-full -translate-x-1/2 translate-y-2 ${gamestate.gamestate!.skipCooldown != 0 ? 'text-red-800' : ''}`}>{gamestate.gamestate?.remaining}</span>
            </div>
            <div className="flex items-center justify-center w-[700px]">
                <div className="bg-black/50 shadow-lg shadow-black h-[200px] w-36 mr-auto flex items-center justify-center" ref={slot1Ref}>
                    {slotCards[0] ? <PlayingCard interactable cardCode={slotCards[0]} onClick={() => { cardClick(0) }} /> : null}
                </div>
                <div className="bg-black/50 shadow-lg shadow-black h-[200px] w-36 mx-auto flex items-center justify-center" ref={slot2Ref}>
                    {slotCards[1] ? <PlayingCard interactable cardCode={slotCards[1]} onClick={() => { cardClick(1) }} /> : null}
                </div>
                <div className="bg-black/50 shadow-lg shadow-black h-[200px] w-36 mx-auto flex items-center justify-center" ref={slot3Ref}>
                    {slotCards[2] ? <PlayingCard interactable cardCode={slotCards[2]} onClick={() => { cardClick(2) }} /> : null}
                </div>
                <div className="bg-black/50 shadow-lg shadow-black h-[200px] w-36 ml-auto flex items-center justify-center" ref={slot4Ref}>
                    {slotCards[3] ? <PlayingCard interactable cardCode={slotCards[3]} onClick={() => { cardClick(3) }} /> : null}
                </div>
            </div>
        </div>
        <div className="w-8/12 grid [grid-template-areas:'a_a_b_b_c_c'_'a_a_b_b_c_c'] mx-auto content-center place-items-center mt-32">
            <div style={{ gridArea: 'a' }}>
                <span>{gamestate.gamestate!.health}</span>
            </div>
            <div style={{ gridArea: 'b' }}>
                <WeaponDisplay weapon={gamestate.gamestate!.weapon} />
            </div>
            <div style={{ gridArea: 'c' }}>
                {/* empty */}
            </div>
        </div>
    </>


}