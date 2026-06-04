import type { CardCode, Weapon } from "../../types/types";
import PlayingCard from "../PlayingCard/PlayingCard";

export default function WeaponDisplay({ weapon }: { weapon: Weapon | null }) {
    if (!weapon) return <div className="bg-black/50 shadow-lg shadow-black h-[200px] w-36 mx-auto flex items-center justify-center">
        <img src="/fist.svg" width={50} />
    </div>;

    return <div className="bg-black/50 shadow-lg shadow-black h-[200px] w-36 mx-auto flex items-center justify-center">
        <PlayingCard interactable={false} cardCode={`${8}D` as CardCode} />
    </div>
}