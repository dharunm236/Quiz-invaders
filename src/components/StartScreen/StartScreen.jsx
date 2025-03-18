import { useGame } from '../../contexts/GameContext';
import './StartScreen.css';

function StartScreen() {
  const { startGame, gameState, debug } = useGame();

  console.log("StartScreen rendering, gameState:", gameState);

  const handleStartClick = () => {
    console.log("Start button clicked");
    startGame();
    console.log("After startGame call");
  };

  return (
    <div className="start-screen">
      <h1 className="title">QUIZ INVADERS</h1>
      <button className="start-button" onClick={handleStartClick}>
        PRESS START
      </button>
      <div className="controller"></div>
      
      {/* Debug info */}
      <div style={{ position: 'absolute', bottom: 10, left: 10, fontSize: '10px' }}>
        State: {gameState}, Debug: {debug}
      </div>
    </div>
  );
}

export default StartScreen;