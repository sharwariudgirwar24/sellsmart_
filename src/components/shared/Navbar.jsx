import { Link } from 'react-router-dom'

/**
 * Navbar – Top navigation bar shown on auth pages.
 * Props:
 *   transparent {bool} – Use transparent background (default: false)
 */
export default function Navbar({ transparent = false }) {
    return (
        <nav className="navbar" style={transparent ? { background: 'transparent', boxShadow: 'none' } : {}}>
            <div className="container nav-inner">
                <Link to="/" className="brand-logo">
                    <div className="logo-icon-wrap" style={{ width: '36px', height: '36px', fontSize: '1rem' }}>
                        <i className="fa-solid fa-chart-line" style={{ color: '#fff' }}></i>
                    </div>
                    <span>SellSmart</span>
                </Link>

                <div className="nav-links">
                    <Link to="/role-select" className="nav-link">Login</Link>
                    <Link to="/role-select" className="nav-cta">Get Started</Link>
                </div>
            </div>
        </nav>
    )
}
