import Seat from './Seat';
import './Bench.css';

const Bench = ({ seats, onDrop, busId, rowIndex, benchIndex }) => {
  return (
    <div className="bench">
      {seats.map((rider, seatIndex) => (
        <Seat
          key={seatIndex}
          rider={rider}
          onDrop={onDrop}
          busId={busId}
          rowIndex={rowIndex}
          benchIndex={benchIndex}
          seatIndex={seatIndex}
        />
      ))}
    </div>
  );
};

export default Bench;
