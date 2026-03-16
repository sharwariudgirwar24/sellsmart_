import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Topbar({ title, subtitle, role = 'business', onMenuClick, user, onAvatarClick, onBack }) {
    const navigate = useNavigate()
    
    const dbName = user ? (role === 'business' ? user.BusinessName : user.FullName) : null;
    const initial = dbName ? dbName.charAt(0).toUpperCase() : (role === 'business' ? 'B' : 'C');

    const [showSearch, setShowSearch] = useState(false);
    const [showNotif, setShowNotif] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleSearch = () => {
        setShowSearch(!showSearch);
        setShowNotif(false);
        setShowProfile(false);
    }

    const toggleNotif = () => {
        setShowNotif(!showNotif);
        setShowSearch(false);
        setShowProfile(false);
    }

    const toggleProfile = () => {
        setShowProfile(!showProfile);
        setShowSearch(false);
        setShowNotif(false);
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        alert(`Searching for: ${searchQuery}`);
        setShowSearch(false);
    }

    return (
        <header className="topbar">
            {/* Mobile hamburger */}
            <button className="hamburger" onClick={onMenuClick}>
                <i className="fa-solid fa-bars"></i>
            </button>

            {/* Back button */}
            <button className="icon-btn" title="Go back" onClick={onBack || (() => navigate(-1))} style={{ flexShrink: 0 }}>
                <i className="fa-solid fa-arrow-left"></i>
            </button>

            <div className="topbar-title">
                {title}
                {subtitle && <span>{subtitle}</span>}
            </div>

            <div className={role === 'business' ? 'topbar-actions' : 'tb-actions'} style={{ position: 'relative' }}>
                {/* Search */}
                <button className="icon-btn" title="Search" onClick={toggleSearch}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>

                {/* Notifications */}
                <div style={{ position: 'relative' }}>
                    <button className="icon-btn" title="Notifications" onClick={toggleNotif}>
                        <i className="fa-solid fa-bell"></i>
                        <span className="notif-dot"></span>
                    </button>
                    {showNotif && (
                        <div className="dropdown-menu notif-menu">
                            <div className="dropdown-header">Notifications</div>
                            <div className="dropdown-item" style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem' }}>
                                No new notifications right now.
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div style={{ position: 'relative' }}>
                    <div className={role === 'business' ? 'topbar-avatar' : 'tb-avatar'} onClick={toggleProfile} style={{ cursor: 'pointer' }}>
                        {initial}
                    </div>
                    {showProfile && (
                        <div className="dropdown-menu profile-menu">
                            <div className="dropdown-header">{dbName || (role === 'business' ? 'Business' : 'Customer')}</div>
                            <button className="dropdown-item" onClick={onAvatarClick}><i className="fa-solid fa-user"></i> Profile</button>
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0.5rem 0' }}></div>
                            <button className="dropdown-item text-error" onClick={() => navigate('/role-select')}><i className="fa-solid fa-right-from-bracket"></i> Logout</button>
                        </div>
                    )}
                </div>

                {/* Search Overlay */}
                {showSearch && (
                    <div style={{ position: 'absolute', top: '120%', right: '0', background: 'rgba(30, 41, 59, 0.95)', backdropFilter: 'blur(10px)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 100, minWidth: '250px' }}>
                        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '5px' }}>
                            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', outline: 'none' }} autoFocus />
                            <button type="submit" style={{ padding: '8px 12px', background: 'var(--indigo-lt)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Go</button>
                        </form>
                    </div>
                )}
            </div>

            <style>{`
                .dropdown-menu {
                    position: absolute;
                    top: 130%;
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
                .notif-menu { width: 280px; }
                .profile-menu { width: 180px; }
                .dropdown-header {
                    padding: 0.5rem 0.75rem;
                    font-weight: 600;
                    font-size: 0.85rem;
                    color: var(--muted);
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
                    color: white;
                    font-family: inherit;
                    width: 100%;
                    text-align: left;
                    font-size: 0.9rem;
                }
                .dropdown-item:hover {
                    background: rgba(255,255,255,0.05);
                }
                .text-error { color: var(--error) !important; }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </header>
    )
}
