import { describe, it, expect } from 'vitest';
import { checkVictory } from '../../src/lib/engine/victoryCheck';
import { UNIT_PIKEMAN, PLAYER_1, PLAYER_2, createStack } from '../fixtures';

describe('Victory Check', () => {
  describe('[RULE-07] Victory Condition', () => {
    it('returns player2 as winner when all player1 stacks are dead', () => {
      const p1Stacks = [
        createStack(UNIT_PIKEMAN, PLAYER_1, 0, { col: 0, row: 1 }),
        createStack(UNIT_PIKEMAN, PLAYER_1, 0, { col: 0, row: 5 }),
        createStack(UNIT_PIKEMAN, PLAYER_1, 0, { col: 0, row: 9 }),
      ];
      const p2Stacks = [
        createStack(UNIT_PIKEMAN, PLAYER_2, 3, { col: 14, row: 5 }),
      ];
      const result = checkVictory(p1Stacks, p2Stacks);
      expect(result).toBe('player2');
    });

    it('returns player1 as winner when all player2 stacks are dead', () => {
      const p1Stacks = [
        createStack(UNIT_PIKEMAN, PLAYER_1, 3, { col: 0, row: 1 }),
      ];
      const p2Stacks = [
        createStack(UNIT_PIKEMAN, PLAYER_2, 0, { col: 14, row: 1 }),
        createStack(UNIT_PIKEMAN, PLAYER_2, 0, { col: 14, row: 5 }),
        createStack(UNIT_PIKEMAN, PLAYER_2, 0, { col: 14, row: 9 }),
      ];
      const result = checkVictory(p1Stacks, p2Stacks);
      expect(result).toBe('player1');
    });

    it('returns null when both sides have living stacks', () => {
      const p1Stacks = [createStack(UNIT_PIKEMAN, PLAYER_1, 5, { col: 0, row: 1 })];
      const p2Stacks = [createStack(UNIT_PIKEMAN, PLAYER_2, 3, { col: 14, row: 1 })];
      const result = checkVictory(p1Stacks, p2Stacks);
      expect(result).toBeNull();
    });
  });
});
