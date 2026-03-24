import { coordToKey, isAlive } from '../lib/types';
import { useGameStore } from '../lib/state/gameStore';

const HEX_WIDTH = 50;
const HEX_HEIGHT = 43;
const COL_SPACING = HEX_WIDTH * 0.75;
const ROW_SPACING = HEX_HEIGHT;

function hexPoints(cx: number, cy: number): string {
  const w = HEX_WIDTH / 2;
  const h = HEX_HEIGHT / 2;
  return [
    `${cx},${cy - h}`,
    `${cx + w},${cy - h / 2}`,
    `${cx + w},${cy + h / 2}`,
    `${cx},${cy + h}`,
    `${cx - w},${cy + h / 2}`,
    `${cx - w},${cy - h / 2}`,
  ].join(' ');
}

export function HexGrid() {
  const battlefield = useGameStore((s) => s.battlefield);
  const activeStack = useGameStore((s) => s.activeStack);
  const highlightedHexes = useGameStore((s) => s.highlightedHexes);
  const clickHex = useGameStore((s) => s.clickHex);
  const hoverHex = useGameStore((s) => s.hoverHex);

  const gridWidth = 15 * COL_SPACING + HEX_WIDTH;
  const gridHeight = 11 * ROW_SPACING + HEX_HEIGHT * 0.5;

  return (
    <div className="hex-grid-container">
      <svg width={gridWidth} height={gridHeight} viewBox={`0 0 ${gridWidth} ${gridHeight}`}>
        {battlefield.hexes.map((col, colIdx) =>
          col.map((hex, rowIdx) => {
            const cx = colIdx * COL_SPACING + HEX_WIDTH / 2;
            const rowOffset = colIdx % 2 === 1 ? ROW_SPACING / 2 : 0;
            const cy = rowIdx * ROW_SPACING + HEX_HEIGHT / 2 + rowOffset;

            const key = coordToKey({ col: colIdx, row: rowIdx });
            const highlight = highlightedHexes[key];
            const isActive = activeStack && hex.occupant === activeStack;
            const occupant = hex.occupant;

            let fill = 'var(--color-hex-default)';
            let stroke = 'var(--color-hex-border)';
            let className = 'hex-cell';

            if (hex.isObstacle) {
              fill = 'var(--color-hex-obstacle)';
              stroke = '#252535';
              className += ' obstacle';
            } else if (isActive) {
              fill = 'var(--color-hex-active)';
              stroke = 'var(--color-accent-gold)';
              className += ' active-stack';
            } else if (highlight === 'reachable') {
              fill = 'var(--color-hex-reachable)';
              stroke = 'var(--color-hex-reachable-border)';
              className += ' reachable';
            } else if (highlight === 'attack') {
              fill = 'var(--color-hex-attack)';
              stroke = 'var(--color-hex-attack-border)';
            } else if (highlight === 'path') {
              fill = 'var(--color-hex-path)';
              stroke = 'var(--color-hex-path)';
            }

            if (occupant && isAlive(occupant) && !isActive) {
              fill = occupant.owner.id === 'player1'
                ? 'var(--color-player1-dim)'
                : 'var(--color-player2-dim)';
              stroke = occupant.owner.id === 'player1'
                ? 'var(--color-player1)'
                : 'var(--color-player2)';
            }

            return (
              <g key={`${colIdx}-${rowIdx}`}>
                <polygon
                  points={hexPoints(cx, cy)}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isActive ? 2 : 1}
                  className={className}
                  onClick={() => clickHex({ col: colIdx, row: rowIdx })}
                  onMouseEnter={() => hoverHex({ col: colIdx, row: rowIdx })}
                  onMouseLeave={() => hoverHex(null)}
                />
                {occupant && isAlive(occupant) && (
                  <>
                    <text
                      x={cx}
                      y={cy - 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="unit-icon-text"
                    >
                      {occupant.unitType.icon}
                    </text>
                    <text
                      x={cx + 14}
                      y={cy + 14}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      className="creature-count-text"
                    >
                      {occupant.creatureCount}
                    </text>
                  </>
                )}
                {hex.isObstacle && (
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="16"
                    fill="#444"
                  >
                    🪨
                  </text>
                )}
              </g>
            );
          })
        )}
      </svg>
    </div>
  );
}
