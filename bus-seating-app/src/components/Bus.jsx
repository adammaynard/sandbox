import Row from './Row';
import './Bus.css';

const Bus = ({ busId, rows, onDrop, availableSeats, totalSeats }) => {
  return (
    <div className="bus-container">
      <div className="bus-header">
        <h3>Bus {busId}</h3>
        <div className="seat-counter">
          {availableSeats}/{totalSeats} seats available
        </div>
      </div>
      <div className="bus">
        <div className="bus-front">FRONT</div>
        <div className="rows-container">
          {rows.map((benches, rowIndex) => (
            <Row
              key={rowIndex}
              benches={benches}
              onDrop={onDrop}
              busId={busId}
              rowIndex={rowIndex}
            />
          ))}
        </div>
        <div className="bus-back">BACK</div>
      </div>
    </div>
  );
};

export default Bus;
