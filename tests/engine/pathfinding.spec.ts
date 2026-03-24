import { describe, it, expect } from 'vitest';
import {
  findPath,
  getReachableHexes,
} from '../../src/lib/engine/pathfinding';
import {
  createEmptyBattlefield,
  createStack,
  UNIT_PIKEMAN,
  PLAYER_1,
} from '../fixtures';

describe('Pathfinding Engine', () => {
  describe('[ALGO-01] A* Hex Pathfinding', () => {
    it('finds shortest path on open grid', () => {
      const bf = createEmptyBattlefield();
      const path = findPath({ col: 0, row: 5 }, { col: 3, row: 5 }, bf);
      expect(path).not.toBeNull();
      expect(path!.length).toBe(4);
    });

    it('routes around obstacles', () => {
      const bf = createEmptyBattlefield();
      bf.hexes[2][5].isObstacle = true;
      const path = findPath({ col: 0, row: 5 }, { col: 4, row: 5 }, bf);
      expect(path).not.toBeNull();
      expect(path!.some(h => h.col === 2 && h.row === 5)).toBe(false);
    });

    it('returns null when no path exists', () => {
      const bf = createEmptyBattlefield();
      for (let r = 0; r < 11; r++) bf.hexes[5][r].isObstacle = true;
      const path = findPath({ col: 0, row: 5 }, { col: 10, row: 5 }, bf);
      expect(path).toBeNull();
    });

    it('handles edge of grid', () => {
      const bf = createEmptyBattlefield();
      const path = findPath({ col: 0, row: 0 }, { col: 0, row: 3 }, bf);
      expect(path).not.toBeNull();
      expect(path!.length).toBe(4);
    });

    it('path includes start and end', () => {
      const bf = createEmptyBattlefield();
      const path = findPath({ col: 0, row: 5 }, { col: 3, row: 5 }, bf);
      expect(path).not.toBeNull();
      expect(path![0]).toEqual({ col: 0, row: 5 });
      expect(path![path!.length - 1]).toEqual({ col: 3, row: 5 });
    });
  });

  describe('[ALGO-03] Reachable Hexes', () => {
    it('returns hexes within speed range', () => {
      const bf = createEmptyBattlefield();
      const stack = createStack(UNIT_PIKEMAN, PLAYER_1, 5, { col: 7, row: 5 });
      bf.hexes[7][5].occupant = stack;
      const reachable = getReachableHexes(stack, bf);
      Object.entries(reachable).forEach(([, dist]) => {
        expect(dist).toBeLessThanOrEqual(4);
      });
    });

    it('excludes occupied hexes', () => {
      const bf = createEmptyBattlefield();
      const stack = createStack(UNIT_PIKEMAN, PLAYER_1, 5, { col: 7, row: 5 });
      const blocker = createStack(UNIT_PIKEMAN, PLAYER_1, 5, { col: 8, row: 5 });
      bf.hexes[7][5].occupant = stack;
      bf.hexes[8][5].occupant = blocker;
      const reachable = getReachableHexes(stack, bf);
      expect(reachable.get('8,5')).toBeUndefined();
    });

    it('excludes obstacle hexes', () => {
      const bf = createEmptyBattlefield();
      const stack = createStack(UNIT_PIKEMAN, PLAYER_1, 5, { col: 7, row: 5 });
      bf.hexes[7][5].occupant = stack;
      bf.hexes[8][5].isObstacle = true;
      const reachable = getReachableHexes(stack, bf);
      expect(reachable.get('8,5')).toBeUndefined();
    });

    it('respects speed limit', () => {
      const bf = createEmptyBattlefield();
      const stack = createStack(UNIT_PIKEMAN, PLAYER_1, 5, { col: 7, row: 5 });
      bf.hexes[7][5].occupant = stack;
      const reachable = getReachableHexes(stack, bf);
      for (const [, dist] of reachable) {
        expect(dist).toBeLessThanOrEqual(stack.unitType.speed);
      }
    });
  });
});
