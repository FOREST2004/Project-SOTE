import { useState, useEffect } from 'react';
import api from '../api';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await api.delete(`/bookings/${bookingId}`);
      fetchBookings();
    } catch (error) {
      alert('Failed to cancel booking');
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className={`booking-card ${booking.status.toLowerCase()}`}>
              <div className="booking-header">
                <h3>{booking.showtime.movie.title}</h3>
                <span className={`status ${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
              </div>

              <div className="booking-details">
                <p>
                  <strong>Room:</strong> {booking.showtime.room.name}
                </p>
                <p>
                  <strong>Showtime:</strong>{' '}
                  {new Date(booking.showtime.startTime).toLocaleString('vi-VN')}
                </p>
                <p>
                  <strong>Seats:</strong> {JSON.parse(booking.seats).join(', ')}
                </p>
                <p>
                  <strong>Total:</strong> {booking.totalPrice.toLocaleString('vi-VN')} VND
                </p>
                <p>
                  <strong>Booked on:</strong>{' '}
                  {new Date(booking.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>

              {booking.status === 'CONFIRMED' && (
                <button
                  onClick={() => handleCancel(booking.id)}
                  className="btn btn-danger"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
