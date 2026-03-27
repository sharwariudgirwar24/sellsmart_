import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar'
import AnimatedBackground from '../../components/shared/AnimatedBackground'
import { useAppData } from '../../context/AppDataContext'
import '../../styles/auth.css'

export default function CustomerLogin() {
    const navigate = useNavigate()
    const { setAuth } = useAppData()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [user, setUser] = useState({
        Email: "",
        password: "",
    })

    const handleinput = (e) => {
        const name = e.target.name
        const value = e.target.value
        setUser({
            ...user,
            [name]: value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            setError("")
            const response = await fetch("http://localhost:5000/userlogin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(user),
            })
            const data = await response.json()
            if (response.ok) {
                setAuth(data.user, 'customer')
                navigate("/customer-dashboard")
            } else {
                setError(data.message || "Login failed")
            }
        } catch (err) {
            setError("Server error")
        } finally {
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

                <div className="auth-card">
                    <div className="form-card-header">
                        <div className="form-title">
                            <h3>Customer Login</h3>
                            <p>Explore local businesses near you</p>
                        </div>
                        <span className="role-badge customer">
                            <i className="fa-solid fa-user-tag"></i> Customer
                        </span>
                    </div>

                    {error && <p style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '.85rem' }}>{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="c-email">Email Address</label>
                                <div className="input-wrap">
                                    <i className="fa-regular fa-envelope"></i>
                                    <input id="c-email" name="Email" type="email" className="form-input"
                                        placeholder="you@example.com" 
                                        value={user.Email}
                                        onChange={handleinput}
                                        required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="c-pass">Password</label>
                                <div className="input-wrap">
                                    <i className="fa-solid fa-lock"></i>
                                    <input id="c-pass" name="password" type="password" className="form-input"
                                        placeholder="••••••••" 
                                        value={user.password}
                                        onChange={handleinput}
                                        required />
                                </div>
                            </div>
                            <div className="forgot-row">
                                <a href="#" className="forgot-link">Forgot password?</a>
                            </div>
                            <button type="submit" className="submit-btn" disabled={loading}>
                                <i className="fa-solid fa-right-to-bracket"></i>
                                {loading ? 'Logging in…' : 'Log In as Customer'}
                            </button>
                        </div>
                    </form>

                    <div className="card-footer-text">
                        New here? <Link to="/customer-signup">Create an account</Link>
                    </div>
                </div>

                <p className="copyright">2026 SellSmart</p>
            </div>
        </>
    )
}
