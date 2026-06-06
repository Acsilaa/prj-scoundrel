import { codeToNumber } from "../lib/converter";
import type { GameState } from "../lib/localstorage";
import type { CardCode, Weapon } from "../types/types";

export const processCardFight = (card: CardCode, gamestate: GameState, attackMode: "Weapon"|"Hands"): { weapon: Weapon | null, healCooldown: number, health: number } => {
        if (['C', 'S'].includes(card[1])) { // battle
            const gs = gamestate;
            let reduction = gs.weapon !== null && attackMode == "Weapon" ?
                (gs.weapon.limit !== null ?
                    (gs.weapon.limit > codeToNumber(card) ?
                        Math.min(codeToNumber(card), gs.weapon.strength) : 0) :
                    Math.min(codeToNumber(card), gs.weapon.strength))
                : 0;
            reduction = Math.max(0, reduction);
            const newHP = Math.max(gamestate.health - ((codeToNumber(card)) - reduction), 0);
            let newWeapon: Weapon | null;
            if (attackMode == "Weapon") {
                newWeapon = gamestate.weapon !== null ? {
                    ...gamestate.weapon,
                    limitSuite: card[1],
                    limit: Math.min((gamestate.weapon.limit ?? 14), codeToNumber(card)),
                } : null;
            } else {
                newWeapon = gamestate.weapon;
            }

            return {
                weapon: (newWeapon !== null && newWeapon.limit != 2 ? newWeapon : null),
                healCooldown: gamestate.healCooldown, //heal cd stays the same
                health: newHP,
            }
        }
        if (card[1] == "D") { // weapon
            return {
                weapon: {
                    limit: null,
                    limitSuite: null,
                    strength: codeToNumber(card),
                },
                healCooldown: gamestate.healCooldown, //heal cd stays the same
                health: gamestate.health,
            }
        }
        // heal
        const canHeal = gamestate.healCooldown == 0;
        const newHP = Math.min(gamestate.health + (canHeal ? codeToNumber(card) : 0), 20);

        return {
            weapon: gamestate.weapon,
            healCooldown: 1,
            health: newHP,
        }

    }