import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar'
import AnimatedBackground from '../../components/shared/AnimatedBackground'
import '../../styles/auth.css'

/**
 * CustomerSignup – Standalone signup page for Customers.
 *
 * TODO: Connect to backend API
 *   Endpoint : POST /api/auth/customer/register
 *   Payload  : { name, email, phone, password }
 *   Response : { token, user }
 *   On success: store token → navigate('/customer-dashboard')
 */
export default function CustomerSignup() {

    const navigate = useNavigate()
  
    const [user, setUser] = useState({
      FullName: "",
      Email: "",
      Phone: "",
      password: "",
    })
  
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
  
    // input handle
    const handleinput = (e) => {
      const name = e.target.name
      const value = e.target.value
  
      setUser({
        ...user,
        [name]: value,
      })
    }
  
    // form submit
    const handleSubmit = async (e) => {
      e.preventDefault()
       console.log("form submitted")
      try {
        setLoading(true)
        setError("")
  
        console.log(user)
  
        const response = await fetch("http://localhost:5000/usersignup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(user),
        })
  
        const data = await response.json()
  
        if (response.ok) {
          console.log("Signup Success", data)
          navigate("/customer-dashboard")
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
                                    <input id="c-name" name="FullName" type="text" className="form-input"
                                        placeholder="John Smith" 
                                        value={user.FullName}
                                        onChange={handleinput}
            
                                required />
                                </div>
                            </div>
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
                                <label htmlFor="c-phone">Mobile Number</label>
                                <div className="input-wrap">
                                    <i className="fa-solid fa-phone"></i>
                                    <input id="c-phone" name="Phone" type="tel" className="form-input"
                                        placeholder="+91 9876543210" 
                                        value={user.Phone}
                                        onChange={handleinput}
            
                                        required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="c-pass">Password</label>
                                <div className="input-wrap">
                                    <i className="fa-solid fa-lock"></i>
                                    <input id="c-pass" name="password" type="password" className="form-input"
                                        placeholder="Create a strong password"
                                        value={user.password}
                                        onChange={handleinput}
            
                                        required />
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

                <p className="copyright">© 2026 SellSmart. All rights reserved.</p>
            </div>
        </>
    )
}
