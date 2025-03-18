import './Laser.css';

function Laser({ x, y }) {
  return (
    <div
      className="laser"
      style={{ left: `${x}%`, bottom: `${y}%` }}
    />
  );
}

export default Laser;