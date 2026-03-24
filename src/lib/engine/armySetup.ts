import type { ArmySelection, Stack, Player, ArmySlot } from '../types';
import { UNIT_ROSTER } from '../data/units';

export function validateArmy(selection: ArmySelection): boolean {
  const filledSlots = selection.slots.filter(
    (s) => s.unitType !== null && s.creatureCount >= 1 && s.creatureCount <= 99
  );
  return filledSlots.length === 3;
}

export function createStackFromSelection(
  slot: ArmySlot,
  owner: Player,
  position: { col: number; row: number }
): Stack {
  if (!slot.unitType) {
    throw new Error('Cannot create stack from empty slot');
  }

  return {
    id: `${slot.unitType.id}_${owner.id}_${position.col}_${position.row}`,
    unitType: slot.unitType,
    owner,
    creatureCount: slot.creatureCount,
    currentHp: slot.unitType.hp,
    position,
    hasRetaliated: false,
    hasActed: false,
    isWaiting: false,
    isDefending: false,
    remainingShots: slot.unitType.isRanged ? slot.unitType.shots : null,
    initialCount: slot.creatureCount,
  };
}

export function getDefaultArmy(owner: Player): Stack[] {
  const defaults: Array<{ unitId: string; count: number }> = [
    { unitId: 'pikeman', count: 10 },
    { unitId: 'archer', count: 8 },
    { unitId: 'griffin', count: 5 },
  ];

  const rows = [1, 5, 9];
  const col = owner.side === 'left' ? 0 : 14;

  return defaults.map((d, i) => {
    const unitType = UNIT_ROSTER.find((u) => u.id === d.unitId)!;
    return createStackFromSelection(
      { unitType, creatureCount: d.count },
      owner,
      { col, row: rows[i] }
    );
  });
}

export function createEmptyArmySelection(): ArmySelection {
  return {
    slots: [
      { unitType: null, creatureCount: 1 },
      { unitType: null, creatureCount: 1 },
      { unitType: null, creatureCount: 1 },
    ],
    isReady: false,
  };
}
