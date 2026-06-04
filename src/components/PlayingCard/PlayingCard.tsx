import { forwardRef } from "react";
import type { CSSProperties } from "react";
import type { CardCode } from "../../types/types";

type PlayingCardProps = {
    cardCode: CardCode | null;
    interactable: boolean;
    onClick?: (code: CardCode | null) => void;
    topStyle?: CSSProperties;
    className?: string;
};

const PlayingCard = forwardRef<HTMLDivElement, PlayingCardProps>(
    ({ cardCode, interactable, onClick, topStyle, className }, ref) => {
        const svgURL = cardCode
            ? `https://deckofcardsapi.com/static/img/${cardCode}.png`
            : "https://deckofcardsapi.com/static/img/back.png";

        const interactableClassNames = `
            cursor-pointer
            group-hover:animate-hovercard
            group-hover:scale-105
            group-hover:-translate-y-2
            group-hover:shadow-xl
            group-hover:shadow-black
        `;

        return (
            <div
                ref={ref}
                className={`group w-32 ${className}`}
                onClick={() => onClick?.(cardCode)}
                style={topStyle}
            >
                <img
                    src={svgURL}
                    className={`${interactable ? interactableClassNames : ""} duration-300`}
                />
            </div>
        );
    }
);

PlayingCard.displayName = "PlayingCard";

export default PlayingCard;