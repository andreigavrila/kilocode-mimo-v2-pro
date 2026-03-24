import { useGameStore } from '../lib/state/gameStore';

export function VictoryScreen() {
  const battleSummary = useGameStore((s) => s.battleSummary);
  const newGame = useGameStore((s) => s.newGame);

  if (!battleSummary) return null;

  const { winner, totalRounds, survivingStacks, totalDamageDealt, totalCreaturesKilled } = battleSummary;

  return (
    <div className="victory-overlay">
      <div className="victory-card">
        <h2>⚔️ VICTORY! ⚔️</h2>
        <div className="winner-name" style={{ color: winner.color }}>
          {winner.name} wins the battle!
        </div>

        <div className="survivors-list">
          <h4>Surviving Forces</h4>
          {survivingStacks.length === 0 && (
            <div className="survivor-item">No survivors</div>
          )}
          {survivingStacks.map((s, i) => (
            <div key={i} className="survivor-item">
              {s.unitType.icon} {s.unitType.name} × {s.remainingCreatures} (HP: {s.remainingHp}/{s.unitType.hp})
            </div>
          ))}
        </div>

        <dl className="battle-stats">
          <dt>Battle Duration</dt>
          <dd>{totalRounds} rounds</dd>
          <dt>Total Damage</dt>
          <dd>P1: {totalDamageDealt.player1} | P2: {totalDamageDealt.player2}</dd>
          <dt>Creatures Killed</dt>
          <dd>P1: {totalCreaturesKilled.player1} | P2: {totalCreaturesKilled.player2}</dd>
        </dl>

        <button className="btn btn-primary" onClick={newGame} style={{ fontSize: 16, height: 44, padding: '0 32px' }}>
          ⚔️ New Game
        </button>
      </div>
    </div>
  );
}
