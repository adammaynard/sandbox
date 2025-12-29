import './PrintView.css';

const PrintView = ({ buses, busConfigs }) => {

  const renderBusPrint = (bus, busIndex) => {
    const busNumber = busIndex + 1;
    const busConfig = busConfigs[busIndex];
    const seatsPerBench = busConfig.seatsPerBench;
    const totalSeatsPerBus = busConfig.rows * 2 * seatsPerBench;

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
                <th colSpan={seatsPerBench}>Left Bench</th>
                <th className="aisle">Aisle</th>
                <th colSpan={seatsPerBench}>Right Bench</th>
              </tr>
            </thead>
            <tbody>
              {bus.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="row-number">{rowIndex + 1}</td>
                  {/* Left bench seats */}
                  {row[0].map((seat, seatIndex) => (
                    <td key={`left-${seatIndex}`} className="seat-cell">
                      {seat || '—'}
                    </td>
                  ))}
                  <td className="aisle"></td>
                  {/* Right bench seats */}
                  {row[1].map((seat, seatIndex) => (
                    <td key={`right-${seatIndex}`} className="seat-cell">
                      {seat || '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="print-bus-back">BACK</div>
        </div>
        <div className="print-summary">
          <strong>Total Seats:</strong> {totalSeatsPerBus} |
          <strong> Occupied:</strong> {countOccupiedSeats(bus)} |
          <strong> Available:</strong> {totalSeatsPerBus - countOccupiedSeats(bus)}
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
      {buses.map((bus, index) => renderBusPrint(bus, index))}
    </div>
  );
};

export default PrintView;
