import type { CardCode } from "../types/types";

export function codeToNumber (code: CardCode):number {
    const digit = code[0]
    const parsed = Number(digit)
    if(!Number.isNaN(parsed)){
        if(parsed == 0) return 10;
        return parsed;
    }
    switch(digit){
        case 'J': return 11;
        case 'Q': return 12;
        case 'K': return 13;
        case 'A': return 14;
    }
    return -1;
}

export function numberToLetter (num: number): string {
    if(num == 10) return '0';
    if(num == 11) return 'J';
    if(num == 12) return 'Q';
    if(num == 13) return 'K';
    if(num == 14) return 'A';
    return String(num);
}