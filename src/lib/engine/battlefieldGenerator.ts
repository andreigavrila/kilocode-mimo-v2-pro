import type { Battlefield, HexCoord, Player } from '../types';
import { findPath } from './pathfinding';

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

export function generateObstacles(battlefield: Battlefield): void {
  const deployCols = new Set([0, 1, 13, 14]);
  let attempts = 0;

  while (attempts < 100) {
    for (const obs of battlefield.obstacles) {
      battlefield.hexes[obs.col][obs.row].isObstacle = false;
    }
    battlefield.obstacles = [];

    const count = Math.floor(Math.random() * 7) + 6;
    const candidates: HexCoord[] = [];

    for (let col = 2; col <= 12; col++) {
      for (let row = 0; row < 11; row++) {
        if (!deployCols.has(col)) {
          candidates.push({ col, row });
        }
      }
    }

    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    const selected = candidates.slice(0, count);
    for (const coord of selected) {
      battlefield.hexes[coord.col][coord.row].isObstacle = true;
      battlefield.obstacles.push(coord);
    }

    const path = findPath({ col: 0, row: 5 }, { col: 14, row: 5 }, battlefield);
    if (path !== null) {
      return;
    }

    attempts++;
  }
}

export function deployStacks(
  player1: Player,
  player2: Player,
  battlefield: Battlefield
): void {
  const p1Rows = [1, 5, 9];
  const p2Rows = [1, 5, 9];

  for (let i = 0; i < 3; i++) {
    const stack = player1.stacks[i];
    const pos = { col: 0, row: p1Rows[i] };
    stack.position = pos;
    battlefield.hexes[pos.col][pos.row].occupant = stack;
  }

  for (let i = 0; i < 3; i++) {
    const stack = player2.stacks[i];
    const pos = { col: 14, row: p2Rows[i] };
    stack.position = pos;
    battlefield.hexes[pos.col][pos.row].occupant = stack;
  }
}
