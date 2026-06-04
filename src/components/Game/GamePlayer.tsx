import PlayingCard from "../PlayingCard/PlayingCard";
import Talon from "../PlayingCard/Talon";

export default function GamePlayer() {
    return <>
        <h1 className="text-center text-4xl">Scoundrel</h1>

        <div className="bg-black">
            <Talon remaining={5} max={5} />
        </div>
    </>


}