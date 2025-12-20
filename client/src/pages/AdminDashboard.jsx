import { useState, useEffect } from 'react';
import api from '../api';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('revenue');
  const [revenue, setRevenue] = useState(null);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    duration: 120,
    genre: 'Action',
    posterUrl: '',
    trailerUrl: '',
    releaseDate: new Date().toISOString().split('T')[0],
  });
  const [showtimeForm, setShowtimeForm] = useState({
    movieId: '',
    roomId: '',
    startTime: '',
    price: 100000,
  });

  useEffect(() => {
    if (activeTab === 'revenue') fetchRevenue();
    if (activeTab === 'movies') fetchMovies();
    if (activeTab === 'rooms') fetchRooms();
    if (activeTab === 'showtimes') {
      fetchShowtimes();
      fetchMovies();
      fetchRooms();
    }
  }, [activeTab]);

  const fetchRevenue = async () => {
    const response = await api.get('/admin/revenue');
    setRevenue(response.data);
  };

  const fetchMovies = async () => {
    const response = await api.get('/admin/movies');
    setMovies(response.data);
  };

  const fetchRooms = async () => {
    const response = await api.get('/admin/rooms');
    setRooms(response.data);
  };

  const fetchShowtimes = async () => {
    const response = await api.get('/admin/showtimes');
    setShowtimes(response.data);
  };

  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/movies', movieForm);
      fetchMovies();
      setMovieForm({
        title: '',
        description: '',
        duration: 120,
        genre: 'Action',
        posterUrl: '',
        trailerUrl: '',
        releaseDate: new Date().toISOString().split('T')[0],
      });
      alert('Movie added successfully');
    } catch (error) {
      alert('Failed to add movie');
    }
  };

  const handleShowtimeSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/showtimes', {
        ...showtimeForm,
        price: Number(showtimeForm.price),
      });
      fetchShowtimes();
      setShowtimeForm({
        movieId: '',
        roomId: '',
        startTime: '',
        price: 100000,
      });
      alert('Showtime added successfully');
    } catch (error) {
      alert('Failed to add showtime');
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!confirm('Delete this movie?')) return;
    try {
      await api.delete(`/admin/movies/${id}`);
      fetchMovies();
    } catch (error) {
      alert('Failed to delete movie');
    }
  };

  const handleDeleteShowtime = async (id) => {
    if (!confirm('Delete this showtime?')) return;
    try {
      await api.delete(`/admin/showtimes/${id}`);
      fetchShowtimes();
    } catch (error) {
      alert('Failed to delete showtime');
    }
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>

      <div className="tabs">
        <button
          className={activeTab === 'revenue' ? 'active' : ''}
          onClick={() => setActiveTab('revenue')}
        >
          Revenue Reports
        </button>
        <button
          className={activeTab === 'movies' ? 'active' : ''}
          onClick={() => setActiveTab('movies')}
        >
          Manage Movies
        </button>
        <button
          className={activeTab === 'showtimes' ? 'active' : ''}
          onClick={() => setActiveTab('showtimes')}
        >
          Manage Showtimes
        </button>
      </div>

      {activeTab === 'revenue' && revenue && (
        <div className="revenue-section">
          <div className="stats">
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <p className="stat-value">{revenue.totalRevenue.toLocaleString('vi-VN')} VND</p>
            </div>
            <div className="stat-card">
              <h3>Total Bookings</h3>
              <p className="stat-value">{revenue.totalBookings}</p>
            </div>
          </div>

          <h2>Revenue by Movie</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Movie</th>
                <th>Bookings</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {revenue.byMovie.map((item) => (
                <tr key={item.title}>
                  <td>{item.title}</td>
                  <td>{item.bookings}</td>
                  <td>{item.revenue.toLocaleString('vi-VN')} VND</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'movies' && (
        <div className="movies-section">
          <h2>Add New Movie</h2>
          <form onSubmit={handleMovieSubmit} className="admin-form">
            <input
              placeholder="Title"
              value={movieForm.title}
              onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={movieForm.description}
              onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={movieForm.duration}
              onChange={(e) => setMovieForm({ ...movieForm, duration: Number(e.target.value) })}
              required
            />
            <select
              value={movieForm.genre}
              onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
            >
              <option>Action</option>
              <option>Romance</option>
              <option>Thriller</option>
              <option>Comedy</option>
              <option>Drama</option>
              <option>Horror</option>
            </select>
            <input
              placeholder="Poster URL"
              value={movieForm.posterUrl}
              onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
              required
            />
            <input
              placeholder="Trailer URL"
              value={movieForm.trailerUrl}
              onChange={(e) => setMovieForm({ ...movieForm, trailerUrl: e.target.value })}
            />
            <input
              type="date"
              value={movieForm.releaseDate}
              onChange={(e) => setMovieForm({ ...movieForm, releaseDate: e.target.value })}
              required
            />
            <button type="submit" className="btn btn-primary">
              Add Movie
            </button>
          </form>

          <h2>Movies List</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Genre</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id}>
                  <td>{movie.title}</td>
                  <td>{movie.genre}</td>
                  <td>{movie.duration} min</td>
                  <td>
                    <button onClick={() => handleDeleteMovie(movie.id)} className="btn btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'showtimes' && (
        <div className="showtimes-section">
          <h2>Add New Showtime</h2>
          <form onSubmit={handleShowtimeSubmit} className="admin-form">
            <select
              value={showtimeForm.movieId}
              onChange={(e) => setShowtimeForm({ ...showtimeForm, movieId: e.target.value })}
              required
            >
              <option value="">Select Movie</option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))}
            </select>
            <select
              value={showtimeForm.roomId}
              onChange={(e) => setShowtimeForm({ ...showtimeForm, roomId: e.target.value })}
              required
            >
              <option value="">Select Room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
            <input
              type="datetime-local"
              value={showtimeForm.startTime}
              onChange={(e) => setShowtimeForm({ ...showtimeForm, startTime: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={showtimeForm.price}
              onChange={(e) => setShowtimeForm({ ...showtimeForm, price: e.target.value })}
              required
            />
            <button type="submit" className="btn btn-primary">
              Add Showtime
            </button>
          </form>

          <h2>Showtimes List</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Movie</th>
                <th>Room</th>
                <th>Start Time</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {showtimes.map((showtime) => (
                <tr key={showtime.id}>
                  <td>{showtime.movie.title}</td>
                  <td>{showtime.room.name}</td>
                  <td>{new Date(showtime.startTime).toLocaleString('vi-VN')}</td>
                  <td>{showtime.price.toLocaleString('vi-VN')} VND</td>
                  <td>
                    <button onClick={() => handleDeleteShowtime(showtime.id)} className="btn btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
