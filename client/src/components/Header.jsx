import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          Cinema Booking
        </Link>

        <nav className="nav">
          <Link to="/">Movies</Link>

          {user ? (
            <>
              <Link to="/my-bookings">My Bookings</Link>
              <Link to="/profile">Profile</Link>
              {user.role === 'ADMIN' && <Link to="/admin">Admin</Link>}
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
