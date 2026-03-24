import { HexGrid } from './HexGrid';
import { TurnOrderBar } from './TurnOrderBar';
import { InfoPanel } from './InfoPanel';
import { ActionButtons } from './ActionButtons';
import { CombatLog } from './CombatLog';

export function BattleScreen() {
  return (
    <div className="battle-screen">
      <TurnOrderBar />
      <InfoPanel />
      <HexGrid />
      <CombatLog />
      <ActionButtons />
    </div>
  );
}
