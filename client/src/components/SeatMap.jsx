import { useState, useEffect } from 'react';

function SeatMap({ room, bookedSeats, onSeatsChange }) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const rows = Array.from({ length: room.rows }, (_, i) => String.fromCharCode(65 + i));
  const seatsPerRow = room.seatsPerRow;

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return;

    setSelectedSeats((prev) => {
      const newSeats = prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId];
      onSeatsChange(newSeats);
      return newSeats;
    });
  };

  const getSeatClass = (seatId) => {
    if (bookedSeats.includes(seatId)) return 'seat booked';
    if (selectedSeats.includes(seatId)) return 'seat selected';
    return 'seat available';
  };

  return (
    <div className="seat-map">
      <div className="screen">SCREEN</div>

      <div className="seats-container">
        {rows.map((row) => (
          <div key={row} className="seat-row">
            <span className="row-label">{row}</span>
            {Array.from({ length: seatsPerRow }, (_, i) => {
              const seatNumber = i + 1;
              const seatId = `${row}${seatNumber}`;
              return (
                <button
                  key={seatId}
                  className={getSeatClass(seatId)}
                  onClick={() => toggleSeat(seatId)}
                  disabled={bookedSeats.includes(seatId)}
                >
                  {seatNumber}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="seat selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="seat booked"></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
}

export default SeatMap;
