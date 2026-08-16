import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid var(--border)',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <Link to="/dashboard" style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary)' }}>
        🛡️ ShaktiShield
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user && (
          <>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Hello, {user.name}
            </span>
            <Link to="/profile" className="btn btn-outline" style={{ padding: '0.375rem 0.875rem', fontSize: '0.85rem' }}>
              Profile
            </Link>
            <button onClick={logout} className="btn btn-outline" style={{ padding: '0.375rem 0.875rem', fontSize: '0.85rem' }}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
