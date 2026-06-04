import type { CardCode, Weapon } from "../../types/types";
import PlayingCard from "../PlayingCard/PlayingCard";

export default function WeaponDisplay({ weapon }: { weapon: Weapon | null }) {
    weapon = {limit: 8, limitSuite: "C", strength: 9};
    if (!weapon) return <div className="bg-black/50 shadow-lg shadow-black h-[200px] w-36 mx-auto flex items-center justify-center">
        <img src="/fist.svg" width={50} />
    </div>;

    return <div className="bg-black/50 shadow-lg shadow-black h-[200px] w-36 mx-auto flex items-center justify-center relative">
        <PlayingCard interactable={false} cardCode={`${weapon.strength}D` as CardCode} />
        {weapon.limit !== null ? 
        <PlayingCard interactable={false} cardCode={`${weapon.limit}${weapon.limitSuite}` as CardCode} className="absolute left-20 top-1/3 -translate-x-1/2" />
         : null}
    </div>
}