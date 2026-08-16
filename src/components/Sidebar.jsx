import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/sos', label: 'SOS', icon: '🚨' },
  { to: '/contacts', label: 'Emergency Contacts', icon: '📞' },
  { to: '/safe-places', label: 'Safe Places', icon: '📍' },
  { to: '/report', label: 'Report Incident', icon: '📝' },
  { to: '/safety-tips', label: 'Safety Tips', icon: '💡' },
  { to: '/self-defense', label: 'Self Defense', icon: '🥋' },
  { to: '/helpline', label: 'Helpline', icon: '☎️' },
];

const adminLinks = [
  { to: '/admin', label: 'Admin Dashboard', icon: '⚙️' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/sos', label: 'SOS Alerts', icon: '🚨' },
  { to: '/admin/reports', label: 'Reports', icon: '📋' },
  { to: '/admin/analytics', label: 'Analytics', icon: '📊' },
];

const Sidebar = () => {
  const { isAdmin } = useAuth();
  const navLinks = isAdmin ? [...links, ...adminLinks] : links;

  return (
    <aside style={{
      width: '240px',
      background: 'white',
      borderRight: '1px solid var(--border)',
      padding: '1.5rem 0',
      minHeight: '100vh',
    }}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navLinks.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard' || to === '/admin'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1.5rem',
              color: isActive ? 'var(--primary)' : 'var(--text)',
              background: isActive ? '#faf5ff' : 'transparent',
              borderRight: isActive ? '3px solid var(--primary)' : '3px solid transparent',
              fontWeight: isActive ? 600 : 400,
              fontSize: '0.9rem',
              transition: 'all 0.2s',
            })}
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
