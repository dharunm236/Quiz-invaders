import './Alien.css';

function Alien({ x, y }) {
  return (
    <div 
      className="alien"
      style={{ left: `${x}%`, top: `${y}%` }}
    />
  );
}

export default Alien;