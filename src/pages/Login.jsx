import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AnimatedBackground from '../components/AnimatedBackground'
import '../styles/auth.css'

export default function Login() {
    const [step, setStep] = useState('role') // 'role' | 'business' | 'customer'
    const navigate = useNavigate()

    const handleLogin = (e, role) => {
        e.preventDefault()
        // TODO: integrate with backend API
        if (role === 'business') navigate('/business-dashboard')
        else navigate('/customer-dashboard')
    }

    return (
        <>
            <AnimatedBackground />
            <div className="page-wrapper">
                <Link to="/" className="back-home-btn">
                    <i className="fa-solid fa-arrow-left"></i> Back to Home
                </Link>

                <Link to="/" className="brand-logo">
                    <div className="logo-icon-wrap">
                        <i className="fa-solid fa-chart-line" style={{ color: '#fff' }}></i>
                    </div>
                    <span>SellSmart</span>
                </Link>
                <p className="brand-tagline">Connecting local businesses with nearby customers.</p>

                {/* Step 1: Role Selection */}
                {step === 'role' && (
                    <div className="auth-card">
                        <div className="landing-header">
                            <div className="badge"><i className="fa-solid fa-right-to-bracket"></i> Welcome Back</div>
                            <h2>Log in to <span>SellSmart</span></h2>
                            <p>Choose your role to access your dashboard.</p>
                        </div>
                        <div className="role-grid">
                            <div className="role-card" onClick={() => setStep('business')}>
                                <div className="role-icon-wrap"><i className="fa-solid fa-store"></i></div>
                                <span>Business</span>
                                <small>Manage your profile, posts & customer connections</small>
                            </div>
                            <div className="role-card" onClick={() => setStep('customer')}>
                                <div className="role-icon-wrap" style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>
                                    <i className="fa-solid fa-user-tag"></i>
                                </div>
                                <span>Customer</span>
                                <small>Discover local businesses & connect with them</small>
                            </div>
                        </div>
                        <div className="card-footer-text">
                            New to SellSmart? <Link to="/signup">Create an account</Link>
                        </div>
                    </div>
                )}

                {/* Step 2a: Business Login Form */}
                {step === 'business' && (
                    <div className="auth-card">
                        <div className="form-card-header">
                            <button className="back-btn" onClick={() => setStep('role')}>
                                <i className="fa-solid fa-arrow-left"></i> Back
                            </button>
                            <div className="form-title">
                                <h3>Business Login</h3>
                                <p>Access your business dashboard</p>
                            </div>
                            <span className="role-badge business"><i className="fa-solid fa-store"></i> Business</span>
                        </div>
                        <form onSubmit={(e) => handleLogin(e, 'business')}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="b-email">Business Email</label>
                                    <div className="input-wrap">
                                        <i className="fa-regular fa-envelope"></i>
                                        <input id="b-email" type="email" className="form-input" placeholder="contact@mystore.com" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="b-pass">Password</label>
                                    <div className="input-wrap">
                                        <i className="fa-solid fa-lock"></i>
                                        <input id="b-pass" type="password" className="form-input" placeholder="••••••••" required />
                                    </div>
                                </div>
                                <div className="forgot-row">
                                    <a href="#" className="forgot-link">Forgot password?</a>
                                </div>
                                <button type="submit" className="submit-btn">
                                    <i className="fa-solid fa-right-to-bracket"></i>
                                    Log In as Business
                                </button>
                            </div>
                        </form>
                        <div className="card-footer-text">
                            New here? <Link to="/signup">Create a business account</Link>
                        </div>
                    </div>
                )}

                {/* Step 2b: Customer Login Form */}
                {step === 'customer' && (
                    <div className="auth-card">
                        <div className="form-card-header">
                            <button className="back-btn" onClick={() => setStep('role')}>
                                <i className="fa-solid fa-arrow-left"></i> Back
                            </button>
                            <div className="form-title">
                                <h3>Customer Login</h3>
                                <p>Explore local businesses near you</p>
                            </div>
                            <span className="role-badge customer"><i className="fa-solid fa-user-tag"></i> Customer</span>
                        </div>
                        <form onSubmit={(e) => handleLogin(e, 'customer')}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="c-email">Email Address</label>
                                    <div className="input-wrap">
                                        <i className="fa-regular fa-envelope"></i>
                                        <input id="c-email" type="email" className="form-input" placeholder="you@example.com" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="c-pass">Password</label>
                                    <div className="input-wrap">
                                        <i className="fa-solid fa-lock"></i>
                                        <input id="c-pass" type="password" className="form-input" placeholder="••••••••" required />
                                    </div>
                                </div>
                                <div className="forgot-row">
                                    <a href="#" className="forgot-link">Forgot password?</a>
                                </div>
                                <button type="submit" className="submit-btn">
                                    <i className="fa-solid fa-right-to-bracket"></i>
                                    Log In as Customer
                                </button>
                            </div>
                        </form>
                        <div className="card-footer-text">
                            New here? <Link to="/signup">Create an account</Link>
                        </div>
                    </div>
                )}

                <p className="copyright">© 2026 SellSmart. All rights reserved.</p>
            </div>
        </>
    )
}
