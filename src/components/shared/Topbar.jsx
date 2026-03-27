import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Topbar({ title, subtitle, role = 'business', onMenuClick, user, onAvatarClick, onBack }) {
    const navigate = useNavigate()
    
    const displayName = user?.FullName || (role === 'business' ? 'Business Account' : 'Customer Account');
    const initial = displayName.charAt(0).toUpperCase();

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
                    <div className={role === 'business' ? 'topbar-avatar' : 'tb-avatar'} onClick={toggleProfile} style={{ cursor: 'pointer', overflow: 'hidden' }}>
                        {user?.avatar?.url ? (
                            <img src={user.avatar.url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : initial}
                    </div>
                    {showProfile && (
                        <div className="dropdown-menu profile-menu">
                            <div className="dropdown-header">{displayName}</div>
                            <button className="dropdown-item" onClick={onAvatarClick}><i className="fa-solid fa-user"></i> Profile</button>
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0.5rem 0' }}></div>
                            <button className="dropdown-item text-error" onClick={() => navigate('/role-select')}><i className="fa-solid fa-right-from-bracket"></i> Logout</button>
                        </div>
                    )}
                </div>

                {/* Search Overlay */}
                {showSearch && (
                    <div className="search-overlay-c">
                        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
                            <input 
                                type="text" 
                                placeholder="Search businesses..." 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                                className="top-search-input"
                                autoFocus 
                            />
                            <button type="submit" className="top-search-btn">Go</button>
                        </form>
                    </div>
                )}
            </div>

            <style>{`
                .search-overlay-c {
                    position: absolute;
                    top: 120%;
                    right: 0;
                    background: rgba(30, 41, 59, 0.95);
                    backdrop-filter: blur(10px);
                    padding: 12px;
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.1);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                    z-index: 100;
                    min-width: 280px;
                    animation: slideDown 0.2s ease;
                }
                .top-search-input {
                    flex: 1;
                    padding: 10px 14px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    color: white;
                    outline: none;
                    font-size: 0.9rem;
                    transition: border-color 0.2s;
                }
                .top-search-input:focus {
                    border-color: var(--sky);
                }
                .top-search-btn {
                    padding: 8px 16px;
                    background: var(--sky-dark);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background 0.2s;
                }
                .top-search-btn:hover {
                    background: var(--sky);
                }
                @media (max-width: 480px) {
                    .search-overlay-c {
                        position: fixed;
                        top: 70px;
                        left: 15px;
                        right: 15px;
                        min-width: 0;
                        width: auto;
                    }
                }

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
