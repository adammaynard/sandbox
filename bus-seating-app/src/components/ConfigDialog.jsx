import { useState } from 'react';
import './ConfigDialog.css';

const ConfigDialog = ({ isOpen, onClose, currentConfig, onSave }) => {
  const [numBuses, setNumBuses] = useState(currentConfig.numBuses);
  const [rowsPerBus, setRowsPerBus] = useState(currentConfig.rowsPerBus);
  const [seatsPerBench, setSeatsPerBench] = useState(currentConfig.seatsPerBench);

  const handleSave = () => {
    // Validate inputs
    if (numBuses < 1 || numBuses > 10) {
      alert('Number of buses must be between 1 and 10');
      return;
    }
    if (rowsPerBus < 1 || rowsPerBus > 30) {
      alert('Rows per bus must be between 1 and 30');
      return;
    }
    if (seatsPerBench < 1 || seatsPerBench > 4) {
      alert('Seats per bench must be between 1 and 4');
      return;
    }

    const hasChanges =
      numBuses !== currentConfig.numBuses ||
      rowsPerBus !== currentConfig.rowsPerBus ||
      seatsPerBench !== currentConfig.seatsPerBench;

    if (hasChanges) {
      const confirmMessage =
        'Changing configuration will reset all bus seat assignments. Continue?';
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }

    onSave({ numBuses, rowsPerBus, seatsPerBench });
    onClose();
  };

  const handleCancel = () => {
    // Reset to current values
    setNumBuses(currentConfig.numBuses);
    setRowsPerBus(currentConfig.rowsPerBus);
    setSeatsPerBench(currentConfig.seatsPerBench);
    onClose();
  };

  if (!isOpen) return null;

  const totalSeatsPerBus = rowsPerBus * 2 * seatsPerBench;

  return (
    <div className="dialog-overlay" onClick={handleCancel}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <h2>Bus Configuration</h2>

        <div className="config-form">
          <div className="config-field">
            <label htmlFor="numBuses">Number of Buses:</label>
            <input
              id="numBuses"
              type="number"
              min="1"
              max="10"
              value={numBuses}
              onChange={(e) => setNumBuses(parseInt(e.target.value) || 1)}
            />
            <span className="field-hint">1-10 buses</span>
          </div>

          <div className="config-field">
            <label htmlFor="rowsPerBus">Rows per Bus:</label>
            <input
              id="rowsPerBus"
              type="number"
              min="1"
              max="30"
              value={rowsPerBus}
              onChange={(e) => setRowsPerBus(parseInt(e.target.value) || 1)}
            />
            <span className="field-hint">1-30 rows (always 2 benches per row)</span>
          </div>

          <div className="config-field">
            <label htmlFor="seatsPerBench">Seats per Bench:</label>
            <input
              id="seatsPerBench"
              type="number"
              min="1"
              max="4"
              value={seatsPerBench}
              onChange={(e) => setSeatsPerBench(parseInt(e.target.value) || 1)}
            />
            <span className="field-hint">1-4 seats</span>
          </div>

          <div className="config-summary">
            <strong>Total seats per bus:</strong> {totalSeatsPerBus}
            <br />
            <strong>Total seats across all buses:</strong> {totalSeatsPerBus * numBuses}
          </div>
        </div>

        <div className="dialog-actions">
          <button className="dialog-btn cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="dialog-btn save-btn" onClick={handleSave}>
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigDialog;
