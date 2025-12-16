import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import './RidersList.css';

const RiderItem = ({ rider, onRemove }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'RIDER',
    item: { rider },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [rider]);

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

const RidersList = ({ riders, onAddRider, onRemoveRider, onReturnRider }) => {
  const [newRiderName, setNewRiderName] = useState('');

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'RIDER',
    drop: (item) => {
      // Only add back if not already in the list
      if (!riders.includes(item.rider)) {
        onReturnRider(item.rider);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [riders, onReturnRider]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newRiderName.trim()) {
      onAddRider(newRiderName.trim());
      setNewRiderName('');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '');

      lines.forEach((line) => {
        const name = line.trim();
        if (name) {
          onAddRider(name);
        }
      });

      // Reset the file input so the same file can be uploaded again if needed
      e.target.value = '';
    };

    reader.readAsText(file);
  };

  return (
    <div
      ref={drop}
      className={`riders-list-container ${isOver ? 'drop-zone-active' : ''}`}
    >
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
      <div className="file-upload-section">
        <label htmlFor="file-upload" className="file-upload-label">
          📄 Upload Rider List
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
          className="file-upload-input"
        />
      </div>
      <div className="riders-list">
        {riders.length === 0 ? (
          <p className="empty-message">No riders yet. Add some above!</p>
        ) : (
          riders.map((rider) => (
            <RiderItem
              key={rider}
              rider={rider}
              onRemove={onRemoveRider}
            />
          ))
        )}
      </div>
      {isOver && <div className="drop-indicator">Drop here to unassign</div>}
    </div>
  );
};

export default RidersList;
