export enum AppState {
    IDLE = 'IDLE',
    ANALYZING = 'ANALYZING',
    RESULTS = 'RESULTS',
    ERROR = 'ERROR'
}

export interface BattleStats {
    strength: number;      // 0-100
    speed: number;         // 0-100
    defense: number;       // 0-100
    agility: number;       // 0-100
    intelligence: number;  // 0-100
    stamina: number;       // 0-100
}

export interface Combatant {
    name: string;
    description: string;
    stats: BattleStats;
    strengths: string[];
    weaknesses: string[];
}

export interface BattleResult {
    combatant1: Combatant;
    combatant2: Combatant;
    winner: 1 | 2;
    winProbability: number; // 0-100
    scenarios: {
        title: string;
        description: string;
        advantage: 1 | 2;
    }[];
    verdict: string;
}
