export const GameState = {
  SETUP: 'SETUP',
  PLAYER1_PICKING: 'PLAYER1_PICKING',
  PLAYER2_PICKING: 'PLAYER2_PICKING',
  BATTLE: 'BATTLE',
  FINISHED: 'FINISHED',
} as const;
export type GameState = typeof GameState[keyof typeof GameState];

export const ActionType = {
  MOVE: 'move',
  MELEE_ATTACK: 'melee_attack',
  RANGED_ATTACK: 'ranged_attack',
  RETALIATION: 'retaliation',
  WAIT: 'wait',
  DEFEND: 'defend',
  DEATH: 'death',
} as const;
export type ActionType = typeof ActionType[keyof typeof ActionType];

export const PlayerSide = {
  LEFT: 'left',
  RIGHT: 'right',
} as const;
export type PlayerSide = typeof PlayerSide[keyof typeof PlayerSide];

export interface HexCoord {
  col: number;
  row: number;
}

export interface UnitType {
  id: string;
  name: string;
  attack: number;
  defense: number;
  minDamage: number;
  maxDamage: number;
  hp: number;
  speed: number;
  initiative: number;
  isRanged: boolean;
  shots: number | null;
  icon: string;
}

export interface Stack {
  id: string;
  unitType: UnitType;
  owner: Player;
  creatureCount: number;
  currentHp: number;
  position: HexCoord;
  hasRetaliated: boolean;
  hasActed: boolean;
  isWaiting: boolean;
  isDefending: boolean;
  remainingShots: number | null;
  initialCount: number;
}

export interface Player {
  id: string;
  name: string;
  color: string;
  stacks: Stack[];
  side: PlayerSide;
}

export interface Hex {
  col: number;
  row: number;
  isObstacle: boolean;
  occupant: Stack | null;
}

export interface Battlefield {
  width: 15;
  height: 11;
  hexes: Hex[][];
  obstacles: HexCoord[];
}

export interface TurnOrderQueue {
  entries: Stack[];
  activeIndex: number;
  waitQueue: Stack[];
}

export interface CombatLogEntry {
  round: number;
  actorStackId: string;
  actionType: ActionType;
  targetStackId: string | null;
  damageDealt: number | null;
  creaturesKilled: number | null;
  fromHex: HexCoord | null;
  toHex: HexCoord | null;
  message: string;
}

export interface DamageResult {
  damage: number;
  creaturesKilled: number;
}

export interface PathResult {
  path: HexCoord[];
  length: number;
}

export interface ArmySlot {
  unitType: UnitType | null;
  creatureCount: number;
}

export interface ArmySelection {
  slots: [ArmySlot, ArmySlot, ArmySlot];
  isReady: boolean;
}

export interface BattleSummary {
  winner: Player;
  loser: Player;
  totalRounds: number;
  survivingStacks: Array<{
    unitType: UnitType;
    remainingCreatures: number;
    remainingHp: number;
  }>;
  totalDamageDealt: { player1: number; player2: number };
  totalCreaturesKilled: { player1: number; player2: number };
}

export interface MeleeAttackResult {
  attackDamage: number;
  attackKills: number;
  retaliationDamage: number;
  retaliationKills: number;
  defenderDied: boolean;
  attackerDied: boolean;
}

export interface RangedAttackResult {
  damage: number;
  creaturesKilled: number;
}

export function isAlive(stack: Stack): boolean {
  return stack.creatureCount > 0;
}

export function totalHp(stack: Stack): number {
  return (stack.creatureCount - 1) * stack.unitType.hp + stack.currentHp;
}

export function effectiveDefense(stack: Stack): number {
  return stack.isDefending
    ? Math.floor(stack.unitType.defense * 1.2)
    : stack.unitType.defense;
}

export function coordsEqual(a: HexCoord, b: HexCoord): boolean {
  return a.col === b.col && a.row === b.row;
}

export function coordToKey(coord: HexCoord): string {
  return `${coord.col},${coord.row}`;
}
