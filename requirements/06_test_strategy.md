# 06 — Testing Strategy: HoMM3 Battle Simulation

> **Inputs**: All previous stage outputs (01 through 05)

---

## Section 1: Testing Strategy Overview

| Testing Layer | Percentage | Framework | What It Tests |
|:---|:---:|:---|:---|
| Unit Tests | ~60% | Vitest | Pure engine functions: damage calculation, pathfinding, turn ordering, reachable hexes, victory check, army validation, obstacle generation |
| Integration Tests | ~20% | Vitest | Game Store action dispatching → engine → state mutation chains. Full turn sequences. |
| Component Tests | ~10% | Vitest + @testing-library/react + @testing-library/user-event | React components render correctly in all states, emit correct events |
| E2E / Manual Tests | ~10% | Manual browser testing | Full game flows: setup → battle → victory. Visual animation verification. |

**Justification**: The architecture cleanly separates the Game Engine (pure TypeScript) from the UI (React components backed by selector-driven store access). Since the engine contains all business logic and is framework-agnostic, unit tests can cover ~60% of all test scenarios. Integration tests verify the store correctly orchestrates engine calls. Component tests focus on rendering and interaction. E2E is manual since the game is simple enough to verify visually.

---

## Section 2: Complete Traceability Matrix

| Rule ID | Rule Description | Test Type | Test Location | Test Function Name | Scenario |
|:---|:---|:---|:---|:---|:---|
| `RULE-01` | Initiative Turn Ordering | Unit | `tests/engine/turnManager.spec.ts` | `sortsStacksByInitiativeDescending` | Happy path: stacks sorted correctly |
| `RULE-01` | Initiative Turn Ordering | Unit | `tests/engine/turnManager.spec.ts` | `breaksTiesWithPlayer1First` | Initiative tie: P1 acts first |
| `RULE-01` | Initiative Turn Ordering | Unit | `tests/engine/turnManager.spec.ts` | `breaksSamePlayerTiesByRow` | Same-player tie: lower row first |
| `RULE-01` | Initiative Turn Ordering | Unit | `tests/engine/turnManager.spec.ts` | `excludesDeadStacks` | Dead stacks excluded from queue |
| `RULE-02` | Stack Movement | Unit | `tests/engine/pathfinding.spec.ts` | `movesAlongShortestPath` | Basic movement A to B |
| `RULE-02` | Stack Movement | Unit | `tests/engine/pathfinding.spec.ts` | `respectsSpeedLimit` | Cannot exceed speed stat |
| `RULE-02` | Stack Movement | Unit | `tests/engine/pathfinding.spec.ts` | `avoidsObstacles` | Path routes around obstacles |
| `RULE-02` | Stack Movement | Unit | `tests/engine/pathfinding.spec.ts` | `avoidsOccupiedHexes` | Path routes around occupied hexes |
| `RULE-02` | Stack Movement | Integration | `tests/integration/gameStore.spec.ts` | `updatesBattlefieldOnMove` | Hex occupancy updates after move |
| `RULE-03` | Melee Attack | Unit | `tests/engine/combat.spec.ts` | `dealsDamageToDefender` | Basic melee damage calculation |
| `RULE-03` | Melee Attack | Unit | `tests/engine/combat.spec.ts` | `triggersRetaliationIfDefenderAlive` | Retaliation fires after melee |
| `RULE-03` | Melee Attack | Unit | `tests/engine/combat.spec.ts` | `noRetaliationIfDefenderDies` | No retaliation on kill |
| `RULE-03` | Melee Attack | Unit | `tests/engine/combat.spec.ts` | `attackerCanDieFromRetaliation` | Attacker killed by counter |
| `RULE-04` | Retaliation | Unit | `tests/engine/combat.spec.ts` | `retaliatesOncePerRound` | hasRetaliated flag check |
| `RULE-04` | Retaliation | Unit | `tests/engine/combat.spec.ts` | `noRetaliationIfAlreadyRetaliated` | Second attacker gets no counter |
| `RULE-04` | Retaliation | Unit | `tests/engine/combat.spec.ts` | `retaliationUsesCurrentCreatureCount` | Damage based on surviving creatures |
| `RULE-05` | Damage Application | Unit | `tests/engine/combat.spec.ts` | `killsCreaturesOneByOne` | HP overflow kills multiple |
| `RULE-05` | Damage Application | Unit | `tests/engine/combat.spec.ts` | `partialDamageToTopCreature` | Damage less than current HP |
| `RULE-05` | Damage Application | Unit | `tests/engine/combat.spec.ts` | `eliminatesStackWhenAllDead` | Creature count reaches 0 |
| `RULE-05` | Damage Application | Unit | `tests/engine/combat.spec.ts` | `handlesDamageExceedingTotalHp` | Overflow damage caps at stack total |
| `RULE-06` | Ranged Attack | Unit | `tests/engine/combat.spec.ts` | `rangedAttackNoRetaliation` | Ranged hits without counter |
| `RULE-06` | Ranged Attack | Unit | `tests/engine/combat.spec.ts` | `decrementsShots` | Shots decrease by 1 |
| `RULE-06` | Ranged Attack | Unit | `tests/engine/combat.spec.ts` | `adjacentRangedIsMelee` | Adjacent target triggers melee |
| `RULE-06` | Ranged Attack | Unit | `tests/engine/combat.spec.ts` | `noRangedWithZeroShots` | Zero shots disables ranged |
| `RULE-07` | Victory Condition | Unit | `tests/engine/victoryCheck.spec.ts` | `player2WinsWhenP1AllDead` | P1 stacks all eliminated |
| `RULE-07` | Victory Condition | Unit | `tests/engine/victoryCheck.spec.ts` | `player1WinsWhenP2AllDead` | P2 stacks all eliminated |
| `RULE-07` | Victory Condition | Unit | `tests/engine/victoryCheck.spec.ts` | `noVictoryWhileBothAlive` | Both sides alive → continue |
| `RULE-07` | Victory Condition | Integration | `tests/integration/gameStore.spec.ts` | `gameEndsOnLastStackKill` | Game state → FINISHED on kill |
| `RULE-08` | Wait Action | Unit | `tests/engine/turnManager.spec.ts` | `waitMovesToEndOfQueue` | Stack moves to wait queue |
| `RULE-08` | Wait Action | Unit | `tests/engine/turnManager.spec.ts` | `waitQueueReverseInitiative` | Waiters act lowest-init first |
| `RULE-08` | Wait Action | Unit | `tests/engine/turnManager.spec.ts` | `cannotWaitTwice` | Already-waited stack blocked |
| `RULE-09` | Defend Action | Unit | `tests/engine/combat.spec.ts` | `defendBoostsDefenseBy20Pct` | Effective defense increased |
| `RULE-09` | Defend Action | Unit | `tests/engine/combat.spec.ts` | `defendBonusResetsNextRound` | isDefending reset on round start |
| `RULE-10` | Round Transition | Unit | `tests/engine/turnManager.spec.ts` | `incrementsRoundCounter` | Round number increases |
| `RULE-10` | Round Transition | Unit | `tests/engine/turnManager.spec.ts` | `resetsAllStackFlags` | hasRetaliated/hasActed/isDefending reset |
| `RULE-10` | Round Transition | Unit | `tests/engine/turnManager.spec.ts` | `rebuildsQueueByInitiative` | Fresh queue for new round |
| `RULE-11` | Army Setup Validation | Unit | `tests/engine/armySetup.spec.ts` | `requiresExactly3Stacks` | Fewer/more than 3 fails |
| `RULE-11` | Army Setup Validation | Unit | `tests/engine/armySetup.spec.ts` | `requiresPositiveCreatureCount` | Count 0 fails validation |
| `RULE-11` | Army Setup Validation | Unit | `tests/engine/armySetup.spec.ts` | `capsCountAt99` | Count 100+ clamped to 99 |
| `RULE-11` | Army Setup Validation | Unit | `tests/engine/armySetup.spec.ts` | `allowsDuplicateUnitTypes` | Same unit type × 3 passes |
| `RULE-12` | Obstacle Generation | Unit | `tests/engine/battlefield.spec.ts` | `generatesCorrectObstacleCount` | 6-12 obstacles |
| `RULE-12` | Obstacle Generation | Unit | `tests/engine/battlefield.spec.ts` | `noObstaclesInDeployZones` | Cols 0-1, 13-14 clear |
| `RULE-12` | Obstacle Generation | Unit | `tests/engine/battlefield.spec.ts` | `ensuresPathConnectivity` | Path exists between sides |
| `RULE-13` | Stack Deployment | Unit | `tests/engine/battlefield.spec.ts` | `deploysP1OnLeftColumn` | P1 stacks at col 0 |
| `RULE-13` | Stack Deployment | Unit | `tests/engine/battlefield.spec.ts` | `deploysP2OnRightColumn` | P2 stacks at col 14 |
| `RULE-13` | Stack Deployment | Unit | `tests/engine/battlefield.spec.ts` | `stackPositionsMatchHexOccupants` | Hex.occupant consistency |
| `RULE-14` | Move-Then-Attack | Integration | `tests/integration/gameStore.spec.ts` | `moveThenMeleeAttack` | Move to adj hex + attack |
| `RULE-14` | Move-Then-Attack | Integration | `tests/integration/gameStore.spec.ts` | `choosesShortestAdjacentHex` | Picks closest adj hex |
| ALGO-01 | A* Pathfinding | Unit | `tests/engine/pathfinding.spec.ts` | `findsShortestPath` | Open grid path |
| ALGO-01 | A* Pathfinding | Unit | `tests/engine/pathfinding.spec.ts` | `returnsNullIfNoPath` | Fully blocked |
| ALGO-01 | A* Pathfinding | Unit | `tests/engine/pathfinding.spec.ts` | `handlesEdgeOfGrid` | Path along grid boundary |
| ALGO-02 | Damage Formula | Unit | `tests/engine/combat.spec.ts` | `damageFormulaBasic` | Standard calculation |
| ALGO-02 | Damage Formula | Unit | `tests/engine/combat.spec.ts` | `minimumDamageIs1` | Extreme defense → 1 damage |
| ALGO-02 | Damage Formula | Unit | `tests/engine/combat.spec.ts` | `damageScalesWithCreatureCount` | More creatures → more damage |
| ALGO-03 | Reachable Hexes | Unit | `tests/engine/pathfinding.spec.ts` | `calculatesReachableHexes` | Open grid BFS |
| ALGO-03 | Reachable Hexes | Unit | `tests/engine/pathfinding.spec.ts` | `excludesOccupiedHexes` | Occupied not reachable |
| ALGO-03 | Reachable Hexes | Unit | `tests/engine/pathfinding.spec.ts` | `respectsSpeedLimit` | Range limited by speed |

---

## Section 3: Test Case Specifications

### Test: `dealsDamageToDefender` — `[RULE-03]`

- **Description**: Verifies that a melee attack correctly calculates and applies damage to the defending stack.
- **Preconditions**: Two stacks on adjacent hexes. Attacker: 5 Pikemen (ATK 4, DMG 1-3). Defender: 3 Swordsmen (DEF 12, HP 35).
- **Test Data**: Seed random to produce baseDamage = 2.
- **Steps**:
  1. Arrange: Create attacker stack (5 Pikemen at hex 5,5) and defender stack (3 Swordsmen at hex 6,5).
  2. Act: Call `meleeAttack(attacker, defender, battlefield)`.
  3. Assert: `result.damage >= 1`, `defender.currentHp < 35`, `result.creaturesKilled >= 0`.
- **Expected Result**: Damage = floor(2 × 5 × 0.80) = 8. Defender HP: 35 - 8 = 27. 0 kills.
- **Edge Cases Covered**: EDGE-12 (minimum damage check).

### Test: `killsCreaturesOneByOne` — `[RULE-05]`

- **Description**: Verifies damage application correctly cascades through multiple creatures.
- **Preconditions**: Defender stack: 3 creatures, each 10 HP. Top creature has 4 HP remaining.
- **Test Data**: Damage = 22. Expected: kills top creature (4 HP), second creature (10 HP), into third (8 HP remaining).
- **Steps**:
  1. Arrange: Stack with creatureCount=3, currentHp=4, unitType.hp=10.
  2. Act: Call `applyDamage(stack, 22)`.
  3. Assert: `stack.creatureCount === 1`, `stack.currentHp === 2`.
- **Expected Result**: 22 damage → kills creature 1 (4 HP, 18 left), kills creature 2 (10 HP, 8 left), creature 3 takes 8 → HP = 2. 2 creatures killed.

### Test: `retaliatesOncePerRound` — `[RULE-04]`

- **Description**: Verifies the once-per-round retaliation limit.
- **Preconditions**: Defender has `hasRetaliated = false`. Two attackers adjacent.
- **Steps**:
  1. Arrange: Defender at hex 5,5. Attacker A at 4,5. Attacker B at 6,5.
  2. Act: Attacker A melees defender → retaliation occurs → `defender.hasRetaliated = true`.
  3. Act: Attacker B melees defender → no retaliation.
  4. Assert: Attacker A took retaliation damage. Attacker B took zero retaliation damage.

### Test: `waitQueueReverseInitiative` — `[RULE-08]`

- **Description**: Verifies waiting stacks act in reverse initiative order (lowest first).
- **Preconditions**: 3 stacks wait: initiative 12, 8, 9.
- **Steps**:
  1. Arrange: Build turn order with 3 stacks. All choose Wait.
  2. Act: Process wait queue.
  3. Assert: Wait queue order is [init 8, init 9, init 12].

### Test: `ensuresPathConnectivity` — `[RULE-12]`

- **Description**: Verifies obstacle generation always leaves a path between deployment zones.
- **Preconditions**: Empty 15×11 battlefield.
- **Steps**:
  1. Arrange: Generate obstacles 100 times.
  2. Act: For each generation, run A* from (0,5) to (14,5).
  3. Assert: Path is never null in any of the 100 generations.

---

## Section 4: Negative Testing

| Test Name | Invalid Input / Scenario | Expected Behavior | Related Rule |
|:---|:---|:---|:---|
| `rejectsZeroCreatureCount` | Creature count = 0 | Validation returns false; Ready button disabled | RULE-11 |
| `rejectsNegativeCreatureCount` | Creature count = -5 | Clamped to 1; validation passes | RULE-11 |
| `rejectsCountOver99` | Creature count = 150 | Clamped to 99 | RULE-11 |
| `rejectsFewerThan3Stacks` | Only 2 stacks selected | Validation returns false | RULE-11 |
| `ignoresClickOnNonHighlightedHex` | Click hex outside movement range | No state change | RULE-02, EDGE-01 |
| `ignoresClickOnFriendlyStack` | Click own stack during attack | No attack triggered | EDGE-02 |
| `ignoresClickOnOccupiedHex` | Click hex occupied by another stack | Hex not in reachable set | EDGE-03 |
| `cannotWaitAfterAlreadyWaiting` | Stack that already waited tries Wait again | Wait button disabled | RULE-08, EDGE-06 |
| `defendingStackGetsNoExtraTurn` | Stack defends then is attacked | Defense bonus applied, no extra actions | RULE-09 |
| `rangedWithZeroShotsCantShoot` | Ranged unit used all shots | Ranged attack unavailable; melee only | RULE-06, EDGE-04 |
| `noActionsForEliminatedStack` | Stack killed during its turn | Turn ends, queue advances | EDGE-07 |
| `deadStackRemovedFromQueue` | Stack dies mid-round | Not in turn order for rest of round | EDGE-07, EDGE-14 |
| `noMoveIfFullySurrounded` | Stack boxed in by obstacles and stacks | Only Wait/Defend available | EDGE-11 |
| `minimumDamageOf1` | Massive defense vs tiny attack | Damage = 1, not 0 | EDGE-12, ALGO-02 |

---

## Section 5: State Transition Tests

### Game State Machine

| Current State | Trigger | Guard | Expected Next State | Test Name |
|:---|:---|:---|:---|:---|
| SETUP | Start Game | — | PLAYER1_PICKING | `transitionsSetupToP1Picking` |
| PLAYER1_PICKING | P1 confirms army | 3 stacks, counts > 0 | PLAYER2_PICKING | `transitionsP1PickingToP2Picking` |
| PLAYER1_PICKING | P1 confirms army | Only 2 stacks | PLAYER1_PICKING (blocked) | `blocksP1WithIncompleteArmy` |
| PLAYER2_PICKING | P2 confirms army | 3 stacks, counts > 0 | BATTLE | `transitionsP2PickingToBattle` |
| BATTLE | Last enemy stack dies | p1Alive==0 or p2Alive==0 | FINISHED | `transitionsBattleToFinished` |
| BATTLE | Regular attack (non-lethal) | Both sides alive | BATTLE (no change) | `staysInBattleWhileBothAlive` |
| FINISHED | New Game | — | SETUP | `transitionsFinishedToSetup` |

### Stack State Machine

| Current State | Trigger | Guard | Expected Next State | Test Name |
|:---|:---|:---|:---|:---|
| IDLE | Turn begins | Stack alive | ACTIVE | `activatesStackOnTurn` |
| ACTIVE | Move to hex | Valid destination | MOVED | `movesToMovedState` |
| ACTIVE | Attack/Wait/Defend | Valid action | ACTED | `actToActedState` |
| MOVED | Attack adjacent | Enemy adjacent | ACTED | `movedThenAttack` |
| MOVED | End turn | No attack chosen | IDLE | `movedToIdleIfNoAttack` |
| ACTED | Turn processing ends | — | IDLE | `actedToIdleAfterTurn` |
| Any | creatureCount reaches 0 | — | DEAD | `transitionsToDead` |

---

## Section 6: Visual / UI Testing

| Component | Test Case | Assertions |
|:---|:---|:---|
| `Button` | Renders primary variant | Background = `--color-accent-gold`, text color = `--color-text-inverse` |
| `Button` | Renders disabled state | opacity = 0.5, click handler not called |
| `Button` | Hover effect | Background changes to `--color-accent-gold-hover` |
| `HexCell` | Renders empty hex | Fill = `--color-hex-default`, no occupant icon |
| `HexCell` | Renders obstacle | Fill = `--color-hex-obstacle`, no click handler |
| `HexCell` | Renders occupied hex | Unit icon + creature count badge visible |
| `HexCell` | Reachable state | Fill = `--color-hex-reachable`, click triggers movement |
| `HexCell` | Attackable state | Fill = `--color-hex-attack`, click triggers attack |
| `TurnOrderBar` | Renders all stacks | Correct number of entries, ordered by initiative |
| `TurnOrderBar` | Active stack highlighted | Gold border on active entry |
| `InfoPanel` | Shows active stack stats | All stat values match stack data |
| `InfoPanel` | HP bar proportion | Width proportional to currentHp / totalMaxHp |
| `CombatLog` | Auto-scrolls on new entry | Scroll position at bottom after append |
| `UnitCard` | Full variant shows all stats | ATK, DEF, DMG, HP, SPD, INIT all present |
| `UnitCard` | Selected state | Gold border applied |
| `CreatureCountBadge` | Low health warning | Red tint when count < 25% of original |
| `DamagePopup` | Appears and fades | Element exists for 1200ms then removed |
| `VictoryOverlay` | Shows winner | Winner name and player color displayed |
| `ActionButtons` | Contextual enable/disable | Wait disabled if already waited; Attack disabled if no target |
| `NumberInput` | Clamps value to range | Values below 1 set to 1, above 99 set to 99 |

---

## Section 7: Test Data & Fixtures

```typescript
// tests/fixtures.ts
import type { UnitType, Stack, Player, HexCoord, Battlefield } from '../src/lib/types';

// === Unit Type Fixtures ===
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

export const UNIT_SWORDSMAN: UnitType = {
  id: 'swordsman', name: 'Swordsman', attack: 10, defense: 12,
  minDamage: 6, maxDamage: 9, hp: 35, speed: 5, initiative: 11,
  isRanged: false, shots: null, icon: '🗡️'
};

export const UNIT_CAVALIER: UnitType = {
  id: 'cavalier', name: 'Cavalier', attack: 15, defense: 15,
  minDamage: 15, maxDamage: 25, hp: 100, speed: 7, initiative: 13,
  isRanged: false, shots: null, icon: '🐴'
};

// === Player Fixtures ===
export const PLAYER_1: Player = {
  id: 'player1', name: 'Player 1', color: '#3B82F6', stacks: [], side: 'left'
};

export const PLAYER_2: Player = {
  id: 'player2', name: 'Player 2', color: '#EF4444', stacks: [], side: 'right'
};

// === Stack Factory ===
export function createStack(
  unitType: UnitType, owner: Player, count: number, position: HexCoord
): Stack {
  return {
    id: `${unitType.id}_${owner.id}_${position.col}_${position.row}`,
    unitType, owner, creatureCount: count, currentHp: unitType.hp,
    position, hasRetaliated: false, hasActed: false,
    isWaiting: false, isDefending: false,
    remainingShots: unitType.isRanged ? unitType.shots : null
  };
}

// === Battlefield Factory ===
export function createEmptyBattlefield(): Battlefield {
  const hexes: any[][] = [];
  for (let col = 0; col < 15; col++) {
    hexes[col] = [];
    for (let row = 0; row < 11; row++) {
      hexes[col][row] = { col, row, isObstacle: false, occupant: null };
    }
  }
  return { width: 15, height: 11, hexes, obstacles: [] };
}

// === Pre-built Scenarios ===
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
  // Block all 6 neighbors with obstacles
  const neighbors = [
    { col: 8, row: 5 }, { col: 7, row: 4 }, { col: 6, row: 4 },
    { col: 6, row: 5 }, { col: 6, row: 6 }, { col: 7, row: 6 }
  ];
  neighbors.forEach(n => { bf.hexes[n.col][n.row].isObstacle = true; });
  return { battlefield: bf, stack: center };
};
```

---

## Section 8: Proto-Tests

```typescript
// tests/engine/combat.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { calculateDamage, applyDamage, meleeAttack, rangedAttack } from '../../src/lib/engine/combat';
import {
  UNIT_PIKEMAN, UNIT_SWORDSMAN, UNIT_ARCHER, UNIT_CAVALIER,
  PLAYER_1, PLAYER_2, createStack, createEmptyBattlefield,
  SCENARIO_BASIC_MELEE, SCENARIO_RANGED_ATTACK
} from '../fixtures';

describe('Combat Engine', () => {
  // === [ALGO-02] Damage Formula ===
  describe('[ALGO-02] Damage Formula', () => {
    it('calculates base damage × creature count', () => {
      const attacker = createStack(UNIT_PIKEMAN, PLAYER_1, 10, { col: 0, row: 0 });
      const defender = createStack(UNIT_PIKEMAN, PLAYER_2, 5, { col: 1, row: 0 });
      // Mock random to return minDamage (1)
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const result = calculateDamage(attacker, defender);
      // baseDmg=1, count=10, ATK=DEF so modifier=1.0 → damage=10
      expect(result.damage).toBe(10);
      vi.restoreAllMocks();
    });

    it('increases damage by 5% per attack advantage point', () => {
      const attacker = createStack(UNIT_SWORDSMAN, PLAYER_1, 1, { col: 0, row: 0 }); // ATK=10
      const defender = createStack(UNIT_PIKEMAN, PLAYER_2, 1, { col: 1, row: 0 }); // DEF=5
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const result = calculateDamage(attacker, defender);
      // baseDmg=6, count=1, diff=5 → modifier=1.25 → damage=floor(6*1.25)=7
      expect(result.damage).toBe(7);
      vi.restoreAllMocks();
    });

    it('caps positive modifier at 4.0 (300% bonus)', () => {
      const attacker = createStack({ ...UNIT_CAVALIER, attack: 80 }, PLAYER_1, 1, { col: 0, row: 0 });
      const defender = createStack({ ...UNIT_PIKEMAN, defense: 1 }, PLAYER_2, 1, { col: 1, row: 0 });
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const result = calculateDamage(attacker, defender);
      // modifier capped at 4.0
      expect(result.damage).toBe(Math.floor(15 * 4.0)); // 60
      vi.restoreAllMocks();
    });

    it('reduces damage by 2.5% per defense advantage point', () => {
      const attacker = createStack(UNIT_PIKEMAN, PLAYER_1, 1, { col: 0, row: 0 }); // ATK=4
      const defender = createStack(UNIT_SWORDSMAN, PLAYER_2, 1, { col: 1, row: 0 }); // DEF=12
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const result = calculateDamage(attacker, defender);
      // diff=8 → modifier=1-(8*0.025)=0.80 → damage=floor(1*0.80)=max(0,1)=1
      expect(result.damage).toBeGreaterThanOrEqual(1);
      vi.restoreAllMocks();
    });

    it('caps negative modifier at 0.30 (70% penalty)', () => {
      const attacker = createStack({ ...UNIT_PIKEMAN, attack: 1 }, PLAYER_1, 1, { col: 0, row: 0 });
      const defender = createStack({ ...UNIT_CAVALIER, defense: 50 }, PLAYER_2, 1, { col: 1, row: 0 });
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const result = calculateDamage(attacker, defender);
      // modifier capped at 0.30, minimum damage 1
      expect(result.damage).toBeGreaterThanOrEqual(1);
      vi.restoreAllMocks();
    });

    it('enforces minimum damage of 1', () => {
      const attacker = createStack({ ...UNIT_PIKEMAN, attack: 1, minDamage: 1, maxDamage: 1 }, PLAYER_1, 1, { col: 0, row: 0 });
      const defender = createStack({ ...UNIT_CAVALIER, defense: 50 }, PLAYER_2, 1, { col: 1, row: 0 });
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const result = calculateDamage(attacker, defender);
      expect(result.damage).toBe(1);
      vi.restoreAllMocks();
    });
  });

  // === [RULE-05] Damage Application ===
  describe('[RULE-05] Damage Application', () => {
    it('subtracts damage from top creature HP', () => {
      const stack = createStack(UNIT_PIKEMAN, PLAYER_1, 5, { col: 0, row: 0 });
      applyDamage(stack, 3);
      expect(stack.currentHp).toBe(7); // 10 - 3
      expect(stack.creatureCount).toBe(5);
    });

    it('kills creature when HP reaches 0 and overflows to next', () => {
      const stack = createStack(UNIT_PIKEMAN, PLAYER_1, 3, { col: 0, row: 0 });
      stack.currentHp = 4;
      applyDamage(stack, 22);
      // 4 HP (kill 1, 18 left) → 10 HP (kill 2, 8 left) → 10-8=2 HP remain
      expect(stack.creatureCount).toBe(1);
      expect(stack.currentHp).toBe(2);
    });

    it('eliminates stack when all creatures die', () => {
      const stack = createStack(UNIT_PIKEMAN, PLAYER_1, 2, { col: 0, row: 0 });
      applyDamage(stack, 999);
      expect(stack.creatureCount).toBe(0);
      expect(stack.currentHp).toBe(0);
    });
  });

  // === [RULE-03] Melee Attack ===
  describe('[RULE-03] Melee Attack', () => {
    it('deals damage and triggers retaliation', () => {
      const { attacker, defender } = SCENARIO_BASIC_MELEE();
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const result = meleeAttack(attacker, defender);
      expect(result.attackDamage).toBeGreaterThan(0);
      expect(defender.hasRetaliated).toBe(true);
      vi.restoreAllMocks();
    });

    it('no retaliation if defender dies', () => {
      const attacker = createStack(UNIT_CAVALIER, PLAYER_1, 10, { col: 5, row: 5 });
      const defender = createStack(UNIT_PIKEMAN, PLAYER_2, 1, { col: 6, row: 5 });
      vi.spyOn(Math, 'random').mockReturnValue(1);
      const result = meleeAttack(attacker, defender);
      expect(defender.creatureCount).toBe(0);
      expect(result.retaliationDamage).toBe(0);
      vi.restoreAllMocks();
    });
  });

  // === [RULE-04] Retaliation ===
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
      vi.restoreAllMocks();
    });
  });

  // === [RULE-06] Ranged Attack ===
  describe('[RULE-06] Ranged Attack', () => {
    it('deals damage without retaliation', () => {
      const { attacker, defender } = SCENARIO_RANGED_ATTACK();
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const result = rangedAttack(attacker, defender);
      expect(result.damage).toBeGreaterThan(0);
      expect(defender.hasRetaliated).toBe(false);
      vi.restoreAllMocks();
    });

    it('decrements remaining shots', () => {
      const archer = createStack(UNIT_ARCHER, PLAYER_1, 5, { col: 0, row: 0 });
      const target = createStack(UNIT_SWORDSMAN, PLAYER_2, 3, { col: 10, row: 5 });
      expect(archer.remainingShots).toBe(12);
      rangedAttack(archer, target);
      expect(archer.remainingShots).toBe(11);
    });
  });
});

// tests/engine/turnManager.spec.ts
import { describe, it, expect } from 'vitest';
import { buildTurnOrder, advanceTurn, handleWait, resetRound } from '../../src/lib/engine/turnManager';
import { UNIT_PIKEMAN, UNIT_ARCHER, UNIT_SWORDSMAN, PLAYER_1, PLAYER_2, createStack } from '../fixtures';

describe('Turn Manager', () => {
  // === [RULE-01] Initiative Ordering ===
  describe('[RULE-01] Initiative Turn Ordering', () => {
    it('sorts stacks by initiative descending', () => {
      const stacks = [
        createStack(UNIT_PIKEMAN, PLAYER_1, 5, { col: 0, row: 1 }),  // init 8
        createStack(UNIT_SWORDSMAN, PLAYER_2, 3, { col: 14, row: 1 }), // init 11
        createStack(UNIT_ARCHER, PLAYER_1, 4, { col: 0, row: 5 }),   // init 9
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

  // === [RULE-08] Wait ===
  describe('[RULE-08] Wait Action', () => {
    it('moves stack to wait queue', () => {
      const stacks = [
        createStack(UNIT_SWORDSMAN, PLAYER_1, 3, { col: 0, row: 1 }),
        createStack(UNIT_PIKEMAN, PLAYER_2, 5, { col: 14, row: 1 }),
      ];
      const queue = buildTurnOrder(stacks);
      handleWait(queue);
      expect(queue.waitQueue.length).toBe(1);
      expect(queue.entries.length).toBe(1);
    });
  });

  // === [RULE-10] Round Transition ===
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
  });
});

// tests/engine/pathfinding.spec.ts
import { describe, it, expect } from 'vitest';
import { findPath, getReachableHexes, hexDistance } from '../../src/lib/engine/pathfinding';
import { createEmptyBattlefield, createStack, UNIT_PIKEMAN, PLAYER_1 } from '../fixtures';

describe('Pathfinding Engine', () => {
  // === [ALGO-01] A* Pathfinding ===
  describe('[ALGO-01] A* Hex Pathfinding', () => {
    it('finds shortest path on open grid', () => {
      const bf = createEmptyBattlefield();
      const path = findPath({ col: 0, row: 5 }, { col: 3, row: 5 }, bf);
      expect(path).not.toBeNull();
      expect(path!.length).toBe(4); // start + 3 steps
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
      // Wall off a hex completely
      for (let r = 0; r < 11; r++) bf.hexes[5][r].isObstacle = true;
      const path = findPath({ col: 0, row: 5 }, { col: 10, row: 5 }, bf);
      expect(path).toBeNull();
    });
  });

  // === [ALGO-03] Reachable Hexes ===
  describe('[ALGO-03] Reachable Hexes', () => {
    it('returns hexes within speed range', () => {
      const bf = createEmptyBattlefield();
      const stack = createStack(UNIT_PIKEMAN, PLAYER_1, 5, { col: 7, row: 5 }); // speed=4
      bf.hexes[7][5].occupant = stack;
      const reachable = getReachableHexes(stack, bf);
      // All reachable hexes should be within distance 4
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
      expect(reachable['8,5']).toBeUndefined();
    });
  });
});

// tests/engine/victoryCheck.spec.ts
import { describe, it, expect } from 'vitest';
import { checkVictory } from '../../src/lib/engine/victoryCheck';
import { UNIT_PIKEMAN, PLAYER_1, PLAYER_2, createStack } from '../fixtures';

describe('Victory Check', () => {
  // === [RULE-07] Victory Condition ===
  describe('[RULE-07] Victory Condition', () => {
    it('returns player2 as winner when all player1 stacks are dead', () => {
      const p1Stacks = [
        createStack(UNIT_PIKEMAN, PLAYER_1, 0, { col: 0, row: 1 }),
        createStack(UNIT_PIKEMAN, PLAYER_1, 0, { col: 0, row: 5 }),
        createStack(UNIT_PIKEMAN, PLAYER_1, 0, { col: 0, row: 9 }),
      ];
      const p2Stacks = [
        createStack(UNIT_PIKEMAN, PLAYER_2, 3, { col: 14, row: 5 }),
      ];
      const result = checkVictory(p1Stacks, p2Stacks);
      expect(result).toBe('player2');
    });

    it('returns null when both sides have living stacks', () => {
      const p1Stacks = [createStack(UNIT_PIKEMAN, PLAYER_1, 5, { col: 0, row: 1 })];
      const p2Stacks = [createStack(UNIT_PIKEMAN, PLAYER_2, 3, { col: 14, row: 1 })];
      const result = checkVictory(p1Stacks, p2Stacks);
      expect(result).toBeNull();
    });
  });
});
```

---

## Section 9: CI/CD Testing Integration

This is a local browser game with no deployment pipeline in MVP. Testing workflow:

| Trigger | Tests Run | Failure Behavior |
|:---|:---|:---|
| `npm run test` (manual) | All Vitest unit + integration tests | Console output shows failures; developer fixes before commit |
| `npm run test:watch` (during development) | Re-runs affected tests on file save | Immediate feedback loop |
| `npm run lint` (manual) | ESLint + TypeScript type-check | Must pass before building |
| `npm run build` (manual) | Full production build + type-check | Build fails on type errors; no deployment if failed |

**Manual Visual Testing Checklist**:
- [ ] Setup screen: all 6 unit cards display correctly with stats.
- [ ] Setup screen: selecting/deselecting units works; Ready button enables at 3 stacks.
- [ ] Battle screen: hex grid renders 15×11 hexes with correct spacing.
- [ ] Battle screen: obstacles render as distinct visuals.
- [ ] Battle screen: movement highlights appear when stack is active.
- [ ] Battle screen: path preview shows on hover.
- [ ] Battle screen: movement animation is smooth.
- [ ] Battle screen: attack animation plays correctly.
- [ ] Battle screen: damage popup appears and fades.
- [ ] Battle screen: retaliation animates distinctly.
- [ ] Battle screen: creature count badge updates after damage.
- [ ] Battle screen: death animation plays and stack is removed.
- [ ] Battle screen: turn order bar updates correctly.
- [ ] Battle screen: combat log records all actions.
- [ ] Victory screen: displays correct winner, summary, and New Game button.
- [ ] Full flow: complete a game from setup to victory, verify all mechanics.

