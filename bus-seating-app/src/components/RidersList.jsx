import { useState } from 'react';
import { useDrag } from 'react-dnd';
import './RidersList.css';

const RiderItem = ({ rider, onRemove }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'RIDER',
    item: { rider },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`rider-item ${isDragging ? 'dragging' : ''}`}
    >
      <span className="rider-name-text">{rider}</span>
      <button
        className="remove-btn"
        onClick={() => onRemove(rider)}
        title="Remove rider"
      >
        ×
      </button>
    </div>
  );
};

const RidersList = ({ riders, onAddRider, onRemoveRider }) => {
  const [newRiderName, setNewRiderName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newRiderName.trim()) {
      onAddRider(newRiderName.trim());
      setNewRiderName('');
    }
  };

  return (
    <div className="riders-list-container">
      <h3>Bus Riders</h3>
      <form onSubmit={handleSubmit} className="add-rider-form">
        <input
          type="text"
          value={newRiderName}
          onChange={(e) => setNewRiderName(e.target.value)}
          placeholder="Enter rider name"
          className="rider-input"
        />
        <button type="submit" className="add-btn">
          Add Rider
        </button>
      </form>
      <div className="riders-list">
        {riders.length === 0 ? (
          <p className="empty-message">No riders yet. Add some above!</p>
        ) : (
          riders.map((rider, index) => (
            <RiderItem
              key={index}
              rider={rider}
              onRemove={onRemoveRider}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RidersList;
