import { describe, it, expect } from 'vitest';
import {
  offsetToCube,
  cubeToOffset,
  hexDistance,
  getHexNeighbors,
  coordToKey,
  keyToCoord,
  coordsEqual,
  areNeighbors,
} from '../../src/lib/utils/hexUtils';

describe('Hex Utilities', () => {
  describe('offsetToCube / cubeToOffset', () => {
    it('roundtrips correctly', () => {
      const original = { col: 5, row: 3 };
      const cube = offsetToCube(original);
      const result = cubeToOffset(cube);
      expect(result).toEqual(original);
    });

    it('roundtrips for even row', () => {
      const original = { col: 0, row: 4 };
      const cube = offsetToCube(original);
      const result = cubeToOffset(cube);
      expect(result).toEqual(original);
    });
  });

  describe('hexDistance', () => {
    it('returns 0 for same hex', () => {
      expect(hexDistance({ col: 5, row: 5 }, { col: 5, row: 5 })).toBe(0);
    });

    it('calculates distance correctly', () => {
      expect(hexDistance({ col: 0, row: 0 }, { col: 3, row: 0 })).toBe(3);
    });
  });

  describe('getHexNeighbors', () => {
    it('returns 6 neighbors for center hex on even row', () => {
      const neighbors = getHexNeighbors({ col: 4, row: 4 });
      expect(neighbors.length).toBe(6);
    });

    it('returns 6 neighbors for center hex on odd row', () => {
      const neighbors = getHexNeighbors({ col: 5, row: 5 });
      expect(neighbors.length).toBe(6);
    });

    it('returns fewer neighbors at grid edge', () => {
      const neighbors = getHexNeighbors({ col: 0, row: 0 });
      expect(neighbors.length).toBeLessThan(6);
      expect(neighbors.length).toBeGreaterThan(0);
    });

    it('all neighbors are in bounds', () => {
      const neighbors = getHexNeighbors({ col: 0, row: 0 });
      for (const n of neighbors) {
        expect(n.col).toBeGreaterThanOrEqual(0);
        expect(n.col).toBeLessThan(15);
        expect(n.row).toBeGreaterThanOrEqual(0);
        expect(n.row).toBeLessThan(11);
      }
    });
  });

  describe('coordToKey / keyToCoord', () => {
    it('converts coord to key string', () => {
      expect(coordToKey({ col: 5, row: 3 })).toBe('5,3');
    });

    it('converts key back to coord', () => {
      expect(keyToCoord('5,3')).toEqual({ col: 5, row: 3 });
    });
  });

  describe('coordsEqual', () => {
    it('returns true for equal coords', () => {
      expect(coordsEqual({ col: 5, row: 3 }, { col: 5, row: 3 })).toBe(true);
    });

    it('returns false for different coords', () => {
      expect(coordsEqual({ col: 5, row: 3 }, { col: 5, row: 4 })).toBe(false);
    });
  });

  describe('areNeighbors', () => {
    it('returns true for adjacent hexes', () => {
      expect(areNeighbors({ col: 5, row: 5 }, { col: 6, row: 5 })).toBe(true);
    });

    it('returns false for non-adjacent hexes', () => {
      expect(areNeighbors({ col: 0, row: 0 }, { col: 10, row: 10 })).toBe(false);
    });
  });
});
