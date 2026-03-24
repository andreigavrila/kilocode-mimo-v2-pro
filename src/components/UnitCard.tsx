import type { UnitType } from '../lib/types';

interface UnitCardProps {
  unitType: UnitType;
  variant?: 'full' | 'compact' | 'mini';
  selected?: boolean;
  onClick?: () => void;
}

export function UnitCard({ unitType, variant = 'full', selected = false, onClick }: UnitCardProps) {
  if (variant === 'mini') {
    return (
      <div
        className={`unit-card mini ${selected ? 'selected' : ''}`}
        onClick={onClick}
        style={{ padding: '4px', minWidth: 'auto', cursor: onClick ? 'pointer' : 'default' }}
      >
        <div className="unit-icon">{unitType.icon}</div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={`unit-card compact ${selected ? 'selected' : ''}`}
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        <div className="unit-icon">{unitType.icon}</div>
        <div className="unit-name">{unitType.name}</div>
      </div>
    );
  }

  return (
    <div
      className={`unit-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="unit-icon">{unitType.icon}</div>
      <div className="unit-name">{unitType.name}</div>
      <div className="stats-grid">
        <div className="stat-row">
          <span className="stat-label">ATK</span>
          <span className="stat-value">{unitType.attack}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">DEF</span>
          <span className="stat-value">{unitType.defense}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">DMG</span>
          <span className="stat-value">{unitType.minDamage}-{unitType.maxDamage}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">HP</span>
          <span className="stat-value">{unitType.hp}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">SPD</span>
          <span className="stat-value">{unitType.speed}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">INIT</span>
          <span className="stat-value">{unitType.initiative}</span>
        </div>
      </div>
      {unitType.isRanged && (
        <div className="ranged-badge">🏹 Ranged ({unitType.shots} shots)</div>
      )}
    </div>
  );
}
