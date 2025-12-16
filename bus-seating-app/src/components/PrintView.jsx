import './PrintView.css';

const PrintView = ({ bus1, bus2 }) => {
  const renderBusPrint = (bus, busNumber) => {
    return (
      <div className="print-bus-page">
        <h1 className="print-title">Bus {busNumber} - Seating Chart</h1>
        <div className="print-date">
          Printed: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
        <div className="print-bus-container">
          <div className="print-bus-front">FRONT</div>
          <table className="print-seating-table">
            <thead>
              <tr>
                <th>Row</th>
                <th colSpan="2">Left Bench</th>
                <th className="aisle">Aisle</th>
                <th colSpan="2">Right Bench</th>
              </tr>
            </thead>
            <tbody>
              {bus.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="row-number">{rowIndex + 1}</td>
                  <td className="seat-cell">{row[0][0] || '—'}</td>
                  <td className="seat-cell">{row[0][1] || '—'}</td>
                  <td className="aisle"></td>
                  <td className="seat-cell">{row[1][0] || '—'}</td>
                  <td className="seat-cell">{row[1][1] || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="print-bus-back">BACK</div>
        </div>
        <div className="print-summary">
          <strong>Total Seats:</strong> 56 |
          <strong> Occupied:</strong> {countOccupiedSeats(bus)} |
          <strong> Available:</strong> {56 - countOccupiedSeats(bus)}
        </div>
      </div>
    );
  };

  const countOccupiedSeats = (bus) => {
    let count = 0;
    bus.forEach((row) => {
      row.forEach((bench) => {
        bench.forEach((seat) => {
          if (seat) count++;
        });
      });
    });
    return count;
  };

  return (
    <div className="print-only">
      {renderBusPrint(bus1, 1)}
      {renderBusPrint(bus2, 2)}
    </div>
  );
};

export default PrintView;
