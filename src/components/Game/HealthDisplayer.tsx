import { numberToLetter } from "../../lib/converter";
import type { CardCode } from "../../types/types";
import PlayingCard from "../PlayingCard/PlayingCard";

export default function HealthDisplayer ({health}:{health: number|undefined}){
    if(health === undefined) return null;
    if(health == 1) return <div className="h-[200px] w-36 bg-black/50 shadow-lg shadow-black relative flex items-center justify-center">
        <PlayingCard interactable={false} cardCode={`X2` as CardCode} />
    </div>

    if(health == 0) return <div className="h-[200px] w-36 bg-black/50 shadow-lg shadow-black relative flex items-center justify-center">
        <PlayingCard interactable={false} cardCode={`X1` as CardCode} />
    </div>

    return <div className="h-[200px] w-36 bg-black/50 shadow-lg shadow-black relative flex items-center justify-center">
        <PlayingCard interactable={false} cardCode={`${numberToLetter(Math.min(health,(health > 14 ? 13 : 14)))}H` as CardCode} />
        {health > 14 && 
            <PlayingCard interactable={false} cardCode={`${numberToLetter(health-13)}H` as CardCode} className="absolute left-[calc(50%+16px)] top-[calc(50%+8px)] -translate-x-1/2 -translate-y-1/2" />
        }
    </div>
}