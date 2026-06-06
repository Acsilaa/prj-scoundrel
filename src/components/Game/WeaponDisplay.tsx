import { numberToLetter } from "../../lib/converter";
import type { CardCode, Weapon } from "../../types/types";
import PlayingCard from "../PlayingCard/PlayingCard";

export default function WeaponDisplay({ weapon, onClick, attackMode }: { weapon: Weapon | null, onClick: () => void, attackMode: "Hands" | "Weapon" }) {
    if (!weapon) return <div className="bg-black/50 shadow-lg shadow-black h-[200px] w-36 mx-auto flex items-center rounded-md  justify-center">
        <img src="/fist.svg" width={50} />
    </div>;

    return <div className="bg-black/50 cursor-pointer shadow-lg shadow-black h-[200px] w-36 mx-auto flex items-center rounded-md  justify-center relative" onClick={onClick}>
        <PlayingCard interactable={false} cardCode={`${numberToLetter(weapon.strength)}D` as CardCode} className="" />
        {weapon.limit !== null ? 
        <PlayingCard interactable={false} cardCode={`${numberToLetter(weapon.limit)}${weapon.limitSuite}` as CardCode} className="absolute left-6 top-5" />
         : null}
        {attackMode == "Hands" && <div className="absolute w-full h-full origin-center scale-125 rounded-md flex items-center justify-center top-0 left-0 bg-black/30 backdrop-blur-[2px]">
            <img src="/fist.svg" width={50} className="scale-90" />
        </div> }
    </div>
}