import { describe, it, expect } from 'vitest';
import {
  buildTurnOrder,
  advanceTurn,
  handleWait,
  handleDefend,
  resetRound,
} from '../../src/lib/engine/turnManager';
import {
  UNIT_PIKEMAN, UNIT_ARCHER, UNIT_SWORDSMAN,
  PLAYER_1, PLAYER_2, createStack,
} from '../fixtures';

describe('Turn Manager', () => {
  describe('[RULE-01] Initiative Turn Ordering', () => {
    it('sorts stacks by initiative descending', () => {
      const stacks = [
        createStack(UNIT_PIKEMAN, PLAYER_1, 5, { col: 0, row: 1 }),
        createStack(UNIT_SWORDSMAN, PLAYER_2, 3, { col: 14, row: 1 }),
        createStack(UNIT_ARCHER, PLAYER_1, 4, { col: 0, row: 5 }),
      ];
      const queue = buildTurnOrder(stacks);
      expect(queue.entries[0].unitType.initiative).toBe(11);
      expect(queue.entries[1].unitType.initiative).toBe(9);
      expect(queue.entries[2].unitType.initiative).toBe(8);
    });

    it('breaks ties with Player 1 first', () => {
      const p1Stack = createStack({ ...UNIT_PIKEMAN, initiative: 10 }, PLAYER_1, 5, { col: 0, row: 1 });
      const p2Stack = createStack({ ...UNIT_PIKEMAN, initiative: 10 }, PLAYER_2, 5, { col: 14, row: 1 });
      const queue = buildTurnOrder([p2Stack, p1Stack]);
      expect(queue.entries[0].owner.id).toBe('player1');
    });

    it('excludes dead stacks', () => {
      const alive = createStack(UNIT_PIKEMAN, PLAYER_1, 5, { col: 0, row: 1 });
      const dead = createStack(UNIT_ARCHER, PLAYER_2, 0, { col: 14, row: 1 });
      const queue = buildTurnOrder([alive, dead]);
      expect(queue.entries.length).toBe(1);
    });
  });

  describe('[RULE-08] Wait Action', () => {
    it('moves stack to wait queue', () => {
      const stacks = [
        createStack(UNIT_SWORDSMAN, PLAYER_1, 3, { col: 0, row: 1 }),
        createStack(UNIT_PIKEMAN, PLAYER_2, 5, { col: 14, row: 1 }),
      ];
      const queue = buildTurnOrder(stacks);
      handleWait(queue);
      expect(queue.waitQueue.length).toBe(1);
    });
  });

  describe('[RULE-09] Defend Action', () => {
    it('sets isDefending flag', () => {
      const stack = createStack(UNIT_PIKEMAN, PLAYER_1, 5, { col: 0, row: 1 });
      handleDefend(stack);
      expect(stack.isDefending).toBe(true);
      expect(stack.hasActed).toBe(true);
    });
  });

  describe('[RULE-10] Round Transition', () => {
    it('resets all stack flags on new round', () => {
      const stack = createStack(UNIT_PIKEMAN, PLAYER_1, 5, { col: 0, row: 1 });
      stack.hasRetaliated = true;
      stack.hasActed = true;
      stack.isDefending = true;
      stack.isWaiting = true;
      resetRound([stack]);
      expect(stack.hasRetaliated).toBe(false);
      expect(stack.hasActed).toBe(false);
      expect(stack.isDefending).toBe(false);
      expect(stack.isWaiting).toBe(false);
    });

    it('increments round and rebuilds queue', () => {
      const stacks = [
        createStack(UNIT_PIKEMAN, PLAYER_1, 5, { col: 0, row: 1 }),
        createStack(UNIT_SWORDSMAN, PLAYER_2, 3, { col: 14, row: 1 }),
      ];
      resetRound(stacks);
      const queue = buildTurnOrder(stacks);
      expect(queue.entries.length).toBe(2);
    });
  });
});
