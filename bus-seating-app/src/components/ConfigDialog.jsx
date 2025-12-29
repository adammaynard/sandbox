import { useState } from 'react';
import './ConfigDialog.css';

const ConfigDialog = ({ isOpen, onClose, currentBusConfigs, onSave }) => {
  const [busConfigs, setBusConfigs] = useState(currentBusConfigs);

  const handleBusConfigChange = (index, field, value) => {
    const newConfigs = [...busConfigs];
    newConfigs[index] = {
      ...newConfigs[index],
      [field]: parseInt(value) || 1,
    };
    setBusConfigs(newConfigs);
  };

  const handleAddBus = () => {
    setBusConfigs([...busConfigs, { rows: 14, seatsPerBench: 2 }]);
  };

  const handleRemoveBus = (index) => {
    if (busConfigs.length === 1) {
      alert('You must have at least one bus');
      return;
    }
    const newConfigs = busConfigs.filter((_, i) => i !== index);
    setBusConfigs(newConfigs);
  };

  const handleSave = () => {
    // Validate inputs
    for (let i = 0; i < busConfigs.length; i++) {
      const config = busConfigs[i];
      if (config.rows < 1 || config.rows > 30) {
        alert(`Bus ${i + 1}: Rows must be between 1 and 30`);
        return;
      }
      if (config.seatsPerBench < 1 || config.seatsPerBench > 4) {
        alert(`Bus ${i + 1}: Seats per bench must be between 1 and 4`);
        return;
      }
    }

    // Check if configuration changed
    const hasChanges = JSON.stringify(busConfigs) !== JSON.stringify(currentBusConfigs);

    if (hasChanges) {
      const confirmMessage =
        'Changing configuration will reset all bus seat assignments. Continue?';
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }

    onSave(busConfigs);
    onClose();
  };

  const handleCancel = () => {
    // Reset to current values
    setBusConfigs(currentBusConfigs);
    onClose();
  };

  if (!isOpen) return null;

  const totalSeats = busConfigs.reduce(
    (sum, config) => sum + config.rows * 2 * config.seatsPerBench,
    0
  );

  return (
    <div className="dialog-overlay" onClick={handleCancel}>
      <div className="dialog-content bus-config-dialog" onClick={(e) => e.stopPropagation()}>
        <h2>Bus Configuration</h2>

        <div className="config-form">
          <div className="bus-configs-list">
            {busConfigs.map((config, index) => (
              <div key={index} className="bus-config-item">
                <div className="bus-config-header">
                  <h3>Bus {index + 1}</h3>
                  <button
                    className="remove-bus-btn"
                    onClick={() => handleRemoveBus(index)}
                    title="Remove this bus"
                  >
                    ×
                  </button>
                </div>

                <div className="bus-config-fields">
                  <div className="config-field-inline">
                    <label>Rows:</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={config.rows}
                      onChange={(e) => handleBusConfigChange(index, 'rows', e.target.value)}
                    />
                  </div>

                  <div className="config-field-inline">
                    <label>Seats/Bench:</label>
                    <input
                      type="number"
                      min="1"
                      max="4"
                      value={config.seatsPerBench}
                      onChange={(e) =>
                        handleBusConfigChange(index, 'seatsPerBench', e.target.value)
                      }
                    />
                  </div>

                  <div className="bus-total-seats">
                    Total: {config.rows * 2 * config.seatsPerBench} seats
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="add-bus-btn" onClick={handleAddBus}>
            + Add Bus
          </button>

          <div className="config-summary">
            <strong>Total buses:</strong> {busConfigs.length}
            <br />
            <strong>Total seats across all buses:</strong> {totalSeats}
            <br />
            <span className="field-hint">Always 2 benches per row (left and right)</span>
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
