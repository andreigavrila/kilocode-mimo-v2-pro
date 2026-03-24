import { useGameStore } from '../lib/state/gameStore';
import { isAlive, totalHp } from '../lib/types';

export function InfoPanel() {
  const activeStack = useGameStore((s) => s.activeStack);

  if (!activeStack || !isAlive(activeStack)) {
    return (
      <div className="info-panel">
        <h3>Unit Info</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
          No active unit
        </p>
      </div>
    );
  }

  const stack = activeStack;
  const unit = stack.unitType;
  const maxHp = unit.hp;
  const hpPercent = (stack.currentHp / maxHp) * 100;
  const hpColor = hpPercent > 60 ? 'var(--color-success)' : hpPercent > 25 ? 'var(--color-warning)' : 'var(--color-danger)';

  return (
    <div className="info-panel">
      <h3>Active Unit</h3>
      <div className="stack-icon">{unit.icon}</div>
      <div className="stack-name">{unit.name}</div>
      <div style={{ textAlign: 'center' }}>
        <span className={`player-tag ${stack.owner.id}`}>
          {stack.owner.name}
        </span>
      </div>
      <div className="creature-count-large">
        {stack.creatureCount} creatures
      </div>
      <div className="hp-bar">
        <div
          className="hp-bar-fill"
          style={{
            width: `${hpPercent}%`,
            background: hpColor,
          }}
        />
      </div>
      <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
        HP: {stack.currentHp}/{maxHp} | Total: {totalHp(stack)}
      </div>
      <div className="stat-grid">
        <div className="stat-row">
          <span className="stat-label">ATK</span>
          <span className="stat-value">{unit.attack}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">DEF</span>
          <span className="stat-value">{stack.isDefending ? Math.floor(unit.defense * 1.2) : unit.defense}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">DMG</span>
          <span className="stat-value">{unit.minDamage}-{unit.maxDamage}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">HP</span>
          <span className="stat-value">{unit.hp}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">SPD</span>
          <span className="stat-value">{unit.speed}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">INIT</span>
          <span className="stat-value">{unit.initiative}</span>
        </div>
      </div>
      {unit.isRanged && (
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-success)', marginTop: 8 }}>
          🏹 Shots: {stack.remainingShots}/{unit.shots}
        </div>
      )}
      <div className="status-badges">
        {stack.isDefending && <span className="status-badge active">🛡️ Defending</span>}
        {stack.hasRetaliated && <span className="status-badge">⚔️ Retaliated</span>}
        {stack.isWaiting && <span className="status-badge">⏳ Waiting</span>}
      </div>
    </div>
  );
}
