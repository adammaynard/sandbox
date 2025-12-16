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
    if (!riders.includes(name)) {
      setRiders([...riders, name]);
    }
  };

  const handleRemoveRider = (name) => {
    // Remove from riders list
    setRiders(riders.filter((r) => r !== name));

    // Remove from both buses
    setBus1(removeRiderFromBus(bus1, name));
    setBus2(removeRiderFromBus(bus2, name));
  };

  const removeRiderFromBus = (bus, riderName) => {
    return bus.map((row) =>
      row.map((bench) =>
        bench.map((seat) => (seat === riderName ? null : seat))
      )
    );
  };

  const handleDrop = (riderName, busId, rowIndex, benchIndex, seatIndex) => {
    const setBus = busId === 1 ? setBus1 : setBus2;
    const currentBus = busId === 1 ? bus1 : bus2;

    // Check if seat is already occupied
    if (currentBus[rowIndex][benchIndex][seatIndex]) {
      return;
    }

    // Remove rider from both buses first
    const cleanedBus1 = removeRiderFromBus(bus1, riderName);
    const cleanedBus2 = removeRiderFromBus(bus2, riderName);

    // Place rider in the new seat
    const updatedBus = busId === 1 ? [...cleanedBus1] : [...cleanedBus2];
    updatedBus[rowIndex] = [...updatedBus[rowIndex]];
    updatedBus[rowIndex][benchIndex] = [...updatedBus[rowIndex][benchIndex]];
    updatedBus[rowIndex][benchIndex][seatIndex] = riderName;

    // Update both buses
    setBus1(busId === 1 ? updatedBus : cleanedBus1);
    setBus2(busId === 2 ? updatedBus : cleanedBus2);

    // Remove from available riders list
    setRiders(riders.filter((r) => r !== riderName));
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
