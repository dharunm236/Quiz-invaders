import { useState, useEffect } from 'react';
import { GameProvider, useGame } from './contexts/GameContext';
import StartScreen from './components/StartScreen/StartScreen';
import GameScreen from './components/GameScreen/GameScreen';
import WinScreen from './components/WinScreen/WinScreen';
import GameOver from './components/GameOver/GameOver';
import MuteButton from './components/MuteButton/MuteButton';
import TVFrame from './assets/TV-game.png'; // Import the image
import './App.css';

function GameContent() {
  const { gameState } = useGame();
  const [, forceUpdate] = useState();
  
  // Force re-render when gameState changes
  useEffect(() => {
    const timer = setTimeout(() => forceUpdate({}), 100);
    return () => clearTimeout(timer);
  }, [gameState]);
  

  return (
    <div className={`crt-screen ${gameState === 'playing' ? 'game-active' : ''}`}>
      <MuteButton />
      {gameState === 'start' && <StartScreen />}
      {gameState === 'playing' && <GameScreen />}
      {gameState === 'won' && <WinScreen />}
      {gameState === 'lost' && <GameOver />}
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <div className="tv-container">
        <div 
          className="tv-overlay" 
          style={{ backgroundImage: `url(${TVFrame})` }}
        ></div>
        <GameContent />
      </div>
    </GameProvider>
  );
}

export default App;