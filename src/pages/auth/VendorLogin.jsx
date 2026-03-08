import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar'
import AnimatedBackground from '../../components/shared/AnimatedBackground'
import '../../styles/auth.css'

/**
 * VendorLogin – Standalone login page for Business Owners.
 *
 * TODO: Connect to backend API
 *   Endpoint : POST /api/auth/vendor/login
 *   Payload  : { email, password }
 *   Response : { token, vendor }
 *   On success: store token → navigate('/vendor-dashboard')
 */
export default function VendorLogin() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        // ── TODO: replace block below with real API call ──────────────────
        // const { email, password } = Object.fromEntries(new FormData(e.target))
        // const res = await fetch('/api/auth/vendor/login', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email, password }),
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

                <div className="auth-card">
                    <div className="form-card-header">
                        <div className="form-title">
                            <h3>Business Login</h3>
                            <p>Access your vendor dashboard</p>
                        </div>
                        <span className="role-badge business">
                            <i className="fa-solid fa-store"></i> Vendor
                        </span>
                    </div>

                    {error && <p style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '.85rem' }}>{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="v-email">Business Email</label>
                                <div className="input-wrap">
                                    <i className="fa-regular fa-envelope"></i>
                                    <input id="v-email" name="email" type="email" className="form-input"
                                        placeholder="contact@mybusiness.com" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="v-pass">Password</label>
                                <div className="input-wrap">
                                    <i className="fa-solid fa-lock"></i>
                                    <input id="v-pass" name="password" type="password" className="form-input"
                                        placeholder="••••••••" required />
                                </div>
                            </div>
                            <div className="forgot-row">
                                <a href="#" className="forgot-link">Forgot password?</a>
                            </div>
                            <button type="submit" className="submit-btn" disabled={loading}>
                                <i className="fa-solid fa-right-to-bracket"></i>
                                {loading ? 'Logging in…' : 'Log In as Business'}
                            </button>
                        </div>
                    </form>

                    <div className="card-footer-text">
                        New here? <Link to="/vendor-signup">Create a business account</Link>
                    </div>
                </div>

                <p className="copyright">© 2026 SellSmart. All rights reserved.</p>
            </div>
        </>
    )
}
