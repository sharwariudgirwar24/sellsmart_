import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar'
import AnimatedBackground from '../../components/shared/AnimatedBackground'
import { useAppData } from '../../context/AppDataContext'
import '../../styles/auth.css'

export default function CustomerSignup() {
    const navigate = useNavigate()
    const { register } = useAppData()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = Object.fromEntries(new FormData(e.target))
        formData.role = 'customer'

        try {
            const res = register(formData)
            if (res.success) {
                setTimeout(() => navigate('/customer-dashboard'), 600)
            } else {
                setError(res.error || 'Registration failed')
                setLoading(false)
            }
        } catch (err) {
            setError('An error occurred during registration.')
            setLoading(false)
        }
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
                            <h3>Customer Sign Up</h3>
                            <p>Create your customer account</p>
                        </div>
                        <span className="role-badge customer">
                            <i className="fa-solid fa-user-tag"></i> Customer
                        </span>
                    </div>

                    {error && <p style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '.85rem' }}>{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="c-name">Full Name</label>
                                <div className="input-wrap">
                                    <i className="fa-solid fa-user"></i>
                                    <input id="c-name" name="name" type="text" className="form-input"
                                        placeholder="John Smith" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="c-email">Email Address</label>
                                <div className="input-wrap">
                                    <i className="fa-regular fa-envelope"></i>
                                    <input id="c-email" name="email" type="email" className="form-input"
                                        placeholder="you@example.com" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="c-phone">Mobile Number</label>
                                <div className="input-wrap">
                                    <i className="fa-solid fa-phone"></i>
                                    <input id="c-phone" name="phone" type="tel" className="form-input"
                                        placeholder="+91 9876543210" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="c-pass">Password</label>
                                <div className="input-wrap">
                                    <i className="fa-solid fa-lock"></i>
                                    <input id="c-pass" name="password" type="password" className="form-input"
                                        placeholder="Create a strong password" required />
                                </div>
                            </div>
                            <button type="submit" className="submit-btn" disabled={loading}>
                                <i className="fa-solid fa-user-plus"></i>
                                {loading ? 'Creating account…' : 'Create Customer Account'}
                            </button>
                            <p className="terms-text">
                                By signing up you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                            </p>
                        </div>
                    </form>

                    <div className="card-footer-text">
                        Already have an account? <Link to="/customer-login">Log in</Link>
                    </div>
                </div>

                <p className="copyright">2026 SellSmart</p>
            </div>
        </>
    )
}
