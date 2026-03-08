import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar'
import AnimatedBackground from '../../components/shared/AnimatedBackground'
import '../../styles/auth.css'

/**
 * VendorSignup – Standalone signup page for Business Owners.
 *
 * TODO: Connect to backend API
 *   Endpoint : POST /api/auth/vendor/register
 *   Payload  : { ownerName, businessName, email, phone, password }
 *   Response : { token, vendor }
 *   On success: store token → navigate('/vendor-dashboard')
 */
export default function VendorSignup() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        // ── TODO: replace block below with real API call ──────────────────
        // const formData = Object.fromEntries(new FormData(e.target))
        // const res = await fetch('/api/auth/vendor/register', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData),
        // })
        // const data = await res.json()
        // if (!res.ok) { setError(data.message); setLoading(false); return }
        // localStorage.setItem('token', data.token)
        // ─────────────────────────────────────────────────────────────────
        setTimeout(() => navigate('/vendor-dashboard'), 600)
    }

    return (
        <>
            <AnimatedBackground />
            <Navbar />
            <div className="page-wrapper">
                <Link to="/role-select" className="back-home-btn">
                    <i className="fa-solid fa-arrow-left"></i> Back
                </Link>

                <div className="auth-card wide">
                    <div className="form-card-header">
                        <div className="form-title">
                            <h3>Business Sign Up</h3>
                            <p>Create your vendor account</p>
                        </div>
                        <span className="role-badge business">
                            <i className="fa-solid fa-store"></i> Vendor
                        </span>
                    </div>

                    {error && <p style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '.85rem' }}>{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="v-owner">Your Name</label>
                                <div className="input-wrap">
                                    <i className="fa-solid fa-user"></i>
                                    <input id="v-owner" name="ownerName" type="text" className="form-input"
                                        placeholder="Jane Doe" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="v-biz">Business Name</label>
                                <div className="input-wrap">
                                    <i className="fa-solid fa-store"></i>
                                    <input id="v-biz" name="businessName" type="text" className="form-input"
                                        placeholder="Jane's Boutique" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="v-email">Business Email</label>
                                <div className="input-wrap">
                                    <i className="fa-regular fa-envelope"></i>
                                    <input id="v-email" name="email" type="email" className="form-input"
                                        placeholder="contact@mybusiness.com" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="v-phone">Mobile Number</label>
                                <div className="input-wrap">
                                    <i className="fa-solid fa-phone"></i>
                                    <input id="v-phone" name="phone" type="tel" className="form-input"
                                        placeholder="+91 9876543210" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="v-pass">Password</label>
                                <div className="input-wrap">
                                    <i className="fa-solid fa-lock"></i>
                                    <input id="v-pass" name="password" type="password" className="form-input"
                                        placeholder="Create a strong password" required />
                                </div>
                            </div>
                            <button type="submit" className="submit-btn" disabled={loading}>
                                <i className="fa-solid fa-store"></i>
                                {loading ? 'Creating account…' : 'Create Business Account'}
                            </button>
                            <p className="terms-text">
                                By signing up you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                            </p>
                        </div>
                    </form>

                    <div className="card-footer-text">
                        Already have an account? <Link to="/vendor-login">Log in</Link>
                    </div>
                </div>

                <p className="copyright">© 2026 SellSmart. All rights reserved.</p>
            </div>
        </>
    )
}
