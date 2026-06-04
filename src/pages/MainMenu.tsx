import { useGameState, usePage } from "../App";
import { DeckOfCardsAPI, type ShuffleResponse } from "../lib/deckofcards";
import { loadFromLS, saveToLS } from "../lib/localstorage";
import Game from "./GameWrapper";

export default function MainMenu(){
    const lStoreContent = localStorage.getItem("savedgame");
    const continueDisabled = lStoreContent === null;


    const pagehook = usePage();
    const GStateHook = useGameState();
    const startNewGame = async () => {
        // init game and save into localstorage
        await DeckOfCardsAPI.newdeck();
        const newGameState = {
            currentRoom: [],
            deck_id: DeckOfCardsAPI.deck_id!,
            healCooldown: 0,
            health: 20,
            skipCooldown: 0,
            weapon: null,
        }
        GStateHook.set(newGameState)
        saveToLS(newGameState);

        pagehook.set(<Game />)
    }

    const continueGame = () => {
        // load game from save from localstorage
        const gamestate = loadFromLS();
        GStateHook.set(gamestate);
        DeckOfCardsAPI.deck_id = gamestate.deck_id;

        pagehook.set(<Game />)
    }

    return <div className="mx-auto py-[5%] w-10/12">
        <h1 className="text-center text-4xl">Scoundrel</h1>
        
        <div className="w-[min(90vw,300px)] flex items-center justify-between mx-auto my-20 flex-wrap">
            <button onClick={startNewGame}
            className="group p-3 bg-gray-700 min-w-32 rounded-md cursor-pointer relative hover:scale-105 duration-200 hover:bg-gray-900 hover:shadow-xl shadow-black">
                <span>New Game</span>
                <span className="absolute left-1/2 -top-3 bg-gray-700 -translate-x-1/2 px-2 rounded-full group-hover:bg-gray-900 duration-200">+</span>
            </button>
            
            <button onClick={continueGame} className="group p-3 bg-gray-700 min-w-32 rounded-md cursor-pointer relative hover:scale-105 duration-200 hover:bg-gray-900 hover:shadow-xl shadow-black disabled:hover:bg-gray-700 disabled:hover:scale-100 disabled:cursor-default  disabled:opacity-60" disabled={continueDisabled}>
                <span>Continue</span>
                <span className="absolute left-1/2 -top-3 bg-gray-700 -translate-x-1/2 px-2 rounded-full group-hover:bg-gray-900 duration-200 group-hover:group-disabled:bg-gray-700">&rarr;</span>
            </button>
        </div>
    </div>
}