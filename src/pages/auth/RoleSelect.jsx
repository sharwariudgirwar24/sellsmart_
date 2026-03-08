import { Link } from 'react-router-dom'
import AnimatedBackground from '../../components/shared/AnimatedBackground'
import Navbar from '../../components/shared/Navbar'
import '../../styles/auth.css'

/**
 * RoleSelect – Auth gate. Users choose between Vendor (Business) and Customer
 * before being routed to the specific login / signup page.
 *
 * Routes:
 *   Business card  → /vendor-login
 *   Customer card  → /customer-login
 */
export default function RoleSelect() {
    return (
        <>
            <AnimatedBackground />
            <Navbar />
            <div className="page-wrapper">
                <Link to="/" className="back-home-btn">
                    <i className="fa-solid fa-arrow-left"></i> Back to Home
                </Link>

                <div className="auth-card">
                    <div className="landing-header">
                        <div className="badge">
                            <i className="fa-solid fa-right-to-bracket"></i> Welcome to SellSmart
                        </div>
                        <h2>Continue as…</h2>
                        <p>Choose your account type to log in or sign up.</p>
                    </div>

                    <div className="role-grid">
                        {/* Vendor / Business */}
                        <Link className="role-card" to="/vendor-login">
                            <div className="role-icon-wrap">
                                <i className="fa-solid fa-store"></i>
                            </div>
                            <span>Business Owner</span>
                            <small>Showcase your work &amp; connect with customers</small>
                            <span className="arrow-hint" style={{ opacity: 1, transform: 'none', fontSize: '.78rem', color: 'var(--indigo-lt)', fontWeight: 600 }}>
                                <i className="fa-solid fa-arrow-right"></i> Log In / Sign Up
                            </span>
                        </Link>

                        {/* Customer */}
                        <Link className="role-card" to="/customer-login">
                            <div className="role-icon-wrap" style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>
                                <i className="fa-solid fa-user-tag"></i>
                            </div>
                            <span>Customer</span>
                            <small>Discover local businesses near you</small>
                            <span className="arrow-hint" style={{ opacity: 1, transform: 'none', fontSize: '.78rem', color: '#c084fc', fontWeight: 600 }}>
                                <i className="fa-solid fa-arrow-right"></i> Log In / Sign Up
                            </span>
                        </Link>
                    </div>
                </div>

                <p className="copyright">© 2026 SellSmart. All rights reserved.</p>
            </div>
        </>
    )
}
