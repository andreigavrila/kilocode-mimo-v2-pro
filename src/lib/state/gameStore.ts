import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type {
  Stack,
  Player,
  Battlefield,
  TurnOrderQueue,
  CombatLogEntry,
  BattleSummary,
  HexCoord,
  ArmySelection,
  UnitType,
  MeleeAttackResult,
  RangedAttackResult,
} from '../types';
import { GameState, PlayerSide, ActionType, isAlive } from '../types';
import { coordToKey, areNeighbors } from '../utils/hexUtils';
import { UNIT_ROSTER } from '../data/units';
import { meleeAttack, rangedAttack } from '../engine/combat';
import { findPath, getReachableHexes } from '../engine/pathfinding';
import { buildTurnOrder, advanceTurn, handleWait, handleDefend, resetRound } from '../engine/turnManager';
import { checkVictory, buildBattleSummary } from '../engine/victoryCheck';
import { createEmptyBattlefield, generateObstacles, deployStacks } from '../engine/battlefieldGenerator';
import { validateArmy, createStackFromSelection, createEmptyArmySelection } from '../engine/armySetup';

interface AppState {
  gameState: GameState;
  player1: Player;
  player2: Player;
  player1Selection: ArmySelection;
  player2Selection: ArmySelection;
  battlefield: Battlefield;
  turnOrder: TurnOrderQueue;
  currentRound: number;
  combatLog: CombatLogEntry[];
  winner: Player | null;
  battleSummary: BattleSummary | null;
  highlightedHexes: Record<string, 'reachable' | 'attack' | 'path'>;
  hoveredHex: HexCoord | null;
  selectedStack: Stack | null;
  activeStack: Stack | null;
  damagePopups: Array<{ id: string; amount: number; creaturesKilled: number; position: HexCoord; timestamp: number }>;
  animationState: { type: string; stackId: string; from: HexCoord; to: HexCoord } | null;
  totalDamageDealt: { player1: number; player2: number };
  totalCreaturesKilled: { player1: number; player2: number };

  startGame: () => void;
  selectUnit: (playerNumber: 1 | 2, slotIndex: 0 | 1 | 2, unitType: UnitType) => void;
  setCreatureCount: (playerNumber: 1 | 2, slotIndex: 0 | 1 | 2, count: number) => void;
  deselectUnit: (playerNumber: 1 | 2, slotIndex: 0 | 1 | 2) => void;
  confirmArmy: (playerNumber: 1 | 2) => void;
  loadDefaultArmy: (playerNumber: 1 | 2) => void;
  clickHex: (hex: HexCoord) => void;
  hoverHex: (hex: HexCoord | null) => void;
  waitAction: () => void;
  defendAction: () => void;
  newGame: () => void;
}


function createDefaultPlayer(id: string, name: string, color: string, side: PlayerSide): Player {
  return { id, name, color, stacks: [], side };
}

function addCombatLogEntry(
  state: AppState,
  entry: Omit<CombatLogEntry, 'round'>
): void {
  state.combatLog.push({ ...entry, round: state.currentRound });
}

function computeHighlightedHexes(state: AppState): void {
  state.highlightedHexes = {};
  const active = state.activeStack;
  if (!active || !isAlive(active)) return;
  if (active.hasActed) return;

  if (state.gameState !== GameState.BATTLE) return;

  const stackState = getStackState(active);

  if (stackState === 'ACTIVE') {
    const reachable = getReachableHexes(active, state.battlefield);
    for (const [key] of reachable) {
      state.highlightedHexes[key] = 'reachable';
    }
  }

  const allStacks = [...state.player1.stacks, ...state.player2.stacks];
  for (const target of allStacks) {
    if (!isAlive(target)) continue;
    if (target.owner.id === active.owner.id) continue;

    const isAdjacent = areNeighbors(active.position, target.position);
    const isRanged = active.unitType.isRanged;
    const hasShots = (active.remainingShots ?? 0) > 0;

    if (isAdjacent) {
      state.highlightedHexes[coordToKey(target.position)] = 'attack';
    } else if (isRanged && hasShots) {
      state.highlightedHexes[coordToKey(target.position)] = 'attack';
    }
  }
}

function getStackState(stack: Stack): 'IDLE' | 'ACTIVE' | 'MOVED' | 'ACTED' | 'DEAD' {
  if (!isAlive(stack)) return 'DEAD';
  if (stack.hasActed) return 'ACTED';
  return 'ACTIVE';
}

function endTurn(state: AppState): void {
  const active = state.activeStack;
  if (active) {
    active.hasActed = true;
  }

  const next = advanceTurn(state.turnOrder);
  if (next) {
    state.activeStack = next;
    state.selectedStack = next;
    computeHighlightedHexes(state);
  } else {
    const allStacks = [...state.player1.stacks, ...state.player2.stacks];
    const winnerId = checkVictory(state.player1.stacks, state.player2.stacks);

    if (winnerId) {
      const winner = winnerId === 'player1' ? state.player1 : state.player2;
      const loser = winnerId === 'player1' ? state.player2 : state.player1;
      state.winner = winner;
      state.battleSummary = buildBattleSummary(
        winner,
        loser,
        state.currentRound,
        state.totalDamageDealt,
        state.totalCreaturesKilled
      );
      state.gameState = GameState.FINISHED;
      state.activeStack = null;
      state.highlightedHexes = {};
    } else {
      state.currentRound += 1;
      resetRound(allStacks);
      state.turnOrder = buildTurnOrder(allStacks);
      const first = state.turnOrder.entries[0] ?? null;
      state.activeStack = first;
      state.selectedStack = first;
      computeHighlightedHexes(state);
    }
  }
}

export const useGameStore = create<AppState>()(immer((set, _get) => {
  const p1 = createDefaultPlayer('player1', 'Player 1', '#3B82F6', PlayerSide.LEFT);
  const p2 = createDefaultPlayer('player2', 'Player 2', '#EF4444', PlayerSide.RIGHT);

  return {
    gameState: GameState.SETUP,
    player1: p1,
    player2: p2,
    player1Selection: createEmptyArmySelection(),
    player2Selection: createEmptyArmySelection(),
    battlefield: createEmptyBattlefield(),
    turnOrder: { entries: [], activeIndex: 0, waitQueue: [] },
    currentRound: 1,
    combatLog: [],
    winner: null,
    battleSummary: null,
    highlightedHexes: {},
    hoveredHex: null,
    selectedStack: null,
    activeStack: null,
    damagePopups: [],
    animationState: null,
    totalDamageDealt: { player1: 0, player2: 0 },
    totalCreaturesKilled: { player1: 0, player2: 0 },

    startGame: () =>
      set((state) => {
        state.gameState = GameState.PLAYER1_PICKING;
        state.player1Selection = createEmptyArmySelection();
        state.player2Selection = createEmptyArmySelection();
      }),

    selectUnit: (playerNumber, slotIndex, unitType) =>
      set((state) => {
        const sel = playerNumber === 1 ? state.player1Selection : state.player2Selection;
        sel.slots[slotIndex] = { unitType, creatureCount: sel.slots[slotIndex].creatureCount || 10 };
        sel.isReady = validateArmy(sel);
      }),

    setCreatureCount: (playerNumber, slotIndex, count) =>
      set((state) => {
        const sel = playerNumber === 1 ? state.player1Selection : state.player2Selection;
        const clamped = Math.max(1, Math.min(99, count));
        sel.slots[slotIndex].creatureCount = clamped;
        sel.isReady = validateArmy(sel);
      }),

    deselectUnit: (playerNumber, slotIndex) =>
      set((state) => {
        const sel = playerNumber === 1 ? state.player1Selection : state.player2Selection;
        sel.slots[slotIndex] = { unitType: null, creatureCount: 1 };
        sel.isReady = validateArmy(sel);
      }),

    confirmArmy: (playerNumber) =>
      set((state) => {
        const sel = playerNumber === 1 ? state.player1Selection : state.player2Selection;
        if (!validateArmy(sel)) return;

        const player = playerNumber === 1 ? state.player1 : state.player2;
        const rows = [1, 5, 9];
        const col = playerNumber === 1 ? 0 : 14;

        player.stacks = sel.slots.map((slot, i) =>
          createStackFromSelection(slot, player, { col, row: rows[i] })
        );

        if (playerNumber === 1) {
          state.gameState = GameState.PLAYER2_PICKING;
        } else {
          state.battlefield = createEmptyBattlefield();
          generateObstacles(state.battlefield);
          deployStacks(state.player1, state.player2, state.battlefield);

          const allStacks = [...state.player1.stacks, ...state.player2.stacks];
          state.turnOrder = buildTurnOrder(allStacks);
          state.activeStack = state.turnOrder.entries[0] ?? null;
          state.selectedStack = state.activeStack;
          state.currentRound = 1;
          state.combatLog = [];
          state.totalDamageDealt = { player1: 0, player2: 0 };
          state.totalCreaturesKilled = { player1: 0, player2: 0 };
          state.gameState = GameState.BATTLE;
          computeHighlightedHexes(state);
        }
      }),

    loadDefaultArmy: (playerNumber) =>
      set((state) => {
        const sel = playerNumber === 1 ? state.player1Selection : state.player2Selection;
        const defaults: Array<{ unitId: string; count: number }> = [
          { unitId: 'pikeman', count: 10 },
          { unitId: 'archer', count: 8 },
          { unitId: 'griffin', count: 5 },
        ];
        for (let i = 0; i < 3; i++) {
          const unitType = UNIT_ROSTER.find((u) => u.id === defaults[i].unitId)!;
          sel.slots[i] = { unitType, creatureCount: defaults[i].count };
        }
        sel.isReady = validateArmy(sel);
      }),

    clickHex: (hex) =>
      set((state) => {
        if (state.gameState !== GameState.BATTLE) return;
        const active = state.activeStack;
        if (!active || !isAlive(active) || active.hasActed) return;

        const key = coordToKey(hex);
        const highlightType = state.highlightedHexes[key];

        if (!highlightType) return;

        if (highlightType === 'reachable') {
          const path = findPath(active.position, hex, state.battlefield);
          if (!path) return;

          const oldHex = state.battlefield.hexes[active.position.col][active.position.row];
          oldHex.occupant = null;
          active.position = hex;
          state.battlefield.hexes[hex.col][hex.row].occupant = active;

          addCombatLogEntry(state, {
            actorStackId: active.id,
            actionType: ActionType.MOVE,
            targetStackId: null,
            damageDealt: null,
            creaturesKilled: null,
            fromHex: path[0],
            toHex: hex,
            message: `${active.unitType.name} moves to (${hex.col}, ${hex.row})`,
          });

          state.highlightedHexes = {};
          computeHighlightedHexes(state);
        } else if (highlightType === 'attack') {
          const targetHex = state.battlefield.hexes[hex.col][hex.row];
          const target = targetHex.occupant;
          if (!target || !isAlive(target)) return;

          const isAdjacent = areNeighbors(active.position, target.position);

          if (!isAdjacent && active.unitType.isRanged && (active.remainingShots ?? 0) > 0) {
            const result: RangedAttackResult = rangedAttack(active, target);

            const playerKey = active.owner.id === 'player1' ? 'player1' : 'player2';
            state.totalDamageDealt[playerKey] += result.damage;
            state.totalCreaturesKilled[playerKey] += result.creaturesKilled;

            addCombatLogEntry(state, {
              actorStackId: active.id,
              actionType: ActionType.RANGED_ATTACK,
              targetStackId: target.id,
              damageDealt: result.damage,
              creaturesKilled: result.creaturesKilled,
              fromHex: null,
              toHex: null,
              message: `${active.unitType.name} shoots ${target.unitType.name} for ${result.damage} damage (${result.creaturesKilled} killed)`,
            });

            state.damagePopups.push({
              id: `${Date.now()}-dmg`,
              amount: result.damage,
              creaturesKilled: result.creaturesKilled,
              position: target.position,
              timestamp: Date.now(),
            });

            if (!isAlive(target)) {
              state.battlefield.hexes[target.position.col][target.position.row].occupant = null;
              addCombatLogEntry(state, {
                actorStackId: target.id,
                actionType: ActionType.DEATH,
                targetStackId: null,
                damageDealt: null,
                creaturesKilled: null,
                fromHex: null,
                toHex: null,
                message: `${target.unitType.name} has been eliminated!`,
              });
            }

            endTurn(state);
          } else if (isAdjacent) {
            // adjacent attack - no movement needed

            const result: MeleeAttackResult = meleeAttack(active, target);

            const atkPlayerKey = active.owner.id === 'player1' ? 'player1' : 'player2';
            state.totalDamageDealt[atkPlayerKey] += result.attackDamage;
            state.totalCreaturesKilled[atkPlayerKey] += result.attackKills;

            addCombatLogEntry(state, {
              actorStackId: active.id,
              actionType: ActionType.MELEE_ATTACK,
              targetStackId: target.id,
              damageDealt: result.attackDamage,
              creaturesKilled: result.attackKills,
              fromHex: null,
              toHex: null,
              message: `${active.unitType.name} attacks ${target.unitType.name} for ${result.attackDamage} damage (${result.attackKills} killed)`,
            });

            state.damagePopups.push({
              id: `${Date.now()}-atk`,
              amount: result.attackDamage,
              creaturesKilled: result.attackKills,
              position: target.position,
              timestamp: Date.now(),
            });

            if (result.retaliationDamage > 0) {
              const defPlayerKey = target.owner.id === 'player1' ? 'player1' : 'player2';
              state.totalDamageDealt[defPlayerKey] += result.retaliationDamage;
              state.totalCreaturesKilled[defPlayerKey] += result.retaliationKills;

              addCombatLogEntry(state, {
                actorStackId: target.id,
                actionType: ActionType.RETALIATION,
                targetStackId: active.id,
                damageDealt: result.retaliationDamage,
                creaturesKilled: result.retaliationKills,
                fromHex: null,
                toHex: null,
                message: `${target.unitType.name} retaliates for ${result.retaliationDamage} damage (${result.retaliationKills} killed)`,
              });

              state.damagePopups.push({
                id: `${Date.now()}-ret`,
                amount: result.retaliationDamage,
                creaturesKilled: result.retaliationKills,
                position: active.position,
                timestamp: Date.now(),
              });

              if (!isAlive(active)) {
                state.battlefield.hexes[active.position.col][active.position.row].occupant = null;
                addCombatLogEntry(state, {
                  actorStackId: active.id,
                  actionType: ActionType.DEATH,
                  targetStackId: null,
                  damageDealt: null,
                  creaturesKilled: null,
                  fromHex: null,
                  toHex: null,
                  message: `${active.unitType.name} has been eliminated!`,
                });
              }
            }

            if (!isAlive(target)) {
              state.battlefield.hexes[target.position.col][target.position.row].occupant = null;
              addCombatLogEntry(state, {
                actorStackId: target.id,
                actionType: ActionType.DEATH,
                targetStackId: null,
                damageDealt: null,
                creaturesKilled: null,
                fromHex: null,
                toHex: null,
                message: `${target.unitType.name} has been eliminated!`,
              });
            }

            endTurn(state);
          }
        }
      }),

    hoverHex: (hex) =>
      set((state) => {
        state.hoveredHex = hex;
        state.highlightedHexes = {};
        if (hex) {
          computeHighlightedHexes(state);
          const key = coordToKey(hex);
          if (key in state.highlightedHexes && state.highlightedHexes[key] === 'reachable') {
            const active = state.activeStack;
            if (active) {
              const path = findPath(active.position, hex, state.battlefield);
              if (path) {
                for (const p of path) {
                  const pk = coordToKey(p);
                  if (!(pk in state.highlightedHexes)) {
                    state.highlightedHexes[pk] = 'path';
                  }
                }
              }
            }
          }
        }
      }),

    waitAction: () =>
      set((state) => {
        if (state.gameState !== GameState.BATTLE) return;
        const active = state.activeStack;
        if (!active || active.hasActed || active.isWaiting) return;

        handleWait(state.turnOrder);
        addCombatLogEntry(state, {
          actorStackId: active.id,
          actionType: ActionType.WAIT,
          targetStackId: null,
          damageDealt: null,
          creaturesKilled: null,
          fromHex: null,
          toHex: null,
          message: `${active.unitType.name} waits.`,
        });
        endTurn(state);
      }),

    defendAction: () =>
      set((state) => {
        if (state.gameState !== GameState.BATTLE) return;
        const active = state.activeStack;
        if (!active || active.hasActed) return;

        handleDefend(active);
        addCombatLogEntry(state, {
          actorStackId: active.id,
          actionType: ActionType.DEFEND,
          targetStackId: null,
          damageDealt: null,
          creaturesKilled: null,
          fromHex: null,
          toHex: null,
          message: `${active.unitType.name} defends (+20% defense).`,
        });
        endTurn(state);
      }),

    newGame: () =>
      set((state) => {
        const p1 = createDefaultPlayer('player1', 'Player 1', '#3B82F6', PlayerSide.LEFT);
        const p2 = createDefaultPlayer('player2', 'Player 2', '#EF4444', PlayerSide.RIGHT);
        state.gameState = GameState.SETUP;
        state.player1 = p1;
        state.player2 = p2;
        state.player1Selection = createEmptyArmySelection();
        state.player2Selection = createEmptyArmySelection();
        state.battlefield = createEmptyBattlefield();
        state.turnOrder = { entries: [], activeIndex: 0, waitQueue: [] };
        state.currentRound = 1;
        state.combatLog = [];
        state.winner = null;
        state.battleSummary = null;
        state.highlightedHexes = {};
        state.hoveredHex = null;
        state.selectedStack = null;
        state.activeStack = null;
        state.damagePopups = [];
        state.animationState = null;
        state.totalDamageDealt = { player1: 0, player2: 0 };
        state.totalCreaturesKilled = { player1: 0, player2: 0 };
      }),
  };
}));
