import { useState } from 'react';
import { sosAPI } from '../services/api';

const SOSButton = ({ onTriggered }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSOS = async () => {
    if (!window.confirm('Trigger SOS alert? Your emergency contacts will be notified.')) return;

    setLoading(true);
    setError('');

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const { latitude: lat, longitude: lng } = position.coords;
      const { data } = await sosAPI.trigger({ lat, lng });
      onTriggered?.(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to trigger SOS. Enable location access.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <button
        onClick={handleSOS}
        disabled={loading}
        style={{
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: loading ? '#fca5a5' : 'var(--danger)',
          color: 'white',
          border: '6px solid #fecaca',
          fontSize: '1.5rem',
          fontWeight: 800,
          boxShadow: '0 0 30px rgba(239, 68, 68, 0.4)',
          animation: loading ? 'none' : 'pulse 2s infinite',
          transition: 'transform 0.2s',
        }}
        onMouseDown={(e) => (e.target.style.transform = 'scale(0.95)')}
        onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
      >
        {loading ? 'Sending...' : 'SOS'}
      </button>
      {error && <p className="alert alert-error" style={{ marginTop: '1rem' }}>{error}</p>}
      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.4); }
          50% { box-shadow: 0 0 50px rgba(239, 68, 68, 0.7); }
        }
      `}</style>
    </div>
  );
};

export default SOSButton;
