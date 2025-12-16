import Bench from './Bench';
import './Row.css';

const Row = ({ benches, onDrop, busId, rowIndex }) => {
  return (
    <div className="row">
      <span className="row-number">{rowIndex + 1}</span>
      <div className="benches-container">
        {benches.map((seats, benchIndex) => (
          <Bench
            key={benchIndex}
            seats={seats}
            onDrop={onDrop}
            busId={busId}
            rowIndex={rowIndex}
            benchIndex={benchIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default Row;
