import { useGameState, usePage } from "../App";
import { loadFromLS, saveToLS } from "../lib/localstorage";
import Game from "./GameWrapper";
import { useDeckOfCards } from "../lib/deckofcards"; // 👈 zustand store

export default function MainMenu() {
    const lStoreContent = localStorage.getItem("savedgame");
    const continueDisabled = lStoreContent === null;

    const pagehook = usePage();
    const GStateHook = useGameState();

    const newDeck = useDeckOfCards((s) => s.newDeck);
    const setDeckId = useDeckOfCards((s) => s.deckId); // read current id if needed

    const startNewGame = async () => {
        // init deck via zustand store
        await newDeck();

        const deckId = useDeckOfCards.getState().deckId;

        const newGameState = {
            currentRoom: [null, null, null, null],
            deck_id: deckId!,
            healCooldown: 0,
            health: 20,
            skipCooldown: 0,
            weapon: null,
        };

        GStateHook.set(newGameState);
        saveToLS(newGameState);

        pagehook.set(<Game />);
    };

    const continueGame = () => {
        const gamestate = loadFromLS();

        GStateHook.set(gamestate);

        // restore deck into zustand store
        useDeckOfCards.setState({
            deckId: gamestate.deck_id,
            remaining: 52, // or keep saved value if you store it later
        });

        pagehook.set(<Game />);
    };

    return (
        <div className="mx-auto py-[5%] w-10/12">
            <h1 className="text-center text-4xl">Scoundrel</h1>

            <div className="w-[min(90vw,300px)] flex items-center justify-between mx-auto my-20 flex-wrap">
                <button
                    onClick={startNewGame}
                    className="group p-3 bg-gray-700 min-w-32 rounded-md cursor-pointer relative hover:scale-105 duration-200 hover:bg-gray-900 hover:shadow-xl shadow-black"
                >
                    <span>New Game</span>
                    <span className="absolute left-1/2 -top-3 bg-gray-700 -translate-x-1/2 px-2 rounded-full group-hover:bg-gray-900 duration-200">
                        +
                    </span>
                </button>

                <button
                    onClick={continueGame}
                    className="group p-3 bg-gray-700 min-w-32 rounded-md cursor-pointer relative hover:scale-105 duration-200 hover:bg-gray-900 hover:shadow-xl shadow-black disabled:hover:bg-gray-700 disabled:hover:scale-100 disabled:cursor-default disabled:opacity-60"
                    disabled={continueDisabled}
                >
                    <span>Continue</span>
                    <span className="absolute left-1/2 -top-3 bg-gray-700 -translate-x-1/2 px-2 rounded-full group-hover:bg-gray-900 duration-200 group-hover:group-disabled:bg-gray-700">
                        →
                    </span>
                </button>
            </div>
        </div>
    );
}