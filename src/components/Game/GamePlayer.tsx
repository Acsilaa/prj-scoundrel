import { useEffect, useRef, useState } from "react";
import { useGameState } from "../../App";
import PlayingCard from "../PlayingCard/PlayingCard";
import Talon from "../PlayingCard/Talon";
import type { CardCode, Weapon } from "../../types/types";
import { useDeckOfCards, type CardDraw } from "../../lib/deckofcards";
import WeaponDisplay from "./WeaponDisplay";
import { saveToLS, type GameState } from "../../lib/localstorage";
import { codeToNumber } from "../../lib/converter";
import HealthDisplayer from "./HealthDisplayer";

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
    const didInitRef = useRef(false);

    useEffect(() => {
        if (didInitRef.current) return;
        didInitRef.current = true;
        
        const init = async () => {
            if (gamestate.gamestate == null) return;
            const cards = gamestate.gamestate!.currentRoom;

            let nullCount = 0;
            for (let i = 0; i < 4; i++) {
                if (cards[i] === null) nullCount++;
            }
            const newOrder = [...cards];
            let remainingAfterDraw = gamestate.gamestate!.remaining;
            if (nullCount >= 3 && remainingAfterDraw != 0) {
                const drawResult = await DOC.draw(Math.min(nullCount, remainingAfterDraw));
                const drawn: CardCode[] = drawResult.cards.map((c: CardDraw) => c.code);
                remainingAfterDraw = drawResult.remaining;
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
            const updatedGameState = {
                ...gamestate.gamestate!,
                currentRoom: newOrder,
                remaining: remainingAfterDraw,
            };
            gamestate.set(updatedGameState);
            saveToLS(updatedGameState);
            return;
        }
        init();
    }, [])

    const cardClick = async (slotIdx: number) => {
        if (!canInteract || slotCards[slotIdx] === null) return;
        const weaponAndHealChanges: { weapon: Weapon | null, healCooldown: number, health: number } = processCardFight(slotCards[slotIdx]);
        const newCards = [...slotCards];
        newCards[slotIdx] = null;
        setCards([...newCards]);

        const newGameState: GameState = {
            ...gamestate.gamestate!,
            skipCooldown: Math.max(1, gamestate.gamestate!.skipCooldown), // cant skip this room anymore
            currentRoom: [...newCards], // update the room
            ...weaponAndHealChanges,
        }

        let cardCount = 4;
        newCards.forEach(c => c === null ? cardCount-- : null)
        if (cardCount < 2 && DOC.remaining != 0) {
            setCanInteract(false);
            await endRound(newGameState);
            setCanInteract(true);
        }
        gamestate.set({ ...newGameState });
        saveToLS({ ...newGameState })
    }

    const processCardFight = (card: CardCode): { weapon: Weapon | null, healCooldown: number, health: number } => { // TODO WEAPON TOGGLE
        if (['C', 'S'].includes(card[1])) { // battle
            const gs = gamestate.gamestate!;
            let reduction = gs.weapon !== null ?
                (gs.weapon.limit !== null ?
                    (gs.weapon.limit > codeToNumber(card) ?
                        Math.min(codeToNumber(card), Math.min(gs.weapon.limit, gs.weapon.strength)) : 0) :
                    Math.min(codeToNumber(card), gs.weapon.strength))
                : 0;
            reduction = Math.max(0, reduction);
            const newHP = gamestate.gamestate!.health - ((codeToNumber(card)) - reduction);
            const newWeapon: Weapon | null = gamestate.gamestate!.weapon !== null ? {
                ...gamestate.gamestate!.weapon,
                limitSuite: card[1],
                limit: Math.min((gamestate.gamestate!.weapon.limit ?? 14), codeToNumber(card)),
            } : null;

            return {
                weapon: (newWeapon !== null && newWeapon.limit != 2 ? newWeapon : null),
                healCooldown: gamestate.gamestate!.healCooldown, //heal cd stays the same
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
                healCooldown: gamestate.gamestate!.healCooldown, //heal cd stays the same
                health: gamestate.gamestate!.health,
            }
        }
        // heal
        const canHeal = gamestate.gamestate!.healCooldown == 0;
        const newHP = Math.min(gamestate.gamestate!.health + (canHeal ? codeToNumber(card) : 0), 20);

        return {
            weapon: gamestate.gamestate!.weapon,
            healCooldown: 1,
            health: newHP,
        }

    }

    const endRound = async (refGameState: GameState) => {
        console.log("here")
        refGameState.skipCooldown = Math.max(0, refGameState.skipCooldown - 1);
        refGameState.healCooldown = Math.max(0, refGameState.healCooldown - 1);

        if (refGameState.skipCooldown == 1) { // skipped
            // put back the cards to bottom
            const cardsToPutBack: CardCode[] = [];
            gamestate.gamestate!.currentRoom.forEach(c => c !== null ? cardsToPutBack.push(c) : null);
            const {remaining} = await DOC.toBottom(cardsToPutBack);
            // draw more
            setCards([null, null, null, null])
            const res = await DOC.draw(Math.min(remaining, 4))

            refGameState.currentRoom = res.cards.map(c => c.code);
            refGameState.remaining = res.remaining;
            return;
        }
        // normal next round
        const cards = refGameState.currentRoom;
        let nullCount = 0;
        for (let i = 0; i < 4; i++) {
            if (cards[i] === null) nullCount++;
        }
        const newOrder = [...cards];
        if (nullCount >= 3 && refGameState.remaining != 0) {
            const drawResult = await DOC.draw(Math.min(nullCount, refGameState.remaining));
            const drawn: CardCode[] = drawResult.cards.map((c: CardDraw) => c.code);
            let appended = 0;
            for (let i = 0; i < 4; i++) {
                if (newOrder[i] == null) {
                    newOrder[i] = drawn[appended];
                    appended++;
                }
            }
            refGameState.remaining = drawResult.remaining;
        }

        setCards([...newOrder]);
        refGameState.currentRoom = [...newOrder];
    }

    const trySkip = async () => {
        if(gamestate.gamestate!.skipCooldown != 0 || DOC.remaining == 0) return;
        const newGameState: GameState = {
            ...gamestate.gamestate!,
            skipCooldown: 2,
        }

        setCanInteract(false);
        await endRound(newGameState);
        
        setCards(newGameState.currentRoom)
        
        gamestate.set({ ...newGameState });
        saveToLS({ ...newGameState })
        setCanInteract(true);
    }

    useEffect(()=>{
        console.log(gamestate.gamestate?.skipCooldown)
    }, [gamestate.gamestate?.skipCooldown])

    return <>
        <h1 className="text-center text-4xl mb-20">Scoundrel</h1>
        <div className="w-8/12 mx-auto flex items-center justify-between">
            <div className="group relative">
                <Talon remaining={gamestate.gamestate!.remaining} max={5} ref={talonRef} onClick={trySkip} />
                <span className={`hidden absolute group-hover:block top-full left-1/2 -translate-x-1/2 translate-y-2 ${gamestate.gamestate!.skipCooldown != 0 || DOC.remaining == 0 ? 'text-red-800' : ''}`}>Skip</span>
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
                <HealthDisplayer health={gamestate.gamestate?.health} />
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