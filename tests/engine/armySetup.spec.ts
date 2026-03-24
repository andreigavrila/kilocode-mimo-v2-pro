import { describe, it, expect } from 'vitest';
import { validateArmy, getDefaultArmy, createStackFromSelection } from '../../src/lib/engine/armySetup';
import { UNIT_ROSTER } from '../../src/lib/data/units';
import { PlayerSide } from '../../src/lib/types';

const TEST_PLAYER = {
  id: 'player1', name: 'Player 1', color: '#3B82F6', stacks: [], side: PlayerSide.LEFT,
};

describe('Army Setup', () => {
  describe('[RULE-11] Army Setup Validation', () => {
    it('requires exactly 3 stacks', () => {
      expect(validateArmy({
        slots: [
          { unitType: UNIT_ROSTER[0], creatureCount: 10 },
          { unitType: UNIT_ROSTER[1], creatureCount: 5 },
          { unitType: null, creatureCount: 1 },
        ],
        isReady: false,
      })).toBe(false);
    });

    it('requires positive creature count', () => {
      expect(validateArmy({
        slots: [
          { unitType: UNIT_ROSTER[0], creatureCount: 0 },
          { unitType: UNIT_ROSTER[1], creatureCount: 5 },
          { unitType: UNIT_ROSTER[2], creatureCount: 3 },
        ],
        isReady: false,
      })).toBe(false);
    });

    it('caps count at 99', () => {
      const result = validateArmy({
        slots: [
          { unitType: UNIT_ROSTER[0], creatureCount: 100 },
          { unitType: UNIT_ROSTER[1], creatureCount: 5 },
          { unitType: UNIT_ROSTER[2], creatureCount: 3 },
        ],
        isReady: false,
      });
      expect(result).toBe(false);
    });

    it('allows duplicate unit types', () => {
      expect(validateArmy({
        slots: [
          { unitType: UNIT_ROSTER[0], creatureCount: 10 },
          { unitType: UNIT_ROSTER[0], creatureCount: 10 },
          { unitType: UNIT_ROSTER[0], creatureCount: 10 },
        ],
        isReady: false,
      })).toBe(true);
    });

    it('valid army passes', () => {
      expect(validateArmy({
        slots: [
          { unitType: UNIT_ROSTER[0], creatureCount: 10 },
          { unitType: UNIT_ROSTER[1], creatureCount: 8 },
          { unitType: UNIT_ROSTER[2], creatureCount: 5 },
        ],
        isReady: false,
      })).toBe(true);
    });

    it('getDefaultArmy returns valid army', () => {
      const army = getDefaultArmy(TEST_PLAYER);
      expect(army.length).toBe(3);
      for (const stack of army) {
        expect(stack.creatureCount).toBeGreaterThan(0);
        expect(stack.owner.id).toBe('player1');
      }
    });

    it('createStackFromSelection creates valid stack', () => {
      const stack = createStackFromSelection(
        { unitType: UNIT_ROSTER[0], creatureCount: 10 },
        TEST_PLAYER,
        { col: 0, row: 1 }
      );
      expect(stack.creatureCount).toBe(10);
      expect(stack.currentHp).toBe(UNIT_ROSTER[0].hp);
      expect(stack.position).toEqual({ col: 0, row: 1 });
    });
  });
});
