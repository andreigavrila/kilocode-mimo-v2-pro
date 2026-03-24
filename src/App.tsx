import { useGameStore } from './lib/state/gameStore';
import { GameState } from './lib/types';
import { SetupScreen } from './components/SetupScreen';
import { BattleScreen } from './components/BattleScreen';
import { VictoryScreen } from './components/VictoryScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import './app.css';

function App() {
  const gameState = useGameStore((s) => s.gameState);

  return (
    <ErrorBoundary>
      {(gameState === GameState.SETUP ||
        gameState === GameState.PLAYER1_PICKING ||
        gameState === GameState.PLAYER2_PICKING) && <SetupScreen />}
      {gameState === GameState.BATTLE && <BattleScreen />}
      {gameState === GameState.FINISHED && (
        <>
          <BattleScreen />
          <VictoryScreen />
        </>
      )}
    </ErrorBoundary>
  );
}

export default App;
