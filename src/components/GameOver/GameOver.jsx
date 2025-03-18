import { useGame } from '../../contexts/GameContext';
import './GameOver.css';

function GameOver() {
  const { score, startGame } = useGame();
  
  return (
    <div className="end-screen">
      <h1 className="title">GAME OVER</h1>
      <div className="score">SCORE: {score}</div>
      <button className="start-button" onClick={startGame}>TRY AGAIN</button>
    </div>
  );
}

export default GameOver;