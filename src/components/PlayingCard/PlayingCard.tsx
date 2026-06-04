import type { CSSProperties } from "react";
import type { CardCode } from "../../types/types";

export default function PlayingCard({ cardCode, interactable, onClick, topStyle }: { cardCode: CardCode|null, interactable: boolean, onClick?: (code: CardCode|null)=>{}, topStyle?: CSSProperties }) {
    const svgURL = cardCode ? `https://deckofcardsapi.com/static/img/${cardCode}.png` : 'https://deckofcardsapi.com/static/img/back.png';
    const interactableClassNames = `
    cursor-pointer
    group-hover:animate-hovercard
    group-hover:scale-105
    group-hover:-translate-y-2
    group-hover:shadow-xl
    group-hover:shadow-black
    `;
    return (
        <div className={`group w-32`} onClick={()=>{onClick?.(cardCode)}} style={topStyle}>
            <img src={svgURL} className={`${interactable ? interactableClassNames : ''} duration-300`}/>
        </div>
    )
}