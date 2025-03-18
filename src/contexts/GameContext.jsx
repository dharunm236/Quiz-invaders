import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { CONFIG, QUESTIONS } from '../config/gameConfig';
import soundService from '../services/soundService';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(CONFIG.LIVES);
  const [shipPos, setShipPos] = useState(50);
  const [lasers, setLasers] = useState([]);
  const [aliens, setAliens] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [alienDirection, setAlienDirection] = useState(1);
  const [debug, setDebug] = useState('');

  // Initialize sound system
  useEffect(() => {
    soundService.initialize();
  }, []);

  // Initialize aliens grid
  function initializeAliens() {
    const newAliens = [];
    for (let i = 0; i < CONFIG.ALIEN_ROWS; i++) {
      for (let j = 0; j < CONFIG.ALIEN_COLS; j++) {
        newAliens.push({
          id: i * CONFIG.ALIEN_COLS + j,
          alive: true,
          x: j * 12 + 2,
          y: i * 10 + 10
        });
      }
    }
    return newAliens;
  }

  // Put this BEFORE handleKeyDown
  const fireLaser = () => {
    soundService.play('LASER_SHOOT');
    setLasers(prev => [...prev, { x: shipPos, y: 90 }]);
  };

  // Handle keyboard controls
  const handleKeyDown = useCallback((e) => {
    if (gameState !== 'playing') return;
    
    if (e.key === 'ArrowLeft') {
      setShipPos(p => Math.max(0, p - CONFIG.SHIP_SPEED));
    } else if (e.key === 'ArrowRight') {
      setShipPos(p => Math.min(90, p + CONFIG.SHIP_SPEED));
    } else if (e.key === ' ' || e.key === 'Enter') {
      fireLaser();
    }
  }, [gameState, shipPos]); // shipPos is needed instead of fireLaser

  // Move aliens
  /* 
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const interval = setInterval(() => {
      setAliens(prev => {
        const newAliens = prev.map(alien => ({
          ...alien,
          x: alien.x + (alienDirection * 2)
        }));
        
        const edgeReached = newAliens.some(a => a.alive && (a.x > 95 || a.x < 5));
        if (edgeReached) setAlienDirection(d => -d);
        
        return newAliens;
      });
    }, CONFIG.MOVE_INTERVAL);

    return () => clearInterval(interval);
  }, [alienDirection, gameState]); 
  */

  // Handle laser movement
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const moveLasers = () => {
      setLasers(prev => 
        prev.filter(laser => laser.y > 0)
          .map(laser => ({ ...laser, y: laser.y - CONFIG.LASER_SPEED }))
      );
    };

    const interval = setInterval(moveLasers, 16);
    return () => clearInterval(interval);
  }, [gameState]);

  // Check collisions
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    lasers.forEach(laser => {
      const hitAlien = aliens.find(a => 
        a.alive && 
        Math.abs(a.x - laser.x) < 5 && 
        Math.abs(a.y - laser.y) < 5
      );

      if (hitAlien) {
        setAliens(prev => 
          prev.map(a => 
            a.id === hitAlien.id ? { ...a, alive: false } : a
          )
        );
        soundService.play('EXPLOSION');
        setScore(s => s + 100);
        setLasers(prev => prev.filter(l => l !== laser));
      }
    });
  }, [lasers, aliens, gameState]);

  // Handle game state changes
  useEffect(() => {
    if (lives <= 0) {
      soundService.play('GAME_OVER');
      soundService.stopBackgroundMusic();
      setGameState('lost');
    }
    if (aliens.length > 0 && aliens.every(a => !a.alive)) {
      soundService.play('LEVEL_COMPLETE');
      soundService.stopBackgroundMusic();
      setGameState('won');
    }
  }, [lives, aliens]);

  // Event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Game functions
  const startGame = () => {
    console.log("Starting game...");
    
    // Force state updates in a single callback to ensure they happen together
    setGameState('playing');
    
    // Use setTimeout to ensure the state change happens before other updates
    setTimeout(() => {
      setLives(CONFIG.LIVES);
      setAliens(initializeAliens());
      setScore(0);
      setShipPos(50);
      setLasers([]);
      setAlienDirection(1);
      setCurrentQuestion(0);
      setDebug('Game started at ' + new Date().toISOString());
      
      // Start background music
      soundService.stopAll();
      soundService.startBackgroundMusic();
      
      console.log("State updates completed");
    }, 0);
  };

  const handleAnswer = (answerIndex) => {
    if (QUESTIONS[currentQuestion].correct === answerIndex) {
      soundService.play('CORRECT_ANSWER');
      fireLaser();
    } else {
      soundService.play('WRONG_ANSWER');
      setLives(l => l - 1);
    }
    setCurrentQuestion((prev) => (prev + 1) % QUESTIONS.length);
  };

  const value = {
    gameState,
    score,
    lives,
    shipPos,
    lasers,
    aliens,
    currentQuestion,
    startGame,
    handleAnswer,
    QUESTIONS,
    debug  // Add this
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  return useContext(GameContext);
}