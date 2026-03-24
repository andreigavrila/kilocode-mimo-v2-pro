import type { HexCoord } from '../types';

export function offsetToCube(hex: HexCoord): { x: number; y: number; z: number } {
  const x = hex.col - (hex.row - (hex.row & 1)) / 2;
  const z = hex.row;
  const y = -x - z;
  return { x, y, z };
}

export function cubeToOffset(cube: { x: number; y: number; z: number }): HexCoord {
  const col = cube.x + (cube.z - (cube.z & 1)) / 2;
  const row = cube.z;
  return { col, row };
}

export function hexDistance(a: HexCoord, b: HexCoord): number {
  const ac = offsetToCube(a);
  const bc = offsetToCube(b);
  return Math.max(
    Math.abs(ac.x - bc.x),
    Math.abs(ac.y - bc.y),
    Math.abs(ac.z - bc.z)
  );
}

export function getHexNeighbors(hex: HexCoord): HexCoord[] {
  const directions =
    hex.row & 1
      ? [
          { dc: 1, dr: 0 },
          { dc: 1, dr: -1 },
          { dc: 0, dr: -1 },
          { dc: -1, dr: 0 },
          { dc: 0, dr: 1 },
          { dc: 1, dr: 1 },
        ]
      : [
          { dc: 1, dr: 0 },
          { dc: 0, dr: -1 },
          { dc: -1, dr: -1 },
          { dc: -1, dr: 0 },
          { dc: -1, dr: 1 },
          { dc: 0, dr: 1 },
        ];

  return directions
    .map(({ dc, dr }) => ({ col: hex.col + dc, row: hex.row + dr }))
    .filter((n) => n.col >= 0 && n.col < 15 && n.row >= 0 && n.row < 11);
}

export function coordToKey(coord: HexCoord): string {
  return `${coord.col},${coord.row}`;
}

export function keyToCoord(key: string): HexCoord {
  const [col, row] = key.split(',').map(Number);
  return { col, row };
}

export function coordsEqual(a: HexCoord, b: HexCoord): boolean {
  return a.col === b.col && a.row === b.row;
}

export function areNeighbors(a: HexCoord, b: HexCoord): boolean {
  const neighbors = getHexNeighbors(a);
  return neighbors.some((n) => coordsEqual(n, b));
}
