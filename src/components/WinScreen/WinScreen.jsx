import { useGame } from '../../contexts/GameContext';
import './WinScreen.css';

function WinScreen() {
  const { score, startGame } = useGame();

  return (
    <div className="end-screen">
      <h1 className="title flash">CONGRATULATIONS</h1>
      <div className="score">FINAL SCORE: {score}</div>
      <button className="start-button" onClick={startGame}>PLAY AGAIN</button>
    </div>
  );
}

export default WinScreen;