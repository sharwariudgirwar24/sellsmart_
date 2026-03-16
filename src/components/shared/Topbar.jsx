import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Topbar({ title, subtitle, role = 'business', onMenuClick, user, onAvatarClick, onBack }) {
    const navigate = useNavigate()
    
    // Determine avatar initials based on the custom name if loaded
    const dbName = user ? (role === 'business' ? user.BusinessName : user.FullName) : null;
    const initial = dbName ? dbName.charAt(0).toUpperCase() : (role === 'business' ? 'B' : 'C');

    const [showSearch, setShowSearch] = useState(false);
    const [showNotif, setShowNotif] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleSearch = () => {
        setShowSearch(!showSearch);
        setShowNotif(false);
    }

    const toggleNotif = () => {
        setShowNotif(!showNotif);
        setShowSearch(false);
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
                <button className="icon-btn" title="Search" onClick={toggleSearch}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
                <button className="icon-btn" title="Notifications" onClick={toggleNotif}>
                    <i className="fa-solid fa-bell"></i>
                    <span className="notif-dot"></span>
                </button>
                <div className={role === 'business' ? 'topbar-avatar' : 'tb-avatar'} onClick={onAvatarClick} style={{ cursor: 'pointer' }}>
                    {initial}
                </div>

                {/* Dropdowns */}
                {showSearch && (
                    <div style={{ position: 'absolute', top: '120%', right: '80px', background: 'var(--card-bg, white)', padding: '10px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 100, minWidth: '250px' }}>
                        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '5px' }}>
                            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} autoFocus />
                            <button type="submit" style={{ padding: '8px 12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Go</button>
                        </form>
                    </div>
                )}

                {showNotif && (
                    <div style={{ position: 'absolute', top: '120%', right: '40px', background: 'var(--card-bg, white)', padding: '10px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 100, minWidth: '250px' }}>
                        <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Notifications</h4>
                        <div style={{ fontSize: '0.9rem', color: '#666', padding: '10px 0', textAlign: 'center' }}>
                            No new notifications right now.
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}
