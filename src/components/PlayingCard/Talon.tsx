import PlayingCard from "./PlayingCard";

export default function Talon ({max, remaining}:{max:number, remaining:number}) {
    const toDisplay = Math.min(max, remaining);

    return <div className="flex items-start justify-start relative">
        {Array.from({length: toDisplay}).map(((_,i) => 
            <PlayingCard interactable={i == max-1} cardCode={null} topStyle={{
                position: "absolute",
                left: `${i*3}px`,
                top: `-${i}px`
            }} /> 
        ))}
    </div>
}