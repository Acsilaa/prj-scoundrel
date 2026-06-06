import { useEffect, useState } from "react";
import { useDeckOfCards } from "../../lib/deckofcards";
import { saveToLS } from "../../lib/localstorage";
import Game from "../../pages/GameWrapper";
import { useGameState, usePage } from "../../App";
import MainMenu from "../../pages/MainMenu";

export default function GameEndDisplayer({
    gameEnded, points, lastHS
}: {
    gameEnded: "victory" | "defeat" | null;
    points?: number;
    lastHS?: number;
}) {
    const [mounted, setMounted] = useState(false);
    const [active, setActive] = useState(false); // controls dark + blur
    const [modalIn, setModalIn] = useState(false);
    const pagehook = usePage();
    const DOC = useDeckOfCards();
    const GStateHook = useGameState();

    useEffect(() => {
        if (gameEnded !== null) {
            setMounted(true);

            const t1 = setTimeout(() => {
                setActive(true); // start dim + blur after 1s
            }, 1000);

            const t2 = setTimeout(() => {
                setModalIn(true); // slide modal in slightly after
            }, 1400);

            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
            };
        } else {
            setMounted(false);
            setActive(false);
            setModalIn(false);
        }
    }, [gameEnded]);

    
    const startNewGame = async () => {
        // init deck via zustand store
        console.log("started new game load")
        pagehook.set(null);

        await DOC.newDeck();
        console.log("deck done")
        
        const deckId = useDeckOfCards.getState().deckId;
        
        const newGameState = {
            currentRoom: [null, null, null, null],
            deck_id: deckId!,
            healCooldown: 0,
            health: 20,
            skipCooldown: 0,
            weapon: null,
            remaining: 42,
        };
        
        GStateHook.set(newGameState);
        saveToLS(newGameState);
        
        pagehook.set(<Game />);
    }
    if (!mounted) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* BACKDROP */}
            <div
                className={[
                    "absolute inset-0 transition-all duration-700",
                    active ? "bg-black/60 backdrop-blur-md" : "bg-black/0 backdrop-blur-0",
                ].join(" ")}
            />

            {/* MODAL */}
            <div
                className={[
                    "relative w-80 min-h-40 rounded-md bg-gray-900 flex flex-col items-center",
                    "transition-all duration-700 ease-out",
                    modalIn
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-10 scale-95",
                ].join(" ")}>
                {gameEnded == "victory" &&
                    <div className="py-14">
                        <p className="text-4xl text-center">🏆</p>
                        <h2 className="text-4xl mb-4 text-center">Victory</h2>
                        <p className="pb-6 text-center">{points ?? 0} points {(lastHS ?? 0) < (points ?? 0) && <>
                            <br /> <span className="text-yellow-400">NEW RECORD</span>
                        </>}</p>

                        <p>Ready for the next one?</p>
                        <button className="flex items-center gap-4 mx-auto w-max px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md my-6"
                            onClick={startNewGame}>
                            <img src="/fist.svg" className="h-8" />
                            <p className="text-xl">New Game</p>
                        </button>
                    </div>}
            </div>

        </div>
    );
}