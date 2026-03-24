import type { HexCoord, Battlefield, Stack } from '../types';
import { getHexNeighbors, hexDistance, coordToKey, coordsEqual } from '../utils/hexUtils';

export function findPath(
  start: HexCoord,
  goal: HexCoord,
  battlefield: Battlefield,
  allowOccupiedGoal = false
): HexCoord[] | null {
  const openSet: Array<{ coord: HexCoord; fScore: number }> = [];
  const cameFrom = new Map<string, string>();
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const inOpenSet = new Set<string>();

  const startKey = coordToKey(start);
  gScore.set(startKey, 0);
  fScore.set(startKey, hexDistance(start, goal));
  openSet.push({ coord: start, fScore: hexDistance(start, goal) });
  inOpenSet.add(startKey);

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.fScore - b.fScore);
    const current = openSet.shift()!;
    const currentKey = coordToKey(current.coord);
    inOpenSet.delete(currentKey);

    if (coordsEqual(current.coord, goal)) {
      return reconstructPath(cameFrom, current.coord);
    }

    const neighbors = getHexNeighbors(current.coord);
    for (const neighbor of neighbors) {
      const neighborKey = coordToKey(neighbor);
      const hex = battlefield.hexes[neighbor.col]?.[neighbor.row];
      if (!hex) continue;
      if (hex.isObstacle) continue;
      if (hex.occupant !== null && !coordsEqual(neighbor, goal)) continue;
      if (coordsEqual(neighbor, goal) && hex.occupant !== null && !allowOccupiedGoal) continue;

      const tentativeG = (gScore.get(currentKey) ?? Infinity) + 1;
      if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
        cameFrom.set(neighborKey, currentKey);
        gScore.set(neighborKey, tentativeG);
        const f = tentativeG + hexDistance(neighbor, goal);
        fScore.set(neighborKey, f);

        if (!inOpenSet.has(neighborKey)) {
          openSet.push({ coord: neighbor, fScore: f });
          inOpenSet.add(neighborKey);
        }
      }
    }
  }

  return null;
}

function reconstructPath(cameFrom: Map<string, string>, current: HexCoord): HexCoord[] {
  const path: HexCoord[] = [current];
  let currentKey = coordToKey(current);

  while (cameFrom.has(currentKey)) {
    currentKey = cameFrom.get(currentKey)!;
    const [col, row] = currentKey.split(',').map(Number);
    path.unshift({ col, row });
  }

  return path;
}

export function getReachableHexes(
  stack: Stack,
  battlefield: Battlefield
): Map<string, number> {
  const reachable = new Map<string, number>();
  const visited = new Map<string, number>();
  const queue: Array<{ coord: HexCoord; dist: number }> = [];

  queue.push({ coord: stack.position, dist: 0 });
  visited.set(coordToKey(stack.position), 0);

  while (queue.length > 0) {
    const { coord: current, dist } = queue.shift()!;

    if (dist > 0) {
      reachable.set(coordToKey(current), dist);
    }

    if (dist < stack.unitType.speed) {
      const neighbors = getHexNeighbors(current);
      for (const neighbor of neighbors) {
        const neighborKey = coordToKey(neighbor);
        const hex = battlefield.hexes[neighbor.col]?.[neighbor.row];
        if (!hex) continue;
        if (hex.isObstacle) continue;
        if (hex.occupant !== null) continue;
        const existingDist = visited.get(neighborKey);
        if (existingDist !== undefined && existingDist <= dist + 1) continue;

        visited.set(neighborKey, dist + 1);
        queue.push({ coord: neighbor, dist: dist + 1 });
      }
    }
  }

  return reachable;
}

export { hexDistance } from '../utils/hexUtils';
