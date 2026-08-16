import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const Analytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    adminAPI.getAnalytics().then(({ data }) => setData(data));
  }, []);

  if (!data) return <div className="loading">Loading analytics...</div>;

  return (
    <div>
      <h1 className="page-title">Analytics</h1>

      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>SOS Alerts (Last 30 Days)</h3>
          {data.sosByDay.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No data available</p>
          ) : (
            <div>
              {data.sosByDay.map((d) => (
                <div key={d._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span>{d._id}</span>
                  <span style={{ fontWeight: 600 }}>{d.count} alerts</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Incidents by Category</h3>
          {data.incidentsByCategory.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No data available</p>
          ) : (
            <div>
              {data.incidentsByCategory.map((c) => (
                <div key={c._id} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ textTransform: 'capitalize' }}>{c._id}</span>
                    <span style={{ fontWeight: 600 }}>{c.count}</span>
                  </div>
                  <div style={{ background: 'var(--border)', borderRadius: '4px', height: '8px' }}>
                    <div style={{
                      background: 'var(--primary)',
                      borderRadius: '4px',
                      height: '100%',
                      width: `${Math.min(c.count * 20, 100)}%`,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
