import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Bus from './components/Bus';
import RidersList from './components/RidersList';
import PrintView from './components/PrintView';
import './App.css';

const ROWS_PER_BUS = 14;
const BENCHES_PER_ROW = 2;
const SEATS_PER_BENCH = 2;
const TOTAL_SEATS_PER_BUS = ROWS_PER_BUS * BENCHES_PER_ROW * SEATS_PER_BENCH;

function App() {
  // Initialize empty buses (14 rows, 2 benches per row, 2 seats per bench)
  const createEmptyBus = () =>
    Array(ROWS_PER_BUS)
      .fill(null)
      .map(() =>
        Array(BENCHES_PER_ROW)
          .fill(null)
          .map(() => Array(SEATS_PER_BENCH).fill(null))
      );

  const [bus1, setBus1] = useState(createEmptyBus());
  const [bus2, setBus2] = useState(createEmptyBus());
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

    // Remove from both buses
    setBus1((prevBus) => removeRiderFromBus(prevBus, name));
    setBus2((prevBus) => removeRiderFromBus(prevBus, name));
  };

  const removeRiderFromBus = (bus, riderName) => {
    return bus.map((row) =>
      row.map((bench) =>
        bench.map((seat) => (seat === riderName ? null : seat))
      )
    );
  };

  const handleDrop = (riderName, busId, rowIndex, benchIndex, seatIndex) => {
    // Update bus 1
    setBus1((prevBus1) => {
      // Check if target seat is on bus 1 and is occupied
      if (busId === 1 && prevBus1[rowIndex][benchIndex][seatIndex]) {
        return prevBus1; // Seat occupied, no change
      }

      // Remove rider from bus 1 (if they're already seated there)
      const cleaned = removeRiderFromBus(prevBus1, riderName);

      // If dropping on bus 1, add rider to the target seat
      if (busId === 1) {
        const updated = cleaned.map(row => row.map(bench => [...bench]));
        updated[rowIndex][benchIndex][seatIndex] = riderName;
        return updated;
      }

      return cleaned;
    });

    // Update bus 2
    setBus2((prevBus2) => {
      // Check if target seat is on bus 2 and is occupied
      if (busId === 2 && prevBus2[rowIndex][benchIndex][seatIndex]) {
        return prevBus2; // Seat occupied, no change
      }

      // Remove rider from bus 2 (if they're already seated there)
      const cleaned = removeRiderFromBus(prevBus2, riderName);

      // If dropping on bus 2, add rider to the target seat
      if (busId === 2) {
        const updated = cleaned.map(row => row.map(bench => [...bench]));
        updated[rowIndex][benchIndex][seatIndex] = riderName;
        return updated;
      }

      return cleaned;
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

    // Remove rider from both buses
    setBus1((prevBus) => removeRiderFromBus(prevBus, riderName));
    setBus2((prevBus) => removeRiderFromBus(prevBus, riderName));
  };

  const handleSaveState = () => {
    const state = {
      riders,
      bus1,
      bus2,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('busSeatingState', JSON.stringify(state));
    alert('Seating arrangement saved successfully!');
  };

  const handleLoadState = () => {
    const savedState = localStorage.getItem('busSeatingState');
    if (savedState) {
      const state = JSON.parse(savedState);
      setRiders(state.riders);
      setBus1(state.bus1);
      setBus2(state.bus2);
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
      riders,
      bus1,
      bus2,
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
        if (!state.riders || !state.bus1 || !state.bus2) {
          alert('Invalid state file format!');
          return;
        }

        setRiders(state.riders);
        setBus1(state.bus1);
        setBus2(state.bus2);
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

  const bus1Available = countAvailableSeats(bus1);
  const bus2Available = countAvailableSeats(bus2);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <div className="no-print">
          <div className="header">
            <img src="/bus-logo.svg" alt="Bus Logo" className="app-logo" />
            <h1>Bus Seating Manager</h1>
          </div>
          <div className="controls">
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
              <Bus
                busId={1}
                rows={bus1}
                onDrop={handleDrop}
                availableSeats={bus1Available}
                totalSeats={TOTAL_SEATS_PER_BUS}
              />
              <Bus
                busId={2}
                rows={bus2}
                onDrop={handleDrop}
                availableSeats={bus2Available}
                totalSeats={TOTAL_SEATS_PER_BUS}
              />
            </div>
          </div>
        </div>
        <PrintView bus1={bus1} bus2={bus2} />
      </div>
    </DndProvider>
  );
}

export default App;
