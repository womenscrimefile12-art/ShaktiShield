import { useState } from 'react';
import { sosAPI, contactAPI, userAPI } from '../services/api';
import { sendEmergencyAlert } from '../services/emailService';

const SOSButton = ({ onTriggered }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSOS = async () => {
    if (
      !window.confirm(
        '🚨 Trigger SOS alert?\n\nYour emergency contacts will be notified and your current location will be shared.'
      )
    ) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // --------------------------------
      // 1. Get current user
      // --------------------------------
      const { data: user } = await userAPI.getProfile();

      // --------------------------------
      // 2. Get emergency contacts
      // --------------------------------
      const { data: contacts } = await contactAPI.getAll();

      if (!contacts || contacts.length === 0) {
        throw new Error(
          'No emergency contacts found. Please add an emergency contact first.'
        );
      }

      // Find contacts that have an email
      const emailContacts = contacts.filter(
        (contact) => contact.email && contact.email.trim() !== ''
      );

      if (emailContacts.length === 0) {
        throw new Error(
          'Your emergency contacts do not have an email address.'
        );
      }

      // --------------------------------
      // 3. Get current GPS location
      // --------------------------------
      const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(
            new Error(
              'Geolocation is not supported by this browser.'
            )
          );
          return;
        }

        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      });

      const { latitude: lat, longitude: lng } = position.coords;

      // --------------------------------
      // 4. Save SOS alert locally
      // --------------------------------
      const { data } = await sosAPI.trigger({
        lat,
        lng,
        message:
          'Emergency SOS triggered from ShaktiShield.',
      });

      // --------------------------------
      // 5. Send EmailJS alerts
      // --------------------------------
      const message =
        '🚨 Emergency! An SOS alert has been triggered from ShaktiShield. Please contact the person immediately.';

      const emailResults = [];

      for (const contact of emailContacts) {
        const result = await sendEmergencyAlert({
          user_name: user?.name || 'ShaktiShield User',
          emergencyEmail: contact.email,
          message,
        });

        emailResults.push({
          contact: contact.name || contact.email,
          success: result.success,
          error: result.error,
        });
      }

      // --------------------------------
      // 6. Check email results
      // --------------------------------
      const failedEmails = emailResults.filter(
        (result) => !result.success
      );

      if (failedEmails.length === emailResults.length) {
        throw new Error(
          'SOS was saved, but the emergency email could not be sent.'
        );
      }

      // --------------------------------
      // 7. Notify parent component
      // --------------------------------
      onTriggered?.({
        ...data,
        emailResults,
      });

      alert(
        `🚨 SOS Alert Sent!\n\nYour emergency contacts have been notified.`
      );

    } catch (err) {
      console.error('SOS Error:', err);

      let errorMessage = 'Failed to trigger SOS.';

      if (err.code === 1) {
        errorMessage =
          'Location permission denied. Please allow location access.';
      } else if (err.code === 2) {
        errorMessage =
          'Unable to determine your location. Please try again.';
      } else if (err.code === 3) {
        errorMessage =
          'Location request timed out. Please try again.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>

      <button
        onClick={handleSOS}
        disabled={loading}
        aria-label="Trigger Emergency SOS"
        style={{
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: loading
            ? '#fca5a5'
            : 'var(--danger)',
          color: 'white',
          border: '6px solid #fecaca',
          fontSize: '1.5rem',
          fontWeight: 800,
          cursor: loading
            ? 'not-allowed'
            : 'pointer',
          boxShadow:
            '0 0 30px rgba(239, 68, 68, 0.4)',
          animation: loading
            ? 'none'
            : 'pulse 2s infinite',
          transition: 'transform 0.2s',
        }}
        onMouseDown={(e) => {
          if (!loading) {
            e.currentTarget.style.transform =
              'scale(0.95)';
          }
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform =
            'scale(1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform =
            'scale(1)';
        }}
      >
        {loading ? 'Sending...' : 'SOS'}
      </button>

      {error && (
        <p
          className="alert alert-error"
          style={{
            marginTop: '1rem',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {error}
        </p>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 30px rgba(239, 68, 68, 0.4);
          }

          50% {
            box-shadow: 0 0 50px rgba(239, 68, 68, 0.7);
          }
        }
      `}</style>

    </div>
  );
};

export default SOSButton;