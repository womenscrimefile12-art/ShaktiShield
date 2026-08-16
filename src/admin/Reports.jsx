import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const Reports = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIncidents = () => {
    adminAPI.getIncidents().then(({ data }) => {
      setIncidents(data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchIncidents(); }, []);

  const updateStatus = async (id, status) => {
    await adminAPI.updateIncident(id, { status });
    fetchIncidents();
  };

  if (loading) return <div className="loading">Loading reports...</div>;

  return (
    <div>
      <h1 className="page-title">Incident Reports</h1>
      {incidents.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No incidents reported</div>
      ) : (
        <div className="grid">
          {incidents.map((inc) => (
            <div key={inc._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3>{inc.title}</h3>
                  <span className={`badge badge-${inc.status === 'pending' ? 'pending' : 'resolved'}`}>{inc.status}</span>
                  <span className="badge" style={{ marginLeft: '0.5rem', background: '#f3e8ff', color: 'var(--primary)' }}>{inc.category}</span>
                  <p style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>{inc.description}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    {inc.isAnonymous ? 'Anonymous' : inc.user?.name} · {new Date(inc.createdAt).toLocaleString()}
                  </p>
                </div>
                {inc.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => updateStatus(inc._id, 'reviewing')} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Review</button>
                    <button onClick={() => updateStatus(inc._id, 'resolved')} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>Resolve</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
