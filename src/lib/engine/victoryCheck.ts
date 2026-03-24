import type { Stack, Player, BattleSummary } from '../types';
import { isAlive } from '../types';

export function checkVictory(p1Stacks: Stack[], p2Stacks: Stack[]): string | null {
  const p1Alive = p1Stacks.filter(isAlive).length;
  const p2Alive = p2Stacks.filter(isAlive).length;

  if (p1Alive === 0 && p2Alive === 0) return 'player1';
  if (p1Alive === 0) return 'player2';
  if (p2Alive === 0) return 'player1';
  return null;
}

export function buildBattleSummary(
  winner: Player,
  loser: Player,
  totalRounds: number,
  totalDamageDealt: { player1: number; player2: number },
  totalCreaturesKilled: { player1: number; player2: number }
): BattleSummary {
  const allStacks = [...winner.stacks, ...loser.stacks];
  const survivingStacks = allStacks
    .filter(isAlive)
    .map((s) => ({
      unitType: s.unitType,
      remainingCreatures: s.creatureCount,
      remainingHp: s.currentHp,
    }));

  return {
    winner,
    loser,
    totalRounds,
    survivingStacks,
    totalDamageDealt,
    totalCreaturesKilled,
  };
}
