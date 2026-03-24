import { useEffect, useRef } from 'react';
import { useGameStore } from '../lib/state/gameStore';
import { ActionType } from '../lib/types';

export function CombatLog() {
  const combatLog = useGameStore((s) => s.combatLog);
  const entriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (entriesRef.current) {
      entriesRef.current.scrollTop = entriesRef.current.scrollHeight;
    }
  }, [combatLog.length]);

  const getEntryClass = (actionType: ActionType): string => {
    switch (actionType) {
      case ActionType.MELEE_ATTACK:
      case ActionType.RANGED_ATTACK:
        return 'damage';
      case ActionType.RETALIATION:
        return 'damage';
      case ActionType.DEATH:
        return 'kill';
      case ActionType.MOVE:
        return 'movement';
      case ActionType.DEFEND:
        return 'defend';
      case ActionType.WAIT:
        return 'wait';
      default:
        return '';
    }
  };

  let lastRound = 0;
  const entries: React.ReactNode[] = [];

  for (const entry of combatLog) {
    if (entry.round !== lastRound) {
      entries.push(
        <div key={`round-${entry.round}`} className="round-separator">
          — Round {entry.round} —
        </div>
      );
      lastRound = entry.round;
    }
    entries.push(
      <div key={entry.actorStackId + entry.actionType + entry.message.slice(0, 20)} className={`combat-log-entry ${getEntryClass(entry.actionType)}`}>
        {entry.message}
      </div>
    );
  }

  return (
    <div className="combat-log">
      <h3>Combat Log</h3>
      <div className="combat-log-entries" ref={entriesRef}>
        {entries.length === 0 && (
          <div className="combat-log-entry" style={{ fontStyle: 'italic' }}>
            Battle has not started yet...
          </div>
        )}
        {entries}
      </div>
    </div>
  );
}
