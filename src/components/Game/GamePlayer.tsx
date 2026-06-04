import { useEffect, useRef, useState, type JSX } from "react";
import { useGameState } from "../../App";
import PlayingCard from "../PlayingCard/PlayingCard";
import Talon from "../PlayingCard/Talon";
import type { CardCode } from "../../types/types";
import { useDeckOfCards } from "../../lib/deckofcards";
import WeaponDisplay from "./WeaponDisplay";

export default function GamePlayer() {
    const talonRef = useRef<HTMLDivElement>(null);
    const slot1Ref = useRef<HTMLDivElement>(null);
    const slot2Ref = useRef<HTMLDivElement>(null);
    const slot3Ref = useRef<HTMLDivElement>(null);
    const slot4Ref = useRef<HTMLDivElement>(null);
    const gamestate = useGameState();
    const [slotCards, setCards] = useState<(CardCode|null)[]>(gamestate.gamestate!.currentRoom);
    const [canInteract, setCanInteract] = useState(false);
    const DOC = useDeckOfCards();

    useEffect(()=>{
        const init = async () => {

                //draw to 4 then set canInteract to true
                let toDraw = 0;
                for(let i = 0; i < 4; i++){
                    if(slotCards[i] === null) toDraw++;
                }
                const drawn: CardCode[] = (await DOC.draw(toDraw)).map(c => c.code);
                
                let appended = 0;
                const newOrder = [...slotCards];
                for(let i = 0; i < 4; i++){
                    if(newOrder[i] == null){
                        newOrder[i] = drawn[appended];
                        appended++;
                    }
                }
                setCards([...newOrder]);
                setCanInteract(true);
                return;
        }
        init();
    }, [])

    useEffect(()=>{

    }, [gamestate.gamestate!.currentRoom])

    return <>
        <h1 className="text-center text-4xl mb-20">Scoundrel</h1>
        <div className="w-8/12 mx-auto flex items-center justify-between">
            <div className="group relative">
                <Talon remaining={gamestate.gamestate!.remaining} max={5} ref={talonRef} />
                <span className={`hidden absolute group-hover:block top-full left-1/2 -translate-x-1/2 translate-y-2 ${gamestate.gamestate!.skipCooldown != 0 ? 'text-red-800':''}`}>Skip</span>
            </div>
            <div className="flex items-center justify-center w-[700px]">
                <div className="bg-black/50 shadow-lg shadow-black h-[200px] w-36 mr-auto flex items-center justify-center" ref={slot1Ref}>
                    {slotCards[0] ? <PlayingCard interactable cardCode={slotCards[0]} onClick={()=>{console.log(slotCards[0])}} /> : null}
                </div>
                <div className="bg-black/50 shadow-lg shadow-black h-[200px] w-36 mx-auto flex items-center justify-center" ref={slot2Ref}>
                    {slotCards[1] ? <PlayingCard interactable cardCode={slotCards[1]} onClick={()=>{console.log(slotCards[1])}} /> : null}
                </div>
                <div className="bg-black/50 shadow-lg shadow-black h-[200px] w-36 mx-auto flex items-center justify-center" ref={slot3Ref}>
                    {slotCards[2] ? <PlayingCard interactable cardCode={slotCards[2]} onClick={()=>{console.log(slotCards[2])}} /> : null}
                </div>
                <div className="bg-black/50 shadow-lg shadow-black h-[200px] w-36 ml-auto flex items-center justify-center" ref={slot4Ref}>
                    {slotCards[3] ? <PlayingCard interactable cardCode={slotCards[3]} onClick={()=>{console.log(slotCards[3])}} /> : null}
                </div>
            </div>
        </div>
        <div className="w-8/12 grid [grid-template-areas:'a_a_b_b_c_c'_'a_a_b_b_c_c'] mx-auto content-center place-items-center mt-32">
            <div style={{gridArea:'a'}}>
                <span>{gamestate.gamestate!.health}</span>
            </div>
            <div style={{gridArea:'b'}}>
                <WeaponDisplay weapon={gamestate.gamestate!.weapon} />
            </div>
            <div style={{gridArea:'c'}}>
                discarded?
            </div>
        </div>
    </>


}