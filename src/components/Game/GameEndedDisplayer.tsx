import { useEffect, useState } from "react";

export default function GameEndDisplayer ({gameEnded}:{gameEnded:"victory"|"defeat"|null}) {
    const [delayStarted, setDelayStarted] = useState(false);
    useEffect(()=>{
        if(!delayStarted && gameEnded !== null){

            setDelayStarted(true);
        }
    },[gameEnded])


    if(gameEnded === null) return null;
    return <div className="z-50 fixed left-0 top-0 w-screen h-full bg-black/60 backdrop-blur-sm flex  items-center justify-center">
        <div className="size-32 rounded-md bg-gray-700">

        </div>
    </div>
    
}