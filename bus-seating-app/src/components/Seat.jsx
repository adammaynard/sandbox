import { useDrop } from 'react-dnd';
import './Seat.css';

const Seat = ({ rider, onDrop, busId, rowIndex, benchIndex, seatIndex }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'RIDER',
    drop: (item) => onDrop(item.rider, busId, rowIndex, benchIndex, seatIndex),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`seat ${rider ? 'occupied' : 'empty'} ${isOver ? 'hover' : ''}`}
      title={rider || 'Empty seat'}
    >
      {rider && <span className="rider-name">{rider}</span>}
    </div>
  );
};

export default Seat;
