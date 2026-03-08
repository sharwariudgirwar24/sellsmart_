import { useNavigate } from 'react-router-dom'

export default function Topbar({ title, subtitle, role = 'business', onMenuClick }) {
    const navigate = useNavigate()

    return (
        <header className="topbar">
            {/* Mobile hamburger */}
            <button className="hamburger" onClick={onMenuClick}>
                <i className="fa-solid fa-bars"></i>
            </button>

            {/* Back button */}
            <button className="icon-btn" title="Go back" onClick={() => navigate(-1)} style={{ flexShrink: 0 }}>
                <i className="fa-solid fa-arrow-left"></i>
            </button>

            <div className="topbar-title">
                {title}
                {subtitle && <span>{subtitle}</span>}
            </div>

            <div className={role === 'business' ? 'topbar-actions' : 'tb-actions'}>
                <button className="icon-btn" title="Search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
                <button className="icon-btn" title="Notifications">
                    <i className="fa-solid fa-bell"></i>
                    <span className="notif-dot"></span>
                </button>
                <div className={role === 'business' ? 'topbar-avatar' : 'tb-avatar'}>
                    {role === 'business' ? 'B' : 'C'}
                </div>
            </div>
        </header>
    )
}
