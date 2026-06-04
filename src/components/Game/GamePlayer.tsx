import { useEffect, useRef, useState, type JSX } from "react";
import { useGameState } from "../../App";
import PlayingCard from "../PlayingCard/PlayingCard";
import Talon from "../PlayingCard/Talon";

export default function GamePlayer() {
    const talonRef = useRef<HTMLDivElement>(null);
    const slot1Ref = useRef<HTMLDivElement>(null);
    const slot2Ref = useRef<HTMLDivElement>(null);
    const slot3Ref = useRef<HTMLDivElement>(null);
    const slot4Ref = useRef<HTMLDivElement>(null);
    const gamestate = useGameState();

    const [floatingCard, setFloatingCard] = useState<JSX.Element|null>(null);

    const tryDrawCard = async () => {
        const body = document.body;
        const talonRect = [talonRef.current?.offsetLeft, talonRef.current?.offsetTop];
        setFloatingCard(<PlayingCard cardCode={null} interactable={false} className="fixed" topStyle={{
            top: `${talonRect[1]}px`,
            left: `${talonRect[0]}px`,
        }} />)
    }

    return <>
        <h1 className="text-center text-4xl mb-20">Scoundrel</h1>
        <div className="w-8/12 mx-auto flex items-center justify-between">
            <Talon remaining={5} max={5} onClick={tryDrawCard} ref={talonRef} />
            <div className="flex items-center justify-center w-[700px]">
                <div className="bg-black/50 shadow-lg shadow-black h-[200px] w-36 mr-auto" ref={slot1Ref}></div>
                <div className="bg-black/50 shadow-lg shadow-black h-[200px] w-36 mx-auto" ref={slot2Ref}></div>
                <div className="bg-black/50 shadow-lg shadow-black h-[200px] w-36 mx-auto" ref={slot3Ref}></div>
                <div className="bg-black/50 shadow-lg shadow-black h-[200px] w-36 ml-auto" ref={slot4Ref}></div>
            </div>
            {floatingCard}
        </div>
    </>


}