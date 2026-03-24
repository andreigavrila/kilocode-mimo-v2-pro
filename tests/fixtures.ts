import type { UnitType, Stack, Player, HexCoord, Battlefield } from '../src/lib/types';
import { PlayerSide } from '../src/lib/types';

export const UNIT_PIKEMAN: UnitType = {
  id: 'pikeman', name: 'Pikeman', attack: 4, defense: 5,
  minDamage: 1, maxDamage: 3, hp: 10, speed: 4, initiative: 8,
  isRanged: false, shots: null, icon: '⚔️'
};

export const UNIT_ARCHER: UnitType = {
  id: 'archer', name: 'Archer', attack: 6, defense: 3,
  minDamage: 2, maxDamage: 3, hp: 10, speed: 4, initiative: 9,
  isRanged: true, shots: 12, icon: '🏹'
};

export const UNIT_GRIFFIN: UnitType = {
  id: 'griffin', name: 'Griffin', attack: 8, defense: 8,
  minDamage: 3, maxDamage: 6, hp: 25, speed: 6, initiative: 12,
  isRanged: false, shots: null, icon: '🦅'
};

export const UNIT_SWORDSMAN: UnitType = {
  id: 'swordsman', name: 'Swordsman', attack: 10, defense: 12,
  minDamage: 6, maxDamage: 9, hp: 35, speed: 5, initiative: 11,
  isRanged: false, shots: null, icon: '🗡️'
};

export const UNIT_MONK: UnitType = {
  id: 'monk', name: 'Monk', attack: 12, defense: 7,
  minDamage: 10, maxDamage: 12, hp: 30, speed: 5, initiative: 12,
  isRanged: true, shots: 12, icon: '🙏'
};

export const UNIT_CAVALIER: UnitType = {
  id: 'cavalier', name: 'Cavalier', attack: 15, defense: 15,
  minDamage: 15, maxDamage: 25, hp: 100, speed: 7, initiative: 13,
  isRanged: false, shots: null, icon: '🐴'
};

export const PLAYER_1: Player = {
  id: 'player1', name: 'Player 1', color: '#3B82F6', stacks: [], side: PlayerSide.LEFT
};

export const PLAYER_2: Player = {
  id: 'player2', name: 'Player 2', color: '#EF4444', stacks: [], side: PlayerSide.RIGHT
};

export function createStack(
  unitType: UnitType, owner: Player, count: number, position: HexCoord
): Stack {
  return {
    id: `${unitType.id}_${owner.id}_${position.col}_${position.row}`,
    unitType, owner, creatureCount: count, currentHp: unitType.hp,
    position, hasRetaliated: false, hasActed: false,
    isWaiting: false, isDefending: false,
    remainingShots: unitType.isRanged ? unitType.shots : null,
    initialCount: count,
  };
}

export function createEmptyBattlefield(): Battlefield {
  const hexes: Battlefield['hexes'] = [];
  for (let col = 0; col < 15; col++) {
    hexes[col] = [];
    for (let row = 0; row < 11; row++) {
      hexes[col][row] = { col, row, isObstacle: false, occupant: null };
    }
  }
  return { width: 15, height: 11, hexes, obstacles: [] };
}

export const SCENARIO_BASIC_MELEE = () => {
  const bf = createEmptyBattlefield();
  const attacker = createStack(UNIT_PIKEMAN, PLAYER_1, 10, { col: 5, row: 5 });
  const defender = createStack(UNIT_SWORDSMAN, PLAYER_2, 3, { col: 6, row: 5 });
  bf.hexes[5][5].occupant = attacker;
  bf.hexes[6][5].occupant = defender;
  return { battlefield: bf, attacker, defender };
};

export const SCENARIO_RANGED_ATTACK = () => {
  const bf = createEmptyBattlefield();
  const archer = createStack(UNIT_ARCHER, PLAYER_1, 8, { col: 1, row: 5 });
  const target = createStack(UNIT_SWORDSMAN, PLAYER_2, 3, { col: 10, row: 5 });
  bf.hexes[1][5].occupant = archer;
  bf.hexes[10][5].occupant = target;
  return { battlefield: bf, attacker: archer, defender: target };
};

export const SCENARIO_SURROUNDED = () => {
  const bf = createEmptyBattlefield();
  const center = createStack(UNIT_PIKEMAN, PLAYER_1, 5, { col: 7, row: 5 });
  bf.hexes[7][5].occupant = center;
  const neighbors = [
    { col: 8, row: 5 }, { col: 7, row: 4 }, { col: 6, row: 4 },
    { col: 6, row: 5 }, { col: 6, row: 6 }, { col: 7, row: 6 }
  ];
  neighbors.forEach(n => { bf.hexes[n.col][n.row].isObstacle = true; });
  return { battlefield: bf, stack: center };
};
