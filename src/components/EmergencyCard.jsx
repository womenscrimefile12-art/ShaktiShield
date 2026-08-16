const EmergencyCard = ({ title, description, icon, action, actionLabel }) => (
  <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
      <span style={{ fontSize: '2rem' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{description}</p>
        {action && (
          <button onClick={action} className="btn btn-danger" style={{ fontSize: '0.85rem' }}>
            {actionLabel || 'Take Action'}
          </button>
        )}
      </div>
    </div>
  </div>
);

export default EmergencyCard;
