import PlayingCard from "../PlayingCard/PlayingCard";

export default function GamePlayer() {
    return <>
        <h1 className="text-center text-4xl">Scoundrel</h1>

        <div className="bg-black">
            <PlayingCard cardCode={null} interactable={false}/>
        </div>
    </>


}