import { useGameStore } from '../lib/state/gameStore';
import { isAlive } from '../lib/types';

export function ActionButtons() {
  const activeStack = useGameStore((s) => s.activeStack);
  const waitAction = useGameStore((s) => s.waitAction);
  const defendAction = useGameStore((s) => s.defendAction);

  const canAct = activeStack && isAlive(activeStack) && !activeStack.hasActed;
  const canWait = canAct && !activeStack.isWaiting;
  const canDefend = canAct;

  return (
    <div className="action-buttons">
      <button
        className="btn btn-secondary"
        disabled={!canWait}
        onClick={waitAction}
      >
        ⏳ Wait
      </button>
      <button
        className="btn btn-secondary"
        disabled={!canDefend}
        onClick={defendAction}
      >
        🛡️ Defend
      </button>
    </div>
  );
}
