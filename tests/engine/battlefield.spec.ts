import { describe, it, expect } from 'vitest';
import {
  generateObstacles,
  deployStacks,
  createEmptyBattlefield,
} from '../../src/lib/engine/battlefieldGenerator';
import { findPath } from '../../src/lib/engine/pathfinding';
import { createStack, UNIT_PIKEMAN, PLAYER_1, PLAYER_2 } from '../fixtures';
import { PlayerSide } from '../../src/lib/types';

describe('Battlefield Generator', () => {
  describe('[RULE-12] Obstacle Generation', () => {
    it('generates correct obstacle count', () => {
      const bf = createEmptyBattlefield();
      generateObstacles(bf);
      expect(bf.obstacles.length).toBeGreaterThanOrEqual(6);
      expect(bf.obstacles.length).toBeLessThanOrEqual(12);
    });

    it('no obstacles in deploy zones', () => {
      const bf = createEmptyBattlefield();
      generateObstacles(bf);
      for (const obs of bf.obstacles) {
        expect(obs.col).not.toBe(0);
        expect(obs.col).not.toBe(1);
        expect(obs.col).not.toBe(13);
        expect(obs.col).not.toBe(14);
      }
    });

    it('ensures path connectivity', () => {
      for (let i = 0; i < 10; i++) {
        const bf = createEmptyBattlefield();
        generateObstacles(bf);
        const path = findPath({ col: 0, row: 5 }, { col: 14, row: 5 }, bf);
        expect(path).not.toBeNull();
      }
    });
  });

  describe('[RULE-13] Stack Deployment', () => {
    it('deploys P1 on left column', () => {
      const bf = createEmptyBattlefield();
      const p1 = {
        id: 'player1', name: 'Player 1', color: '#3B82F6',
        stacks: [
          createStack(UNIT_PIKEMAN, { id: 'player1', name: 'Player 1', color: '#3B82F6', stacks: [], side: PlayerSide.LEFT }, 5, { col: 0, row: 1 }),
          createStack(UNIT_PIKEMAN, { id: 'player1', name: 'Player 1', color: '#3B82F6', stacks: [], side: PlayerSide.LEFT }, 5, { col: 0, row: 5 }),
          createStack(UNIT_PIKEMAN, { id: 'player1', name: 'Player 1', color: '#3B82F6', stacks: [], side: PlayerSide.LEFT }, 5, { col: 0, row: 9 }),
        ],
        side: PlayerSide.LEFT,
      };
      const p2 = {
        id: 'player2', name: 'Player 2', color: '#EF4444',
        stacks: [
          createStack(UNIT_PIKEMAN, { id: 'player2', name: 'Player 2', color: '#EF4444', stacks: [], side: PlayerSide.RIGHT }, 5, { col: 14, row: 1 }),
          createStack(UNIT_PIKEMAN, { id: 'player2', name: 'Player 2', color: '#EF4444', stacks: [], side: PlayerSide.RIGHT }, 5, { col: 14, row: 5 }),
          createStack(UNIT_PIKEMAN, { id: 'player2', name: 'Player 2', color: '#EF4444', stacks: [], side: PlayerSide.RIGHT }, 5, { col: 14, row: 9 }),
        ],
        side: PlayerSide.RIGHT,
      };

      deployStacks(p1, p2, bf);
      expect(p1.stacks[0].position.col).toBe(0);
      expect(p1.stacks[1].position.col).toBe(0);
      expect(p1.stacks[2].position.col).toBe(0);
    });

    it('deploys P2 on right column', () => {
      const bf = createEmptyBattlefield();
      const p1 = {
        id: 'player1', name: 'Player 1', color: '#3B82F6',
        stacks: [
          createStack(UNIT_PIKEMAN, { id: 'player1', name: 'Player 1', color: '#3B82F6', stacks: [], side: PlayerSide.LEFT }, 5, { col: 0, row: 1 }),
          createStack(UNIT_PIKEMAN, { id: 'player1', name: 'Player 1', color: '#3B82F6', stacks: [], side: PlayerSide.LEFT }, 5, { col: 0, row: 5 }),
          createStack(UNIT_PIKEMAN, { id: 'player1', name: 'Player 1', color: '#3B82F6', stacks: [], side: PlayerSide.LEFT }, 5, { col: 0, row: 9 }),
        ],
        side: PlayerSide.LEFT,
      };
      const p2 = {
        id: 'player2', name: 'Player 2', color: '#EF4444',
        stacks: [
          createStack(UNIT_PIKEMAN, { id: 'player2', name: 'Player 2', color: '#EF4444', stacks: [], side: PlayerSide.RIGHT }, 5, { col: 14, row: 1 }),
          createStack(UNIT_PIKEMAN, { id: 'player2', name: 'Player 2', color: '#EF4444', stacks: [], side: PlayerSide.RIGHT }, 5, { col: 14, row: 5 }),
          createStack(UNIT_PIKEMAN, { id: 'player2', name: 'Player 2', color: '#EF4444', stacks: [], side: PlayerSide.RIGHT }, 5, { col: 14, row: 9 }),
        ],
        side: PlayerSide.RIGHT,
      };

      deployStacks(p1, p2, bf);
      expect(p2.stacks[0].position.col).toBe(14);
      expect(p2.stacks[1].position.col).toBe(14);
      expect(p2.stacks[2].position.col).toBe(14);
    });
  });
});
