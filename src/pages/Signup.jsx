import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AnimatedBackground from '../components/AnimatedBackground'
import '../styles/auth.css'

export default function Signup() {
    const [step, setStep] = useState('choose') // 'choose' | 'business' | 'customer'
    const navigate = useNavigate()

    const handleSignup = (e, role) => {
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

                {/* Step 1: Choose Account Type */}
                {step === 'choose' && (
                    <div className="auth-card wide">
                        <div className="landing-header">
                            <div className="badge"><i className="fa-solid fa-user-plus"></i> Join SellSmart</div>
                            <h2>Create Your <span>Account</span></h2>
                            <p>Choose how you want to use SellSmart.</p>
                        </div>

                        <button className="signup-cta-btn" onClick={() => setStep('business')}>
                            <i className="fa-solid fa-store"></i>
                            Register as a Business Owner
                        </button>

                        <div className="divider">or</div>

                        <div className="role-grid">
                            <div className="role-card" onClick={() => setStep('business')}>
                                <div className="role-icon-wrap"><i className="fa-solid fa-store"></i></div>
                                <span>Business</span>
                                <small>Showcase your work & connect with customers</small>
                                <span className="arrow-hint" style={{ opacity: 1, transform: 'none', fontSize: '.78rem', color: 'var(--indigo-lt)', fontWeight: 600 }}>
                                    <i className="fa-solid fa-arrow-right"></i> Get Started
                                </span>
                            </div>
                            <div className="role-card" onClick={() => setStep('customer')}>
                                <div className="role-icon-wrap" style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>
                                    <i className="fa-solid fa-user-tag"></i>
                                </div>
                                <span>Customer</span>
                                <small>Discover local businesses near you</small>
                                <span className="arrow-hint" style={{ opacity: 1, transform: 'none', fontSize: '.78rem', color: '#c084fc', fontWeight: 600 }}>
                                    <i className="fa-solid fa-arrow-right"></i> Get Started
                                </span>
                            </div>
                        </div>

                        <div className="already-member">
                            Already have an account? <Link to="/login">Log in</Link>
                        </div>
                    </div>
                )}

                {/* Step 2a: Business Signup Form */}
                {step === 'business' && (
                    <div className="auth-card wide">
                        <div className="form-card-header">
                            <button className="back-btn" onClick={() => setStep('choose')}>
                                <i className="fa-solid fa-arrow-left"></i> Back
                            </button>
                            <div className="form-title">
                                <h3>Business Sign Up</h3>
                                <p>Create your business account</p>
                            </div>
                            <span className="role-badge business"><i className="fa-solid fa-store"></i> Business</span>
                        </div>
                        <form onSubmit={(e) => handleSignup(e, 'business')}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="b-name">Your Name</label>
                                    <div className="input-wrap">
                                        <i className="fa-solid fa-user"></i>
                                        <input id="b-name" type="text" className="form-input" placeholder="Jane Doe" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="b-biz">Business Name</label>
                                    <div className="input-wrap">
                                        <i className="fa-solid fa-store"></i>
                                        <input id="b-biz" type="text" className="form-input" placeholder="Jane's Boutique" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="b-email">Business Email</label>
                                    <div className="input-wrap">
                                        <i className="fa-regular fa-envelope"></i>
                                        <input id="b-email" type="email" className="form-input" placeholder="contact@mybusiness.com" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="b-phone">Mobile Number</label>
                                    <div className="input-wrap">
                                        <i className="fa-solid fa-phone"></i>
                                        <input id="b-phone" type="tel" className="form-input" placeholder="+91 9876543210" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="b-pass">Password</label>
                                    <div className="input-wrap">
                                        <i className="fa-solid fa-lock"></i>
                                        <input id="b-pass" type="password" className="form-input" placeholder="Create a strong password" required />
                                    </div>
                                </div>
                                <button type="submit" className="submit-btn">
                                    <i className="fa-solid fa-store"></i>
                                    Create Business Account
                                </button>
                                <p className="terms-text">
                                    By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                                </p>
                            </div>
                        </form>
                    </div>
                )}

                {/* Step 2b: Customer Signup Form */}
                {step === 'customer' && (
                    <div className="auth-card wide">
                        <div className="form-card-header">
                            <button className="back-btn" onClick={() => setStep('choose')}>
                                <i className="fa-solid fa-arrow-left"></i> Back
                            </button>
                            <div className="form-title">
                                <h3>Customer Sign Up</h3>
                                <p>Create your customer account</p>
                            </div>
                            <span className="role-badge customer"><i className="fa-solid fa-user-tag"></i> Customer</span>
                        </div>
                        <form onSubmit={(e) => handleSignup(e, 'customer')}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="c-name">Full Name</label>
                                    <div className="input-wrap">
                                        <i className="fa-solid fa-user"></i>
                                        <input id="c-name" type="text" className="form-input" placeholder="John Smith" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="c-email">Email Address</label>
                                    <div className="input-wrap">
                                        <i className="fa-regular fa-envelope"></i>
                                        <input id="c-email" type="email" className="form-input" placeholder="you@example.com" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="c-phone">Mobile Number</label>
                                    <div className="input-wrap">
                                        <i className="fa-solid fa-phone"></i>
                                        <input id="c-phone" type="tel" className="form-input" placeholder="+91 9876543210" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="c-pass">Password</label>
                                    <div className="input-wrap">
                                        <i className="fa-solid fa-lock"></i>
                                        <input id="c-pass" type="password" className="form-input" placeholder="Create a strong password" required />
                                    </div>
                                </div>
                                <button type="submit" className="submit-btn">
                                    <i className="fa-solid fa-user-plus"></i>
                                    Create Customer Account
                                </button>
                                <p className="terms-text">
                                    By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                                </p>
                            </div>
                        </form>
                    </div>
                )}

                <p className="copyright">© 2026 SellSmart. All rights reserved.</p>
            </div>
        </>
    )
}
