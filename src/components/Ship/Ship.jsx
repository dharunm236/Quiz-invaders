import './Ship.css';

function Ship({ position }) {
  return (
    <div 
      className="ship"
      style={{ left: `${position}%` }}
    />
  );
}

export default Ship;