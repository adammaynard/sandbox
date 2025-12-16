import { useDrop, useDrag } from 'react-dnd';
import './Seat.css';

const Seat = ({ rider, onDrop, busId, rowIndex, benchIndex, seatIndex }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'RIDER',
    drop: (item) => onDrop(item.rider, busId, rowIndex, benchIndex, seatIndex),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'RIDER',
    item: { rider },
    canDrag: !!rider, // Only allow dragging if seat is occupied
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [rider]);

  // Combine drag and drop refs
  const combinedRef = (node) => {
    drag(node);
    drop(node);
  };

  return (
    <div
      ref={combinedRef}
      className={`seat ${rider ? 'occupied' : 'empty'} ${isOver ? 'hover' : ''} ${isDragging ? 'dragging' : ''}`}
      title={rider || 'Empty seat'}
    >
      {rider && <span className="rider-name">{rider}</span>}
    </div>
  );
};

export default Seat;
