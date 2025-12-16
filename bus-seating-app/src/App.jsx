import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Bus from './components/Bus';
import RidersList from './components/RidersList';
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

    // Riders stay in the list even when assigned to seats
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
        <h1>Bus Seating Manager</h1>
        <div className="main-container">
          <RidersList
            riders={riders}
            onAddRider={handleAddRider}
            onRemoveRider={handleRemoveRider}
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
    </DndProvider>
  );
}

export default App;
