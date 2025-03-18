import { useGame } from '../../contexts/GameContext';
import './QuestionPanel.css';

function QuestionPanel() {
  const { QUESTIONS, currentQuestion, handleAnswer, lives, score } = useGame();
  const question = QUESTIONS[currentQuestion];

  return (
    <div className="question-panel">
      <div className="question">{question.question}</div>
      <div className="answers">
        {question.answers.map((answer, i) => (
          <button
            key={i}
            className="answer-button"
            onClick={() => handleAnswer(i)}
          >
            {answer}
          </button>
        ))}
      </div>
      <div className="status">
        <div className="lives">
          {Array(lives).fill().map((_, i) => (
            <span key={i} className="heart">♥</span>
          ))}
        </div>
        <div className="score">SCORE: {score}</div>
      </div>
    </div>
  );
}

export default QuestionPanel;