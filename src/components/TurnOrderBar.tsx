import { useGameStore } from '../lib/state/gameStore';
import { isAlive } from '../lib/types';

export function TurnOrderBar() {
  const turnOrder = useGameStore((s) => s.turnOrder);
  const activeStack = useGameStore((s) => s.activeStack);
  const currentRound = useGameStore((s) => s.currentRound);

  return (
    <div className="battle-header">
      <div className="player-banner player1">
        Player 1
      </div>
      <div className="turn-order-bar">
        {turnOrder.entries.map((stack) => (
          <div
            key={stack.id}
            className={`turn-order-entry ${stack.owner.id === 'player1' ? 'player1-owned' : 'player2-owned'} ${stack === activeStack ? 'active' : ''}`}
          >
            {stack.unitType.icon}
            {isAlive(stack) && (
              <span className="entry-count">{stack.creatureCount}</span>
            )}
          </div>
        ))}
      </div>
      <div className="round-counter">Round {currentRound}</div>
      <div className="player-banner player2">
        Player 2
      </div>
    </div>
  );
}
