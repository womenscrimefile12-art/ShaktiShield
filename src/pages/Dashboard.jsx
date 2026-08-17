import { useAuth } from "../context/AuthContext"; 
import SOSButton from "../components/SOSButton"; 
import EmergencyCard from "../components/EmergencyCard"; 
import SafetyCard from "../components/SafetyCard"; 
 
const Dashboard = () => { 
  const { user } = useAuth(); 
 
  const userName = user?.name || "there"; 
 
  const navigateTo = (path) => { 
    window.location.href = path; 
  }; 
 
  return ( 
    <main className="dashboard-page"> 
 
      {/* HERO */} 
      <section className="dashboard-hero"> 
        <div className="dashboard-hero-content"> 
 
          <div className="dashboard-hero-text"> 
            <span className="section-label"> 
              🛡️ SHAKTISHIELD DASHBOARD 
            </span> 
 
            <h1 className="dashboard-title"> 
              Welcome back, 
              <br /> 
              <span>{userName}</span> 👋 
            </h1> 
 
            <p className="dashboard-subtitle"> 
              Your personal safety companion is ready. 
              Access emergency assistance, manage your trusted 
              contacts and stay informed with essential safety resources. 
            </p> 
 
            <div className="dashboard-status"> 
              <span className="status-dot"></span> 
              <span>Safety system is ready</span> 
              <span className="status-divider">•</span> 
              <span>Protected 24/7</span> 
            </div> 
          </div> 
 
          {/* HERO VISUAL */} 
          <div className="dashboard-hero-visual"> 
 
            <div className="hero-glow"></div> 
 
            <div className="hero-shield"> 
              🛡️ 
            </div> 
 
            <div className="floating-badge floating-badge-top"> 
              <span>✓</span> 
              Safe & Protected 
            </div> 
 
            <div className="floating-badge floating-badge-bottom"> 
              <span>📍</span> 
              Location Ready 
            </div> 
 
          </div> 
        </div> 
      </section> 
 
      {/* STATS */} 
      <section className="dashboard-stats"> 
 
        <div className="dashboard-stat-card"> 
          <div className="dashboard-stat-icon purple">🛡️</div> 
          <div> 
            <strong>24/7</strong> 
            <span>Safety Support</span> 
          </div> 
        </div> 
 
        <div className="dashboard-stat-card"> 
          <div className="dashboard-stat-icon red">🚨</div> 
          <div> 
            <strong>SOS</strong> 
            <span>One-Tap Emergency</span> 
          </div> 
        </div> 
 
        <div className="dashboard-stat-card"> 
          <div className="dashboard-stat-icon blue">📍</div> 
          <div> 
            <strong>Live</strong> 
            <span>Location Sharing</span> 
          </div> 
        </div> 
 
        <div className="dashboard-stat-card"> 
          <div className="dashboard-stat-icon green">🔐</div> 
          <div> 
            <strong>Private</strong> 
            <span>Your Safety Data</span> 
          </div> 
        </div> 
 
      </section> 
 
      {/* EMERGENCY CENTER */} 
      <section className="dashboard-section"> 
 
        <div className="dashboard-section-header"> 
 
          <div> 
            <span className="section-label"> 
              EMERGENCY CENTER 
            </span> 
 
            <h2>Need help right now?</h2> 
 
            <p> 
              Get emergency assistance with one tap. 
            </p> 
          </div> 
 
          <div className="safety-mode-badge"> 
            <span className="status-dot"></span> 
            Safety Mode Active 
          </div> 
 
        </div> 
 
        <div className="emergency-dashboard-grid"> 
 
          {/* SOS */} 
          <div className="sos-dashboard-card"> 
 
            <div className="sos-background-circle"></div> 
 
            <div className="sos-content"> 
 
              <div className="sos-icon">🚨</div> 
 
              <span className="sos-label"> 
                EMERGENCY ASSISTANCE 
              </span> 
 
              <h2>Activate SOS</h2> 
 
              <p> 
                Send an emergency alert to your trusted 
                contacts and share your current location. 
              </p> 
 
              <div className="sos-button-wrapper"> 
                <SOSButton /> 
              </div> 
 
              <div className="sos-info"> 
                <span>🔒</span> 
                Your emergency information remains protected. 
              </div> 
 
            </div> 
          </div> 
 
          {/* QUICK ACTIONS */} 
          <div className="quick-action-column"> 
 
            <div className="quick-action-header"> 
              <div> 
                <h3>Quick Actions</h3> 
                <span>Get help faster</span> 
              </div> 
            </div> 
 
            <EmergencyCard 
              icon="📞" 
              title="Emergency Contacts" 
              description="Manage the trusted people who receive your SOS alerts." 
              action={() => navigateTo("/contacts")} 
              actionLabel="Manage Contacts →" 
            /> 
 
            <EmergencyCard 
              icon="📍" 
              title="Find Safe Places" 
              description="Locate nearby police stations, hospitals and verified safe places." 
              action={() => navigateTo("/safe-places")} 
              actionLabel="View Safe Places →" 
            /> 
 
          </div> 
        </div> 
      </section> 
 
      {/* SAFETY RESOURCES */} 
      <section className="dashboard-section"> 
 
        <div className="dashboard-section-header"> 
 
          <div> 
            <span className="section-label"> 
              SAFETY RESOURCES 
            </span> 
 
            <h2>Learn. Prepare. Stay Safe.</h2> 
 
            <p> 
              Useful resources to help you stay aware and prepared. 
            </p> 
          </div> 
 
          <span className="resource-count"> 
            3 Resources 
          </span> 
 
        </div> 
 
        <div className="grid grid-3 safety-resource-grid"> 
 
          <SafetyCard 
            icon="💡" 
            title="Safety Tips" 
            description="Discover practical safety guides and awareness information for everyday situations." 
            link="/safety-tips" 
            linkLabel="Read Safety Tips →" 
          /> 
 
          <SafetyCard 
            icon="🥋" 
            title="Self Defense" 
            description="Learn basic awareness, escape and personal safety techniques." 
            link="/self-defense" 
            linkLabel="Learn Techniques →" 
          /> 
 
          <SafetyCard 
            icon="☎️" 
            title="Helpline Numbers" 
            description="Quickly access important emergency and support helpline numbers." 
            link="/helpline" 
            linkLabel="View Helplines →" 
          /> 
 
        </div> 
      </section> 
 
      {/* INCIDENT REPORT */} 
      <section className="incident-banner"> 
 
        <div className="incident-content"> 
 
          <div className="incident-icon"> 
            📝 
          </div> 
 
          <div> 
            <span className="section-label"> 
              COMMUNITY SAFETY 
            </span> 
 
            <h2>Help make your community safer</h2> 
 
            <p> 
              Report harassment, stalking, assault or other 
              incidents securely through ShaktiShield. 
            </p> 
          </div> 
 
        </div> 
 
        <button 
          type="button" 
          className="btn btn-primary" 
          onClick={() => navigateTo("/report-incident")} 
        > 
          Report an Incident → 
        </button> 
 
      </section> 
 
      {/* SAFETY REMINDER */} 
      <section className="safety-reminder"> 
 
        <div className="reminder-icon"> 
          💜 
        </div> 
 
        <div> 
          <h3>Your safety comes first.</h3> 
 
          <p> 
            Trust your instincts, stay aware of your surroundings 
            and don't hesitate to reach out when you feel unsafe. 
          </p> 
        </div> 
 
      </section> 
 
    </main> 
  ); 
}; 
 
export default Dashboard;