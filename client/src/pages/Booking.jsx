import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import SeatMap from '../components/SeatMap';

function Booking() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchShowtime();
  }, [showtimeId]);

  const fetchShowtime = async () => {
    try {
      const response = await api.get(`/showtimes/${showtimeId}`);
      setShowtime(response.data);
    } catch (error) {
      console.error('Failed to fetch showtime:', error);
      setError('Failed to load showtime details');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    try {
      await api.post('/bookings', {
        showtimeId,
        seats: selectedSeats,
      });
      alert('Booking successful!');
      navigate('/my-bookings');
    } catch (error) {
      alert(error.response?.data?.error || 'Booking failed');
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container">{error}</div>;
  if (!showtime) return <div className="container">Showtime not found</div>;

  const totalPrice = showtime.price * selectedSeats.length;

  return (
    <div className="container">
      <div className="booking-page">
        <h1>Book Tickets</h1>

        <div className="booking-info">
          <h2>{showtime.movie.title}</h2>
          <p>
            <strong>Showtime:</strong>{' '}
            {new Date(showtime.startTime).toLocaleString('vi-VN')}
          </p>
          <p>
            <strong>Room:</strong> {showtime.room.name}
          </p>
          <p>
            <strong>Price per seat:</strong> {showtime.price.toLocaleString('vi-VN')} VND
          </p>
        </div>

        <SeatMap
          room={showtime.room}
          bookedSeats={showtime.bookedSeats}
          onSeatsChange={setSelectedSeats}
        />

        <div className="booking-summary">
          <div className="summary-info">
            <p>
              <strong>Selected seats:</strong>{' '}
              {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
            </p>
            <p>
              <strong>Total:</strong> {totalPrice.toLocaleString('vi-VN')} VND
            </p>
          </div>

          <button
            onClick={handleBooking}
            className="btn btn-primary btn-large"
            disabled={selectedSeats.length === 0}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}

export default Booking;
