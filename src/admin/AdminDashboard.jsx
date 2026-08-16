import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminAPI.getStats().then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <div className="loading">Loading dashboard...</div>;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'var(--primary)' },
    { label: 'Active SOS Alerts', value: stats.activeSOS, icon: '🚨', color: 'var(--danger)' },
    { label: 'Pending Incidents', value: stats.pendingIncidents, icon: '📝', color: 'var(--warning)' },
    { label: 'Total Incidents', value: stats.totalIncidents, icon: '📋', color: 'var(--success)' },
  ];

  return (
    <div>
      <h1 className="page-title">Admin Dashboard</h1>
      <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
        {cards.map((c) => (
          <div key={c.label} className="card" style={{ borderLeft: `4px solid ${c.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{c.label}</p>
                <p style={{ fontSize: '2rem', fontWeight: 700 }}>{c.value}</p>
              </div>
              <span style={{ fontSize: '2.5rem' }}>{c.icon}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
