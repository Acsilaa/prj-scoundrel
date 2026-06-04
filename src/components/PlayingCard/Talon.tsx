import { forwardRef } from "react";
import PlayingCard from "./PlayingCard";

type TalonProps = {
    max: number;
    remaining: number;
    onClick?: () => void;
};

const Talon = forwardRef<HTMLDivElement, TalonProps>(
    ({ max, remaining, onClick }, ref) => {
        const toDisplay = Math.min(max, remaining);

        return (
            <div
                className="flex items-start justify-start relative h-[178px] w-32"
                ref={ref}
                onClick={onClick}
            >
                {Array.from({ length: toDisplay }).map((_, i) => (
                    <PlayingCard
                        key={i}
                        interactable={i === toDisplay - 1}
                        cardCode={null}
                        topStyle={{
                            position: "absolute",
                            left: `${i * 3}px`,
                            top: `-${i}px`,
                        }}
                    />
                ))}
            </div>
        );
    }
);

Talon.displayName = "Talon";

export default Talon;