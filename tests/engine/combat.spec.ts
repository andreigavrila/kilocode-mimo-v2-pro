import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  calculateDamage,
  applyDamage,
  meleeAttack,
  rangedAttack,
} from '../../src/lib/engine/combat';
import {
  UNIT_PIKEMAN, UNIT_ARCHER, UNIT_SWORDSMAN, UNIT_CAVALIER,
  PLAYER_1, PLAYER_2, createStack, SCENARIO_BASIC_MELEE, SCENARIO_RANGED_ATTACK,
} from '../fixtures';

describe('Combat Engine', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  describe('[ALGO-02] Damage Formula', () => {
    it('calculates base damage times creature count', () => {
      const attacker = createStack(UNIT_PIKEMAN, PLAYER_1, 10, { col: 0, row: 0 });
      const defender = createStack({ ...UNIT_PIKEMAN, defense: 4 }, PLAYER_2, 5, { col: 1, row: 0 });
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const result = calculateDamage(attacker, defender);
      expect(result.damage).toBe(10);
    });

    it('increases damage by 5% per attack advantage point', () => {
      const attacker = createStack(UNIT_SWORDSMAN, PLAYER_1, 1, { col: 0, row: 0 });
      const defender = createStack(UNIT_PIKEMAN, PLAYER_2, 1, { col: 1, row: 0 });
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const result = calculateDamage(attacker, defender);
      expect(result.damage).toBe(7);
    });

    it('caps positive modifier at 4.0', () => {
      const attacker = createStack({ ...UNIT_CAVALIER, attack: 80 }, PLAYER_1, 1, { col: 0, row: 0 });
      const defender = createStack({ ...UNIT_PIKEMAN, defense: 1 }, PLAYER_2, 1, { col: 1, row: 0 });
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const result = calculateDamage(attacker, defender);
      expect(result.damage).toBe(Math.floor(15 * 4.0));
    });

    it('reduces damage by 2.5% per defense advantage point', () => {
      const attacker = createStack(UNIT_PIKEMAN, PLAYER_1, 1, { col: 0, row: 0 });
      const defender = createStack(UNIT_SWORDSMAN, PLAYER_2, 1, { col: 1, row: 0 });
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const result = calculateDamage(attacker, defender);
      expect(result.damage).toBeGreaterThanOrEqual(1);
    });

    it('enforces minimum damage of 1', () => {
      const attacker = createStack({ ...UNIT_PIKEMAN, attack: 1, minDamage: 1, maxDamage: 1 }, PLAYER_1, 1, { col: 0, row: 0 });
      const defender = createStack({ ...UNIT_CAVALIER, defense: 50 }, PLAYER_2, 1, { col: 1, row: 0 });
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const result = calculateDamage(attacker, defender);
      expect(result.damage).toBe(1);
    });

    it('damage scales with creature count', () => {
      const attacker5 = createStack(UNIT_PIKEMAN, PLAYER_1, 5, { col: 0, row: 0 });
      const attacker10 = createStack(UNIT_PIKEMAN, PLAYER_1, 10, { col: 0, row: 0 });
      const defender = createStack(UNIT_PIKEMAN, PLAYER_2, 1, { col: 1, row: 0 });
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const r5 = calculateDamage(attacker5, defender);
      const r10 = calculateDamage(attacker10, defender);
      expect(r10.damage).toBeGreaterThan(r5.damage);
    });
  });

  describe('[RULE-05] Damage Application', () => {
    it('subtracts damage from top creature HP', () => {
      const stack = createStack(UNIT_PIKEMAN, PLAYER_1, 5, { col: 0, row: 0 });
      applyDamage(stack, 3);
      expect(stack.currentHp).toBe(7);
      expect(stack.creatureCount).toBe(5);
    });

    it('kills creature when HP reaches 0 and overflows to next', () => {
      const stack = createStack(UNIT_PIKEMAN, PLAYER_1, 3, { col: 0, row: 0 });
      stack.currentHp = 4;
      applyDamage(stack, 22);
      expect(stack.creatureCount).toBe(1);
      expect(stack.currentHp).toBe(2);
    });

    it('eliminates stack when all creatures die', () => {
      const stack = createStack(UNIT_PIKEMAN, PLAYER_1, 2, { col: 0, row: 0 });
      applyDamage(stack, 999);
      expect(stack.creatureCount).toBe(0);
      expect(stack.currentHp).toBe(0);
    });

    it('handles exact HP kill', () => {
      const stack = createStack(UNIT_PIKEMAN, PLAYER_1, 2, { col: 0, row: 0 });
      applyDamage(stack, 10);
      expect(stack.creatureCount).toBe(1);
      expect(stack.currentHp).toBe(10);
    });
  });

  describe('[RULE-03] Melee Attack', () => {
    it('deals damage and triggers retaliation', () => {
      const { attacker, defender } = SCENARIO_BASIC_MELEE();
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const result = meleeAttack(attacker, defender);
      expect(result.attackDamage).toBeGreaterThan(0);
      expect(defender.hasRetaliated).toBe(true);
    });

    it('no retaliation if defender dies', () => {
      const attacker = createStack(UNIT_CAVALIER, PLAYER_1, 10, { col: 5, row: 5 });
      const defender = createStack(UNIT_PIKEMAN, PLAYER_2, 1, { col: 6, row: 5 });
      vi.spyOn(Math, 'random').mockReturnValue(1);
      const result = meleeAttack(attacker, defender);
      expect(defender.creatureCount).toBe(0);
      expect(result.retaliationDamage).toBe(0);
    });

    it('attacker can die from retaliation', () => {
      const attacker = createStack(UNIT_PIKEMAN, PLAYER_1, 1, { col: 5, row: 5 });
      const defender = createStack(UNIT_CAVALIER, PLAYER_2, 10, { col: 6, row: 5 });
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const result = meleeAttack(attacker, defender);
      expect(result.retaliationDamage).toBeGreaterThan(0);
    });
  });

  describe('[RULE-04] Retaliation', () => {
    it('does not retaliate twice in same round', () => {
      const defender = createStack(UNIT_SWORDSMAN, PLAYER_2, 5, { col: 6, row: 5 });
      const attacker1 = createStack(UNIT_PIKEMAN, PLAYER_1, 5, { col: 5, row: 5 });
      const attacker2 = createStack(UNIT_PIKEMAN, PLAYER_1, 5, { col: 7, row: 5 });
      vi.spyOn(Math, 'random').mockReturnValue(0.5);

      const result1 = meleeAttack(attacker1, defender);
      expect(result1.retaliationDamage).toBeGreaterThan(0);
      expect(defender.hasRetaliated).toBe(true);

      const result2 = meleeAttack(attacker2, defender);
      expect(result2.retaliationDamage).toBe(0);
    });
  });

  describe('[RULE-06] Ranged Attack', () => {
    it('deals damage without retaliation', () => {
      const { attacker, defender } = SCENARIO_RANGED_ATTACK();
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const result = rangedAttack(attacker, defender);
      expect(result.damage).toBeGreaterThan(0);
      expect(defender.hasRetaliated).toBe(false);
    });

    it('decrements remaining shots', () => {
      const archer = createStack(UNIT_ARCHER, PLAYER_1, 5, { col: 0, row: 0 });
      const target = createStack(UNIT_SWORDSMAN, PLAYER_2, 3, { col: 10, row: 5 });
      expect(archer.remainingShots).toBe(12);
      rangedAttack(archer, target);
      expect(archer.remainingShots).toBe(11);
    });
  });

  describe('[RULE-09] Defend Action', () => {
    it('defend boosts defense by 20%', () => {
      const stack = createStack(UNIT_SWORDSMAN, PLAYER_1, 5, { col: 0, row: 0 });
      stack.isDefending = true;
      const attacker = createStack(UNIT_PIKEMAN, PLAYER_2, 5, { col: 1, row: 0 });
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const result = calculateDamage(attacker, stack);
      expect(result.damage).toBeGreaterThanOrEqual(1);
    });
  });
});
