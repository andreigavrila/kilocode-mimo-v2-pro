import type { Stack, DamageResult, MeleeAttackResult, RangedAttackResult } from '../types';
import { effectiveDefense, isAlive } from '../types';

export function calculateDamage(attacker: Stack, defender: Stack): DamageResult {
  const baseDamagePerCreature =
    Math.floor(Math.random() * (attacker.unitType.maxDamage - attacker.unitType.minDamage + 1)) +
    attacker.unitType.minDamage;

  const totalBaseDamage = baseDamagePerCreature * attacker.creatureCount;

  const atkStat = attacker.unitType.attack;
  const defStat = effectiveDefense(defender);

  let modifier = 1.0;
  if (atkStat > defStat) {
    const difference = atkStat - defStat;
    modifier = 1 + difference * 0.05;
    modifier = Math.min(modifier, 4.0);
  } else if (defStat > atkStat) {
    const difference = defStat - atkStat;
    modifier = 1 - difference * 0.025;
    modifier = Math.max(modifier, 0.30);
  }

  let finalDamage = Math.floor(totalBaseDamage * modifier);
  finalDamage = Math.max(finalDamage, 1);

  const creaturesKilled = calculateCreaturesKilled(defender, finalDamage);

  return { damage: finalDamage, creaturesKilled };
}

export function calculateCreaturesKilled(defender: Stack, damage: number): number {
  let remainingDamage = damage;
  let killed = 0;
  let currentHp = defender.currentHp;

  while (remainingDamage > 0 && killed < defender.creatureCount) {
    if (remainingDamage >= currentHp) {
      remainingDamage -= currentHp;
      killed += 1;
      currentHp = defender.unitType.hp;
    } else {
      break;
    }
  }

  return killed;
}

export function applyDamage(stack: Stack, damage: number): number {
  let remainingDamage = damage;
  let killed = 0;

  while (remainingDamage > 0 && stack.creatureCount > 0) {
    if (remainingDamage >= stack.currentHp) {
      remainingDamage -= stack.currentHp;
      stack.creatureCount -= 1;
      killed += 1;
      if (stack.creatureCount > 0) {
        stack.currentHp = stack.unitType.hp;
      } else {
        stack.currentHp = 0;
      }
    } else {
      stack.currentHp -= remainingDamage;
      remainingDamage = 0;
    }
  }

  return killed;
}

export function meleeAttack(attacker: Stack, defender: Stack): MeleeAttackResult {
  const dmgResult = calculateDamage(attacker, defender);
  const attackKills = applyDamage(defender, dmgResult.damage);

  const defenderDied = !isAlive(defender);

  let retaliationDamage = 0;
  let retaliationKills = 0;

  if (!defenderDied && !defender.hasRetaliated) {
    const retDmgResult = calculateDamage(defender, attacker);
    retaliationDamage = retDmgResult.damage;
    retaliationKills = applyDamage(attacker, retDmgResult.damage);
    defender.hasRetaliated = true;
  }

  return {
    attackDamage: dmgResult.damage,
    attackKills,
    retaliationDamage,
    retaliationKills,
    defenderDied,
    attackerDied: !isAlive(attacker),
  };
}

export function rangedAttack(attacker: Stack, defender: Stack): RangedAttackResult {
  const dmgResult = calculateDamage(attacker, defender);
  const creaturesKilled = applyDamage(defender, dmgResult.damage);

  if (attacker.remainingShots !== null) {
    attacker.remainingShots -= 1;
  }

  return { damage: dmgResult.damage, creaturesKilled };
}
