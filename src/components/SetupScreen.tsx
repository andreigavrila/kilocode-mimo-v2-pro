import { useGameStore } from '../lib/state/gameStore';
import { UNIT_ROSTER } from '../lib/data/units';
import type { UnitType } from '../lib/types';

export function SetupScreen() {
  const gameState = useGameStore((s) => s.gameState);
  const player1Selection = useGameStore((s) => s.player1Selection);
  const player2Selection = useGameStore((s) => s.player2Selection);
  const selectUnit = useGameStore((s) => s.selectUnit);
  const setCreatureCount = useGameStore((s) => s.setCreatureCount);
  const deselectUnit = useGameStore((s) => s.deselectUnit);
  const confirmArmy = useGameStore((s) => s.confirmArmy);
  const loadDefaultArmy = useGameStore((s) => s.loadDefaultArmy);
  const startGame = useGameStore((s) => s.startGame);

  const isP1 = gameState === 'PLAYER1_PICKING';
  const currentSelection = isP1 ? player1Selection : player2Selection;
  const playerNumber = isP1 ? 1 : 2;

  if (gameState === 'SETUP') {
    return (
      <div className="setup-screen">
        <h1>⚔️ HoMM3 Battle Sim ⚔️</h1>
        <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', maxWidth: 600 }}>
          A turn-based tactical battle simulator inspired by Heroes of Might and Magic 3.
          Two players take turns commanding armies on a hex battlefield.
        </p>
        <button className="btn btn-primary" onClick={startGame} style={{ fontSize: 18, height: 48, padding: '0 32px' }}>
          ⚔️ Start Battle
        </button>
      </div>
    );
  }

  const selectedUnitIds = new Set(
    currentSelection.slots.filter((s) => s.unitType).map((s) => s.unitType!.id)
  );

  const handleUnitClick = (unitType: UnitType) => {
    const existingSlot = currentSelection.slots.findIndex(
      (s) => s.unitType?.id === unitType.id
    );
    if (existingSlot !== -1) {
      deselectUnit(playerNumber, existingSlot as 0 | 1 | 2);
      return;
    }
    const emptySlot = currentSelection.slots.findIndex((s) => !s.unitType);
    if (emptySlot !== -1) {
      selectUnit(playerNumber, emptySlot as 0 | 1 | 2, unitType);
    }
  };

  return (
    <div className="setup-screen">
      <h1>⚔️ HoMM3 Battle Sim ⚔️</h1>
      <div className={`player-label ${isP1 ? 'player1' : 'player2'}`}>
        Player {playerNumber} — Pick Your Army
      </div>

      <div className="unit-roster">
        {UNIT_ROSTER.map((unit) => (
          <div
            key={unit.id}
            className={`unit-card ${selectedUnitIds.has(unit.id) ? 'selected' : ''}`}
            onClick={() => handleUnitClick(unit)}
          >
            <div className="unit-icon">{unit.icon}</div>
            <div className="unit-name">{unit.name}</div>
            <div className="stats-grid">
              <div className="stat-row">
                <span className="stat-label">ATK</span>
                <span className="stat-value">{unit.attack}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">DEF</span>
                <span className="stat-value">{unit.defense}</span>
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
              <div className="ranged-badge">🏹 Ranged ({unit.shots} shots)</div>
            )}
          </div>
        ))}
      </div>

      <div className="army-section">
        <h3>Your Army</h3>
        <div className="army-slots">
          {currentSelection.slots.map((slot, i) => (
            <div key={i} className={`army-slot ${!slot.unitType ? 'empty' : ''}`}>
              {slot.unitType ? (
                <>
                  <div className="slot-icon">{slot.unitType.icon}</div>
                  <div className="slot-name">{slot.unitType.name}</div>
                  <div className="slot-count">
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={slot.creatureCount}
                      onChange={(e) =>
                        setCreatureCount(playerNumber, i as 0 | 1 | 2, parseInt(e.target.value) || 1)
                      }
                    />
                  </div>
                  <button
                    className="deselect-btn"
                    onClick={() => deselectUnit(playerNumber, i as 0 | 1 | 2)}
                  >
                    ✕ Remove
                  </button>
                </>
              ) : (
                <span>Click a unit to add</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="setup-buttons">
        <button
          className="btn btn-secondary"
          onClick={() => loadDefaultArmy(playerNumber)}
        >
          Default Army
        </button>
        <button
          className="btn btn-primary"
          disabled={!currentSelection.isReady}
          onClick={() => confirmArmy(playerNumber)}
        >
          ✓ Ready
        </button>
      </div>
    </div>
  );
}
