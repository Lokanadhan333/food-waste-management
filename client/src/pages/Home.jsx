import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDonations, checkServerHealth } from '../services/api.js';
import Spinner from '../components/Spinner.jsx';

export default function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverUp, setServerUp] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const [health, data] = await Promise.allSettled([
          checkServerHealth(),
          getDonations(),
        ]);

        if (cancelled) return;

        setServerUp(health.status === 'fulfilled');

        if (data.status === 'fulfilled') {
          const donations = data.value.donations || [];
          const requests = donations.reduce(
            (total, d) => total + (d.requestCount || 0),
            0
          );
          setStats({
            donations: donations.length,
            requests,
            people: requests * 3, // rough estimate: one request feeds ~3 people
            available: donations.filter((d) => d.status === 'available').length,
          });
        } else {
          setStats({ donations: 0, requests: 0, people: 0, available: 0 });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page">
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <p className="hero-eyebrow">🥦 FoodShare – Food Waste Management</p>
            <h1 className="hero-title">Share Food, Reduce Waste, Feed Lives.</h1>
            <p className="hero-subtitle">
              Every day, tons of perfectly good food is thrown away while millions of people go
              hungry. FoodShare connects restaurants, caterers, and households with surplus food
              to shelters, communities, and individuals who need it — before it goes to waste.
            </p>
            <div className="hero-actions">
              <Link to="/donate" className="btn btn-primary btn-lg">
                Donate Food
              </Link>
              <Link to="/find-food" className="btn btn-outline btn-lg">
                Find Food
              </Link>
            </div>
            {serverUp === false && (
              <p className="hero-warning">
                ⚠️ The backend server is not running. Start it with <code>npm run dev</code> inside
                the <code>server/</code> folder.
              </p>
            )}
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-plate">🍽️</div>
            <div className="hero-emoji hero-emoji-1">🥕</div>
            <div className="hero-emoji hero-emoji-2">🍎</div>
            <div className="hero-emoji hero-emoji-3">🍞</div>
            <div className="hero-emoji hero-emoji-4">🥗</div>
          </div>
        </div>
      </section>

      <section className="container section">
        <h2 className="section-title">Our Impact</h2>
        <p className="section-subtitle">Live numbers from the FoodShare database.</p>

        {loading ? (
          <Spinner label="Loading statistics…" />
        ) : (
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">🍲</span>
              <h3 className="stat-number">{stats.donations}</h3>
              <p className="stat-label">Food Donations Listed</p>
            </div>
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">🤝</span>
              <h3 className="stat-number">{stats.requests}</h3>
              <p className="stat-label">Meal Requests Shared</p>
            </div>
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">😊</span>
              <h3 className="stat-number">{stats.people}</h3>
              <p className="stat-label">People Helped</p>
            </div>
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">✅</span>
              <h3 className="stat-number">{stats.available}</h3>
              <p className="stat-label">Meals Available Now</p>
            </div>
          </div>
        )}
      </section>

      <section className="section section-tinted">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <span className="step-number">1</span>
              <h3>Donate Surplus Food</h3>
              <p>
                A restaurant, caterer, or household lists extra food with its quantity, category,
                pickup location, and a safe-consumption deadline.
              </p>
            </div>
            <div className="step-card">
              <span className="step-number">2</span>
              <h3>People Find Food</h3>
              <p>
                Shelters, NGOs, and individuals browse available donations on the Find Food page
                using search and category filters.
              </p>
            </div>
            <div className="step-card">
              <span className="step-number">3</span>
              <h3>Request &amp; Collect</h3>
              <p>
                A one-click request is sent to the donor, who shares the pickup contact so the
                food can be collected before it expires.
              </p>
            </div>
          </div>
          <div className="center">
            <Link to="/donate" className="btn btn-primary btn-lg">
              Start Sharing Food
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
