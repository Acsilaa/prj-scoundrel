import { useEffect, useRef, useState, type JSX } from "react";
import { useGameState } from "../../App";
import PlayingCard from "../PlayingCard/PlayingCard";
import Talon from "../PlayingCard/Talon";
import type { CardCode } from "../../types/types";

export default function GamePlayer() {
    const talonRef = useRef<HTMLDivElement>(null);
    const slot1Ref = useRef<HTMLDivElement>(null);
    const slot2Ref = useRef<HTMLDivElement>(null);
    const slot3Ref = useRef<HTMLDivElement>(null);
    const slot4Ref = useRef<HTMLDivElement>(null);
    const [slot1Card, setSlot1Card] = useState<JSX.Element|null>(null);
    const [slot2Card, setSlot2Card] = useState<JSX.Element|null>(null);
    const [slot3Card, setSlot3Card] = useState<JSX.Element|null>(null);
    const [slot4Card, setSlot4Card] = useState<JSX.Element|null>(null);
    const gamestate = useGameState();


    return <>
        <h1 className="text-center text-4xl mb-20">Scoundrel</h1>
        <div className="w-8/12 mx-auto flex items-center justify-between">
            <Talon remaining={5} max={5} ref={talonRef} />
            <div className="flex items-center justify-center w-[700px]">
                <div className="bg-black/50 shadow-lg shadow-black h-[200px] w-36 mr-auto" ref={slot1Ref}>
                    {slot1Card}
                </div>
                <div className="bg-black/50 shadow-lg shadow-black h-[200px] w-36 mx-auto" ref={slot2Ref}>
                    {slot2Card}
                </div>
                <div className="bg-black/50 shadow-lg shadow-black h-[200px] w-36 mx-auto" ref={slot3Ref}>
                    {slot3Card}
                </div>
                <div className="bg-black/50 shadow-lg shadow-black h-[200px] w-36 ml-auto" ref={slot4Ref}>
                    {slot4Card}
                </div>
            </div>
        </div>
    </>


}