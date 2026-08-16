const SafetyCard = ({ title, description, icon, link, linkLabel }) => (
  <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
      <span style={{ fontSize: '2rem' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: link ? '1rem' : 0 }}>{description}</p>
        {link && (
          <a href={link} className="btn btn-primary" style={{ fontSize: '0.85rem', display: 'inline-flex' }}>
            {linkLabel || 'Learn More'}
          </a>
        )}
      </div>
    </div>
  </div>
);

export default SafetyCard;
