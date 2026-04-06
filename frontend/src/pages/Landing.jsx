import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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
        <div className="landing-root">
            <AnimatedBackground />
            
            <nav className="navbar">
                <div className="container nav-inner">
                    <Link to="/" className="brand-logo">
                        <div className="logo-icon-wrap">
                            <i className="fa-solid fa-chart-line"></i>
                        </div>
                        <span>SellSmart</span>
                    </Link>
                    <Link to="/role-select" className="btn-primary" style={{ padding: '0.8rem 1.6rem', fontSize: '0.9rem' }}>
                        Start Selling
                    </Link>
                </div>
            </nav>

            <main className="page">
                <section className="hero">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="hero-content"
                    >
                        <div className="hero-badge">
                            🚀 The Marketplace for Local Talent
                        </div>
                        
                        <h1>
                            Your Local Business,<br />
                            <span className="grad">Discovered Online</span>
                        </h1>
                        
                        <p className="hero-sub">
                            SellSmart is the professional bridge between micro-businesses and local demand. 
                            Showcase your portfolio, build trust, and grow your community footprint.
                        </p>
                        
                        <div className="hero-actions">
                            <Link to="/role-select" className="btn-primary">
                                Launch Your Profile
                            </Link>
                            <button className="btn-ghost" onClick={scrollToFeatures}>
                                Learn How it Works
                            </button>
                        </div>
                    </motion.div>
                </section>

                <section id="features">
                    <div className="container">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="section-header"
                        >
                            <span className="section-label">Capabilities</span>
                            <h2>Empowering Personal <span className="grad">Entrepreneurship</span></h2>
                            <p>Everything you need to turn your local craft into a digital powerhouse.</p>
                        </motion.div>
                        
                        <div className="features-grid">
                            {features.map((f, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="feature-card"
                                >
                                    <div className="feature-icon">
                                        <i className={f.icon}></i>
                                    </div>
                                    <h3>{f.title}</h3>
                                    <p>{f.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="why-section" style={{ padding: '10rem 0' }}>
                    <div className="container">
                        <div className="why-inner" style={{ background: 'var(--navy)', borderRadius: '40px', padding: '5rem', color: 'white' }}>
                            <div className="why-text">
                                <h2 style={{ color: 'white', fontSize: '3.5rem', marginBottom: '2rem' }}>Born for the <span style={{ color: 'var(--sky)' }}>Local Economy</span></h2>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', maxWidth: '600px' }}>
                                    We believe micro-businesses are the heartbeat of neighborhoods. 
                                    Tailors, bakers, artisans – you deserve a platform that treats your business 
                                    with the professional respect it commands.
                                </p>
                            </div>
                            
                            <div className="stats-glass" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                                <div className="stat-item">
                                    <span className="stat-number" style={{ color: 'white' }}>2k+</span>
                                    <span className="stat-label" style={{ color: 'rgba(255,255,255,0.5)' }}>Verified Partners</span>
                                </div>
                                <div className="stat-divider" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
                                <div className="stat-item">
                                    <span className="stat-number" style={{ color: 'var(--sky)' }}>4.9/5</span>
                                    <span className="stat-label" style={{ color: 'rgba(255,255,255,0.5)' }}>Trust Rating</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="footer">
                <div className="container footer-inner">
                    <Link to="/" className="brand-logo" style={{ marginBottom: '1rem' }}>
                        <div className="logo-icon-wrap" style={{ width: '36px', height: '36px', fontSize: '1rem' }}>
                            <i className="fa-solid fa-chart-line"></i>
                        </div>
                        <span style={{ fontSize: '1.4rem' }}>SellSmart</span>
                    </Link>
                    <p className="footer-tagline">Digitizing the storefront for every micro-entrepreneur.</p>
                    <div className="footer-copy">© 2026 SellSmart. All Rights Reserved.</div>
                </div>
            </footer>
        </div>
    )
}
