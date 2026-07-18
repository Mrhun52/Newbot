import { create } from 'zustand';

export type RiskLevel = 'low' | 'medium' | 'high';

interface RiskState {
  level: RiskLevel;
  score: number; // 0-100
  message: string;
  setRisk: (score: number, message: string) => void;
  resetRisk: () => void;
}

export const useRisk = create<RiskState>((set) => ({
  level: 'low',
  score: 5,
  message: 'Account operations are currently within safe limits.',
  setRisk: (score, message) => {
    let level: RiskLevel = 'low';
    if (score >= 75) level = 'high';
    else if (score >= 40) level = 'medium';
    set({ score, message, level });
  },
  resetRisk: () => set({ level: 'low', score: 5, message: 'Account operations are currently within safe limits.' })
}));
