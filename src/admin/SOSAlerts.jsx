import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const SOSAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = () => {
    adminAPI.getSOSAlerts().then(({ data }) => {
      setAlerts(data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchAlerts(); }, []);

  const resolveAlert = async (id) => {
    await adminAPI.resolveSOS(id);
    fetchAlerts();
  };

  if (loading) return <div className="loading">Loading SOS alerts...</div>;

  return (
    <div>
      <h1 className="page-title">SOS Alerts</h1>
      {alerts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No SOS alerts</div>
      ) : (
        <div className="grid">
          {alerts.map((alert) => (
            <div key={alert._id} className="card" style={{ borderLeft: alert.status === 'active' ? '4px solid var(--danger)' : '4px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className={`badge badge-${alert.status === 'active' ? 'active' : 'resolved'}`}>{alert.status}</span>
                  <h3 style={{ marginTop: '0.5rem' }}>{alert.user?.name || 'Unknown User'}</h3>
                  <p style={{ fontSize: '0.9rem' }}>📞 {alert.user?.phone}</p>
                  <p style={{ fontSize: '0.9rem' }}>✉️ {alert.user?.email}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    {new Date(alert.createdAt).toLocaleString()}
                  </p>
                  {alert.location?.coordinates && (
                    <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      📍 {alert.location.coordinates[1]}, {alert.location.coordinates[0]}
                    </p>
                  )}
                </div>
                {alert.status === 'active' && (
                  <button onClick={() => resolveAlert(alert._id)} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SOSAlerts;
