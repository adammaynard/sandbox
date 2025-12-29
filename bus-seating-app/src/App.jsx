import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Bus from './components/Bus';
import RidersList from './components/RidersList';
import PrintView from './components/PrintView';
import ConfigDialog from './components/ConfigDialog';
import './App.css';

const DEFAULT_BUS_CONFIGS = [
  { rows: 14, seatsPerBench: 2 },
  { rows: 14, seatsPerBench: 2 },
];

const BENCHES_PER_ROW = 2; // This remains constant

function App() {
  const [busConfigs, setBusConfigs] = useState(DEFAULT_BUS_CONFIGS);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);

  // Initialize empty bus based on configuration
  const createEmptyBus = (rows, seatsPerBench) =>
    Array(rows)
      .fill(null)
      .map(() =>
        Array(BENCHES_PER_ROW)
          .fill(null)
          .map(() => Array(seatsPerBench).fill(null))
      );

  const createEmptyBusesFromConfigs = (configs) =>
    configs.map((config) => createEmptyBus(config.rows, config.seatsPerBench));

  const [buses, setBuses] = useState(() =>
    createEmptyBusesFromConfigs(busConfigs)
  );
  const [riders, setRiders] = useState([
    'Alice Johnson',
    'Bob Smith',
    'Charlie Brown',
    'Diana Prince',
    'Eve Adams',
    'Frank Miller',
    'Grace Lee',
    'Henry Davis',
  ]);

  const handleAddRider = (name) => {
    setRiders((prevRiders) => {
      if (!prevRiders.includes(name)) {
        return [...prevRiders, name];
      }
      return prevRiders;
    });
  };

  const handleRemoveRider = (name) => {
    // Remove from riders list
    setRiders((prevRiders) => prevRiders.filter((r) => r !== name));

    // Remove from all buses
    setBuses((prevBuses) =>
      prevBuses.map((bus) => removeRiderFromBus(bus, name))
    );
  };

  const removeRiderFromBus = (bus, riderName) => {
    return bus.map((row) =>
      row.map((bench) =>
        bench.map((seat) => (seat === riderName ? null : seat))
      )
    );
  };

  const handleDrop = (riderName, busIndex, rowIndex, benchIndex, seatIndex) => {
    setBuses((prevBuses) => {
      // Check if target seat is occupied
      if (prevBuses[busIndex][rowIndex][benchIndex][seatIndex]) {
        return prevBuses; // Seat occupied, no change
      }

      // Remove rider from all buses first
      const cleanedBuses = prevBuses.map((bus) => removeRiderFromBus(bus, riderName));

      // Update the specific bus with the new rider
      const updatedBuses = [...cleanedBuses];
      const updatedBus = cleanedBuses[busIndex].map((row) =>
        row.map((bench) => [...bench])
      );
      updatedBus[rowIndex][benchIndex][seatIndex] = riderName;
      updatedBuses[busIndex] = updatedBus;

      return updatedBuses;
    });

    // Remove rider from the list when assigned to a seat
    setRiders((prevRiders) => prevRiders.filter((r) => r !== riderName));
  };

  const handleReturnRider = (riderName) => {
    // Add rider back to the list
    setRiders((prevRiders) => {
      if (!prevRiders.includes(riderName)) {
        return [...prevRiders, riderName];
      }
      return prevRiders;
    });

    // Remove rider from all buses
    setBuses((prevBuses) =>
      prevBuses.map((bus) => removeRiderFromBus(bus, riderName))
    );
  };

  const handleConfigSave = (newBusConfigs) => {
    // Collect all riders from current buses first
    const allRiders = [];
    buses.forEach((bus) => {
      bus.forEach((row) => {
        row.forEach((bench) => {
          bench.forEach((seat) => {
            if (seat) allRiders.push(seat);
          });
        });
      });
    });

    // Update config and reset buses
    setBusConfigs(newBusConfigs);
    setBuses(createEmptyBusesFromConfigs(newBusConfigs));

    // Return all riders to the list
    if (allRiders.length > 0) {
      setRiders((prev) => [...prev, ...allRiders]);
    }
  };

  const handleSaveState = () => {
    const state = {
      busConfigs,
      riders,
      buses,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('busSeatingState', JSON.stringify(state));
    alert('Seating arrangement saved successfully!');
  };

  const handleLoadState = () => {
    const savedState = localStorage.getItem('busSeatingState');
    if (savedState) {
      const state = JSON.parse(savedState);

      // Handle both old and new config formats
      if (state.busConfigs) {
        setBusConfigs(state.busConfigs);
      } else if (state.config) {
        // Convert old format to new format
        const oldConfig = state.config;
        const newConfigs = Array(oldConfig.numBuses || 2)
          .fill(null)
          .map(() => ({
            rows: oldConfig.rowsPerBus || 14,
            seatsPerBench: oldConfig.seatsPerBench || 2,
          }));
        setBusConfigs(newConfigs);
      }

      setRiders(state.riders);
      setBuses(state.buses);
      alert(`Seating arrangement loaded from ${new Date(state.timestamp).toLocaleString()}`);
    } else {
      alert('No saved state found!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadState = () => {
    const state = {
      busConfigs,
      riders,
      buses,
      timestamp: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bus-seating-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleUploadState = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const state = JSON.parse(event.target.result);

        // Validate state structure
        if (!state.riders || !state.buses) {
          alert('Invalid state file format!');
          return;
        }

        // Handle both old and new config formats
        if (state.busConfigs) {
          setBusConfigs(state.busConfigs);
        } else if (state.config) {
          // Convert old format to new format
          const oldConfig = state.config;
          const newConfigs = Array(oldConfig.numBuses || 2)
            .fill(null)
            .map(() => ({
              rows: oldConfig.rowsPerBus || 14,
              seatsPerBench: oldConfig.seatsPerBench || 2,
            }));
          setBusConfigs(newConfigs);
        }

        setRiders(state.riders);
        setBuses(state.buses);
        alert(`Seating arrangement loaded from ${new Date(state.timestamp).toLocaleString()}`);
      } catch (error) {
        alert('Error reading state file. Please ensure it is a valid JSON file.');
      }

      // Reset the file input
      e.target.value = '';
    };

    reader.readAsText(file);
  };

  const countAvailableSeats = (bus) => {
    let count = 0;
    bus.forEach((row) => {
      row.forEach((bench) => {
        bench.forEach((seat) => {
          if (!seat) count++;
        });
      });
    });
    return count;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <div className="no-print">
          <div className="header">
            <img src="/bus-logo.svg" alt="Bus Logo" className="app-logo" />
            <h1>Bus Seating Manager</h1>
          </div>
          <div className="controls">
            <button className="control-btn config-btn" onClick={() => setIsConfigDialogOpen(true)}>
              ⚙️ Configuration
            </button>
            <button className="control-btn save-btn" onClick={handleSaveState}>
              💾 Save to Browser
            </button>
            <button className="control-btn load-btn" onClick={handleLoadState}>
              📂 Load from Browser
            </button>
            <button className="control-btn download-btn" onClick={handleDownloadState}>
              ⬇️ Download State
            </button>
            <label htmlFor="upload-state" className="control-btn upload-btn">
              ⬆️ Upload State
            </label>
            <input
              id="upload-state"
              type="file"
              accept=".json"
              onChange={handleUploadState}
              style={{ display: 'none' }}
            />
            <button className="control-btn print-btn" onClick={handlePrint}>
              🖨️ Print Seating Chart
            </button>
          </div>
          <div className="main-container">
            <RidersList
              riders={riders}
              onAddRider={handleAddRider}
              onRemoveRider={handleRemoveRider}
              onReturnRider={handleReturnRider}
            />
            <div className="buses-container">
              {buses.map((bus, busIndex) => {
                const busConfig = busConfigs[busIndex];
                const totalSeats = busConfig.rows * BENCHES_PER_ROW * busConfig.seatsPerBench;
                return (
                  <Bus
                    key={busIndex}
                    busId={busIndex + 1}
                    rows={bus}
                    onDrop={(riderName, _, rowIndex, benchIndex, seatIndex) =>
                      handleDrop(riderName, busIndex, rowIndex, benchIndex, seatIndex)
                    }
                    availableSeats={countAvailableSeats(bus)}
                    totalSeats={totalSeats}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <PrintView buses={buses} busConfigs={busConfigs} />
        <ConfigDialog
          isOpen={isConfigDialogOpen}
          onClose={() => setIsConfigDialogOpen(false)}
          currentBusConfigs={busConfigs}
          onSave={handleConfigSave}
        />
      </div>
    </DndProvider>
  );
}

export default App;
