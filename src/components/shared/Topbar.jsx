import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppData } from '../../context/AppDataContext'

export default function Topbar({ title, subtitle, role = 'business', onMenuClick }) {
    const navigate = useNavigate()
    const { currentUser, notifications, markNotificationsRead, logout } = useAppData()
    const [showNotif, setShowNotif] = useState(false)
    const [showProfile, setShowProfile] = useState(false)

    const unreadCount = notifications?.filter(n => !n.read).length || 0

    const toggleNotif = () => {
        setShowNotif(!showNotif)
        setShowProfile(false)
        if (!showNotif && unreadCount > 0) {
            markNotificationsRead()
        }
    }

    const toggleProfile = () => {
        setShowProfile(!showProfile)
        setShowNotif(false)
    }

    const handleLogout = () => {
        logout()
        navigate('/')
    }

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
                {/* Search - handled within pages mostly, can trigger global modal if desired */}
                <button className="icon-btn" title="Search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>

                {/* Notifications */}
                <div style={{ position: 'relative' }}>
                    <button className="icon-btn" title="Notifications" onClick={toggleNotif}>
                        <i className="fa-solid fa-bell"></i>
                        {unreadCount > 0 && <span className="notif-dot"></span>}
                    </button>
                    {showNotif && (
                        <div className="dropdown-menu notif-menu">
                            <div className="dropdown-header">Notifications</div>
                            {notifications?.length === 0 ? (
                                <div className="dropdown-item" style={{ textAlign: 'center', color: 'var(--muted)' }}>No recent notifications</div>
                            ) : (
                                notifications?.map(n => (
                                    <div key={n.id} className="dropdown-item notif-item">
                                        <div className={`notif-icon ${n.type}`}><i className={`fa-solid ${n.type === 'success' ? 'fa-check' : 'fa-info'}`}></i></div>
                                        <div>
                                            <div style={{ fontSize: '.85rem', fontWeight: 600 }}>{n.title}</div>
                                            <div style={{ fontSize: '.7rem', color: 'var(--muted)' }}>{n.time}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div style={{ position: 'relative' }}>
                    <div className={role === 'business' ? 'topbar-avatar' : 'tb-avatar'} onClick={toggleProfile} style={{ cursor: 'pointer' }}>
                        {currentUser?.name?.charAt(0) || currentUser?.ownerName?.charAt(0) || (role === 'business' ? 'B' : 'C')}
                    </div>
                    {showProfile && (
                        <div className="dropdown-menu profile-menu">
                            <div className="dropdown-header">{currentUser?.name || currentUser?.ownerName || 'User'}</div>
                            <button className="dropdown-item" onClick={() => navigate(`/${role}-dashboard`)}><i className="fa-solid fa-user"></i> Dashboard</button>
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0.5rem 0' }}></div>
                            <button className="dropdown-item text-error" onClick={handleLogout}><i className="fa-solid fa-right-from-bracket"></i> Logout</button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .dropdown-menu {
                    position: absolute;
                    top: 120%;
                    right: 0;
                    background: rgba(30, 41, 59, 0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    width: 250px;
                    padding: 0.5rem;
                    z-index: 100;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                    animation: slideDown 0.2s ease;
                }
                .notif-menu { width: 300px; }
                .profile-menu { width: 200px; }
                .dropdown-header {
                    padding: 0.5rem 0.75rem;
                    font-weight: 600;
                    font-size: 0.9rem;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    margin-bottom: 0.5rem;
                }
                .dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                    background: transparent;
                    color: var(--light);
                    font-family: inherit;
                    width: 100%;
                    text-align: left;
                    font-size: 0.9rem;
                }
                .dropdown-item:hover {
                    background: rgba(255,255,255,0.05);
                }
                .text-error { color: var(--error) !important; }
                .notif-item { align-items: flex-start; }
                .notif-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .notif-icon.info { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
                .notif-icon.success { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </header>
    )
}
