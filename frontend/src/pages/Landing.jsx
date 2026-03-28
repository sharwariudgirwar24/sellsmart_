import { Link } from 'react-router-dom'
import AnimatedBackground from '../components/shared/AnimatedBackground'
import '../styles/landing.css'

const features = [
    { icon: 'fa-solid fa-store', title: 'Business Profiles', desc: 'Create a stunning digital profile for your micro-business. Showcase your services, location, and working hours.' },
    { icon: 'fa-solid fa-images', title: 'Portfolio Showcase', desc: 'Upload photos and videos of your work to attract customers and demonstrate your skills visually.' },
    { icon: 'fa-solid fa-comment-dots', title: 'Direct Connect', desc: 'Let customers reach you instantly via WhatsApp, Instagram, or the built-in chat feature.' },
    { icon: 'fa-solid fa-compass', title: 'Local Discovery', desc: 'Customers browse businesses by category and location, finding exactly what they need nearby.' },
    { icon: 'fa-solid fa-star', title: 'Build Reputation', desc: 'Collect reviews and ratings from satisfied customers to build trust and credibility online.' },
    { icon: 'fa-solid fa-mobile-screen', title: 'Mobile-Friendly', desc: 'Fully responsive design ensures a great experience on any device, from desktop to smartphone.' },
]

function scrollToFeatures() {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
}

export default function Landing() {
    return (
        <>
            <AnimatedBackground />
            <div className="page">

                {/* Navbar — logo only */}
                <nav className="navbar">
                    <div className="container nav-inner">
                        <Link to="/" className="brand-logo">
                            <div className="logo-icon-wrap">
                                <i className="fa-solid fa-chart-line" style={{ color: '#fff' }}></i>
                            </div>
                            <span>SellSmart</span>
                        </Link>
                    </div>
                </nav>

                {/* Hero */}
                <header className="hero">
                    <div className="hero-content">
                        {/* Logo above badge */}
                        <div className="hero-logo">
                            <div className="logo-icon-wrap" style={{ width: '58px', height: '58px', fontSize: '1.5rem' }}>
                                <i className="fa-solid fa-chart-line" style={{ color: '#fff' }}></i>
                            </div>
                            <span style={{
                                fontSize: '2.2rem', fontWeight: 800,
                                background: 'linear-gradient(90deg, #818cf8, #c084fc)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                            }}>SellSmart</span>
                        </div>
                        <div className="hero-badge">
                            <i className="fa-solid fa-eye"></i>
                            Because every business needs visibility
                        </div>
                        <h1>
                            Your Local Business,<br />
                            <span className="grad">Discovered Online</span>
                        </h1>
                        <p className="hero-sub">
                            SellSmart connects micro-businesses with nearby customers. Upload your work,
                            showcase your services, and let customers find and contact you instantly.
                        </p>
                        <div className="hero-actions">
                            {/* Scrolls down to features */}
                            <button className="btn-ghost" onClick={scrollToFeatures}>
                                <i className="fa-solid fa-magnifying-glass"></i>
                                Discover SellSmart
                            </button>
                            {/* Goes to auth role selector */}
                            <Link to="/role-select" className="btn-primary">
                                <i className="fa-solid fa-rocket"></i>
                                Get Started
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Features — scroll target */}
                <section id="features">
                    <div className="container">
                        <div className="section-header">
                            <span className="section-label">Features</span>
                            <h2>Everything Your Business <span className="grad">Needs to Shine</span></h2>
                            <p>From profile creation to customer connection — SellSmart gives local businesses the digital tools they deserve.</p>
                        </div>
                        <div className="features-grid">
                            {features.map((f, i) => (
                                <div className="feature-card" key={i}>
                                    <div className="feature-icon">
                                        <i className={f.icon}></i>
                                    </div>
                                    <h3>{f.title}</h3>
                                    <p>{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Section */}
                <section className="why-section">
                    <div className="container">
                        <div className="why-inner">
                            <div className="why-text">
                                <span className="section-label">Why SellSmart</span>
                                <h2>Built for <span className="grad">Local Heroes</span></h2>
                                <p>
                                    Micro-businesses are the backbone of every community. Whether you're a tailor,
                                    a baker, a photographer, or a beautician — you deserve a platform designed just for you.
                                    SellSmart puts you on the digital map and connects you directly with customers in your area.
                                </p>
                            </div>
                            <div className="stats-glass">
                                <div className="stat-item">
                                    <span className="stat-number">—</span>
                                    <span className="stat-label">Businesses Listed</span>
                                </div>
                                <div className="stat-divider"></div>
                                <div className="stat-item">
                                    <span className="stat-number">—</span>
                                    <span className="stat-label">Customers Connected</span>
                                </div>
                                <div className="stat-divider"></div>
                                <div className="stat-item">
                                    <span className="stat-number">24/7</span>
                                    <span className="stat-label">Support</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA — no button, just text */}
                <section>
                    <div className="container">
                        <div className="cta-box">
                            <h2>Ready to Grow Your <span className="grad">Local Business?</span></h2>
                            <p>Join thousands of micro-business owners who are already using SellSmart to reach more customers every day.</p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="footer">
                    <div className="container footer-inner">
                        <Link to="/" className="brand-logo">
                            <div className="logo-icon-wrap" style={{ width: '34px', height: '34px', fontSize: '.9rem' }}>
                                <i className="fa-solid fa-chart-line" style={{ color: '#fff' }}></i>
                            </div>
                            <span style={{ fontSize: '1.2rem' }}>SellSmart</span>
                        </Link>
                        <span className="footer-tagline">Connecting local businesses with nearby customers.</span>
                        <div className="footer-copy">2026 SellSmart</div>
                    </div>
                </footer>

            </div>
        </>
    )
}



