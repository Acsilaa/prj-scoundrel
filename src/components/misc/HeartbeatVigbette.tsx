import { useEffect, useState } from "react";
import vigStyle from "./helperstyles.module.css";
export default function HeartbeatVignette({ health }: { health: number }) {
    const [healthState, setHealthState] = useState<"Normal" | "Dire" | "Critical">("Normal");
    useEffect(() => {
        setHealthState(health > 5 ? "Normal" : health <= 1 ? "Critical" : "Dire");
    }, [health])
    
    const settings = {
        Normal: {
            opacity: 0,
            intensity: 0,
            scale: 1,
            heartbeat: "3s",
        },

        Dire: {
            opacity: 1,
            intensity: 0.6,
            scale: 1.4,
            heartbeat: "1s",
        },

        Critical: {
            opacity: 1,
            intensity: 0.9,
            scale: 1.4,
            heartbeat: "0.75s",
        },
    }[healthState];
    return <div
        className={vigStyle.vignette}
        style={{
            "--o": settings.opacity,
            "--i": settings.intensity,
            "--s": settings.scale,
            "--h": settings.heartbeat,
        } as any}
    />
}