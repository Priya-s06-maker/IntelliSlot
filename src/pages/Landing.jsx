import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const TAGLINES = [
  "Schedule Smarter. Live Better.",
  "AI that books before you blink.",
  "Zero conflicts. Total control.",
];

const FEATURES = [
  { icon: "⚡", title: "AI Slot Suggestions", desc: "Intelligent recommendations that factor in everyone's availability automatically." },
  { icon: "🗓️", title: "Calendar Sync", desc: "Live two-way sync — changes anywhere reflect everywhere, instantly." },
  { icon: "🔔", title: "Smart Reminders", desc: "Auto-send reminders at 24h, 1h, and 15min before every appointment." },
  { icon: "📊", title: "Analytics Hub", desc: "Track booking trends, resource utilization, and conflict rates at a glance." },
  { icon: "🤝", title: "Resource Booking", desc: "Rooms, projectors, equipment — allocated automatically with every booking." },
  { icon: "💬", title: "Natural Language", desc: 'Just type "Book review tomorrow at 3" — IntelliSlot handles the rest.' },
];

const STATS = [
  { val: "50K+", lbl: "Appointments Scheduled" },
  { val: "99.9%", lbl: "Uptime Guarantee" },
  { val: "3×",   lbl: "Faster Scheduling" },
  { val: "0",    lbl: "Double Bookings" },
];

export default function Landing() {
  const navigate = useNavigate();
  const [tlIdx, setTlIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTlIdx(i => (i + 1) % TAGLINES.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="page-shell">
      {/* Ambient orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="navbar-logo">
          <div className="logo-badge">IS</div>
          <span className="logo-name">IntelliSlot</span>
        </div>
        <div className="navbar-actions">
          <button className="btn btn-ghost" onClick={() => navigate("/login")}>Sign In</button>
          <button className="btn btn-primary" onClick={() => navigate("/signup")}>Get Started Free</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="landing-hero">
        <div className="hero-pill">
          <span className="hero-pill-dot" />
          <span className="hero-pill-text">AI-First Scheduling Platform</span>
        </div>

        <h1 className="hero-h1">
          Your Time,{" "}
          <span className="gradient-text">Intelligently</span>
          <br />Scheduled.
        </h1>

        <div className="hero-tagline-wrap">
          <p className="hero-tagline" key={tlIdx}>{TAGLINES[tlIdx]}</p>
        </div>

        <p className="hero-desc">
          IntelliSlot brings AI intelligence to every appointment —
          resolving conflicts, suggesting optimal slots, and keeping
          your entire team in perfect sync.
        </p>

        <div className="hero-ctas">
          <button className="btn btn-primary" onClick={() => navigate("/signup")}>
            Start Scheduling Free →
          </button>
          <button className="btn btn-ghost" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </div>

        <p className="hero-hint">
          Demo admin login — <span>admin@intellislot.com</span> / Admin@123
        </p>
      </section>

      {/* ── Stats strip ── */}
      <div className="stats-strip">
        {STATS.map((s, i) => (
          <div className="stat-cell" key={i}>
            <div className="stat-val">{s.val}</div>
            <div className="stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* ── Features ── */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">
            Everything to Master{" "}
            <span style={{
              background: "linear-gradient(90deg, #818CF8, #22D3EE)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>Your Calendar</span>
          </h2>
          <p className="section-sub">
            From AI suggestions to automated reminders — IntelliSlot does the heavy lifting.
          </p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NLP Demo ── */}
      <section className="nlp-section">
        <div className="nlp-inner">
          <h2 className="section-title">Just Type. We Handle the Rest.</h2>
          <p className="section-sub">
            Natural language scheduling that turns plain text into confirmed bookings.
          </p>
          <div className="nlp-demo-box">
            <div className="nlp-label">You type</div>
            <div className="nlp-input-text">"Book code review tomorrow at 3 with the backend team"</div>
            <div className="nlp-divider" />
            <div className="nlp-label">IntelliSlot creates</div>
            <div className="nlp-result">
              <span className="nlp-result-icon">✅</span>
              <div>
                <div className="nlp-result-title">Code Review — Tomorrow, 3:00 PM</div>
                <div className="nlp-result-sub">Backend team invited · Conference Room B · Reminders set</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <h2 className="cta-title">Ready to Reclaim Your Time?</h2>
        <p className="cta-sub">Join teams who've eliminated scheduling chaos with IntelliSlot.</p>
        <button className="btn btn-primary" onClick={() => navigate("/signup")}>
          Get Started — It's Free
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div className="logo-badge" style={{ width: 28, height: 28, fontSize: 11 }}>IS</div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>IntelliSlot</span>
        </div>
        <p className="footer-copy">© 2025 IntelliSlot. Schedule smarter, live better.</p>
      </footer>
    </div>
  );
}