import { Link } from 'react-router-dom'

export default function BrandLogo({ to = '/', size = 'md' }) {
    const iconSize = size === 'sm' ? '36px' : '42px'
    const fontSize = size === 'sm' ? '1.15rem' : '1.5rem'
    const iconFontSize = size === 'sm' ? '.9rem' : '1.1rem'

    return (
        <Link to={to} className="brand-logo" style={{ textDecoration: 'none' }}>
            <div className="logo-icon-wrap" style={{ width: iconSize, height: iconSize, fontSize: iconFontSize }}>
                <i className="fa-solid fa-chart-line" style={{ color: '#fff' }}></i>
            </div>
            <span style={{ fontSize }}>SellSmart</span>
        </Link>
    )
}
