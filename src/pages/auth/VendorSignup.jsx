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

    const [bisuness, setBisuness] = useState({
        FullName: "",
        BusinessName: "",
        Phone: "",
        Email: "",
        password: "",
    })


    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleinput = (e) => {
        const name = e.target.name
        const value = e.target.value

        setBisuness({
            ...bisuness,
            [name]: value,
        })
    }

    // input handle
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("form submitted")

        try {
            setLoading(true)
            setError("")

            console.log(bisuness)

            const response = await fetch("http://localhost:5000/vendorsignup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(bisuness),
            })

            const data = await response.json()

            if (response.ok) {
                console.log("Signup Success", data)
                navigate("/vendor-dashboard")
            } else {
                setError("Signup failed")
            }

        } catch (err) {
            console.log(err)
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
                                    <input id="v-owner" name="FullName" type="text" className="form-input"
                                        placeholder="Jane Doe"
                                        value={bisuness.FullName}
                                        onChange={handleinput}

                                        required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="v-biz">Bisuness Name</label>
                                <div className="input-wrap">
                                    <i className="fa-solid fa-store"></i>
                                    <input id="v-biz" name="BusinessName" type="text" className="form-input"
                                        placeholder="Jane's Boutique"
                                        value={bisuness.BusinessName}
                                        onChange={handleinput}

                                        required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="v-email">Business Email</label>
                                <div className="input-wrap">
                                    <i className="fa-regular fa-envelope"></i>
                                    <input id="v-email" name="Email" type="email" className="form-input"
                                        placeholder="contact@mybusiness.com"
                                        value={bisuness.Email}
                                        onChange={handleinput}

                                        required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="v-phone">Mobile Number</label>
                                <div className="input-wrap">
                                    <i className="fa-solid fa-phone"></i>
                                    <input id="v-phone" name="Phone" type="tel" className="form-input"
                                        placeholder="+91 9876543210"
                                        value={bisuness.Phone}
                                        onChange={handleinput}

                                        required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="v-pass">Password</label>
                                <div className="input-wrap">
                                    <i className="fa-solid fa-lock"></i>
                                    <input id="v-pass" name="password" type="password" className="form-input"
                                        placeholder="Create a strong password"
                                        value={bisuness.password}
                                        onChange={handleinput}

                                        required />
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
