import { useEffect, useRef, useState } from "react";
import { useGameState } from "../../App";
import PlayingCard from "../PlayingCard/PlayingCard";
import Talon from "../PlayingCard/Talon";
import type { CardCode, Weapon } from "../../types/types";
import { useDeckOfCards, type CardDraw } from "../../lib/deckofcards";
import WeaponDisplay from "./WeaponDisplay";
import { saveToLS, type GameState } from "../../lib/localstorage";
import HealthDisplayer from "./HealthDisplayer";
import { processCardFight } from "../../util/gameplay";

import HeartbeatVignette from "../misc/HeartbeatVigbette";
import GameEndDisplayer from "./GameEndedDisplayer";
import { codeToNumber } from "../../lib/converter";

export default function GamePlayer({ durationExpired }: { durationExpired: boolean }) {
    const talonRef = useRef<HTMLDivElement>(null);
    const slot1Ref = useRef<HTMLDivElement>(null);
    const slot2Ref = useRef<HTMLDivElement>(null);
    const slot3Ref = useRef<HTMLDivElement>(null);
    const slot4Ref = useRef<HTMLDivElement>(null);
    const [attackMode, setAttackMode] = useState<"Weapon" | "Hands">("Hands");
    const gamestate = useGameState();
    const [slotCards, setCards] = useState<(CardCode | null)[]>(gamestate.gamestate!.currentRoom);
    const [gameEnded, setGameEnded] = useState<"defeat" | "victory" | null>(null);
    const [points, setPoints] = useState<number | undefined>(undefined);
    const [canInteract, setCanInteract] = useState(false);
    const lastHighscore = Number(localStorage.getItem('highscore')) ?? undefined;
    const DOC = useDeckOfCards();
    const didInitRef = useRef(false);

    useEffect(() => {
        if (gamestate.gamestate == null) return;
        setAttackMode(gamestate.gamestate?.weapon ? "Weapon" : "Hands")

    }, [gamestate.gamestate?.weapon])

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

            let realcards = 0;
            newOrder.forEach(c => c == null ? null : realcards++);

            setCards([...newOrder]);
            setCanInteract(true);
            const updatedGameState = {
                ...gamestate.gamestate!,
                currentRoom: newOrder,
                remaining: remainingAfterDraw,
            };
            gamestate.set(updatedGameState);
            saveToLS(updatedGameState);

            if (realcards == 1 && DOC.remaining == 0) {
                setGameEnded("victory");
                const lastCard = newOrder.find(c => c != null)!;
                setPoints(updatedGameState.health + (lastCard[1] == "H" ? codeToNumber(lastCard) : 0))
                setCanInteract(false)
            }
            if (gamestate.gamestate!.health == 0) {
                setGameEnded("defeat");
                setCanInteract(false)
            }
            return;
        }
        init();
    }, [])



    const cardClick = async (slotIdx: number) => {
        if (!canInteract || slotCards[slotIdx] === null) return;
        const weaponAndHealChanges: { weapon: Weapon | null, healCooldown: number, health: number } =
            processCardFight(slotCards[slotIdx], gamestate.gamestate!, attackMode);
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
        if (cardCount < 2 && DOC.remaining != 0 && newGameState.health > 0) {
            setCanInteract(false);
            await endRound(newGameState);
            setCanInteract(true);
        }
        if (newGameState.health == 0) { // lose
            setGameEnded("defeat");
            setCanInteract(false);

        }
        if (cardCount == 1 && DOC.remaining == 0) { // win
            setGameEnded("victory")
            const lastCard = newCards.find(c => c != null)!;
            setPoints(newGameState.health + (lastCard[1] == "H" ? codeToNumber(lastCard) : 0))
            setCanInteract(false);

        }
        gamestate.set({ ...newGameState });
        saveToLS({ ...newGameState })
    }

    useEffect(()=>{
        if(points !== undefined && points == 0) return;
        const last = localStorage.getItem('highscore') ?? undefined;
        if(last === undefined){
            localStorage.setItem('highscore', String(points));
            return;
        }

        localStorage.setItem('highscore', String(Math.max(points!, Number(last))));
    }, [points])

    const endRound = async (refGameState: GameState) => {
        refGameState.skipCooldown = Math.max(0, refGameState.skipCooldown - 1);
        refGameState.healCooldown = Math.max(0, refGameState.healCooldown - 1);

        if (refGameState.skipCooldown == 1) { // skipped
            // put back the cards to bottom
            const cardsToPutBack: CardCode[] = [];
            gamestate.gamestate!.currentRoom.forEach(c => c !== null ? cardsToPutBack.push(c) : null);
            const { remaining } = await DOC.toBottom(cardsToPutBack);
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
        refGameState.health = Math.max(refGameState.health, 0)
        refGameState.currentRoom = [...newOrder];
    }

    const trySkip = async () => {
        if (gamestate.gamestate!.skipCooldown != 0 || DOC.remaining == 0) return;
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

    useEffect(() => {
        console.log(gamestate.gamestate?.skipCooldown)
    }, [gamestate.gamestate?.skipCooldown])

    return <>
        <HeartbeatVignette health={gamestate.gamestate!.health} />

        <div className={`mx-auto py-[5%] w-10/12 duration-500 -translate-x-full ${durationExpired ? 'translate-x-0' : ''}`}>
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
                    <div className="bg-black/50 shadow-lg shadow-black h-[200px] w-36 mx-auto flex items-center rounded-md  justify-center" ref={slot2Ref}>
                        {slotCards[1] ? <PlayingCard interactable cardCode={slotCards[1]} onClick={() => { cardClick(1) }} /> : null}
                    </div>
                    <div className="bg-black/50 shadow-lg shadow-black h-[200px] w-36 mx-auto flex items-center rounded-md  justify-center" ref={slot3Ref}>
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
                    <WeaponDisplay weapon={gamestate.gamestate!.weapon} attackMode={attackMode} onClick={() => {
                        if (!gamestate.gamestate?.weapon) {
                            setAttackMode("Hands")
                            return;
                        }
                        setAttackMode(p => p == "Hands" ? "Weapon" : "Hands");
                    }} />
                </div>
                <div style={{ gridArea: 'c' }}>
                    {/* empty */}
                </div>
            </div>
        </div>

        <GameEndDisplayer gameEnded={gameEnded} points={points} lastHS={lastHighscore} />
    </>
}