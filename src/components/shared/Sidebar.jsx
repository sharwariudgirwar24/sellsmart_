import { useNavigate } from 'react-router-dom'

const businessNavItems = [
    { section: 'overview', icon: 'fa-solid fa-gauge', label: 'Overview' },
    { section: 'profile', icon: 'fa-solid fa-store', label: 'My Profile' },
    { section: 'upload', icon: 'fa-solid fa-cloud-arrow-up', label: 'Post Work' },
    { section: 'posts', icon: 'fa-solid fa-images', label: 'My Posts' },
    { section: 'messages', icon: 'fa-solid fa-comment-dots', label: 'Messages' },
    { section: 'settings', icon: 'fa-solid fa-gear', label: 'Settings' },
]

const customerNavItems = [
    { section: 'explore', icon: 'fa-solid fa-compass', label: 'Explore' },
    { section: 'profile', icon: 'fa-solid fa-user', label: 'My Profile' },
    { section: 'messages', icon: 'fa-solid fa-comment-dots', label: 'Messages' },
    { section: 'saved', icon: 'fa-solid fa-bookmark', label: 'Saved' },
]

export default function Sidebar({ role = 'business', activeSection, onNavigate, isOpen, onClose, user }) {
    const navigate = useNavigate()
    const navItems = role === 'business' ? businessNavItems : customerNavItems
    
    // Determine the dynamic custom name based on the logged-in user details
    const dbName = user ? (role === 'business' ? user.BusinessName : user.FullName) : null;
    const ownerName = dbName || (role === 'business' ? 'Business Owner' : 'Customer')
    
    // Determine avatar initials based on the custom name
    const ownerInitial = dbName ? dbName.charAt(0).toUpperCase() : (role === 'business' ? 'B' : 'C')
    const ownerRole = role === 'business' ? 'Business Account' : 'Customer Account'

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                {/* Brand */}
                <div className="sidebar-brand">
                    <div className="brand-icon">
                        <i className="fa-solid fa-chart-line" style={{ color: '#fff' }}></i>
                    </div>
                    <span className="brand-name">SellSmart</span>
                </div>

                {/* User info */}
                <div className={role === 'business' ? 'sidebar-owner' : 'sb-user'} onClick={() => { onNavigate('profile'); onClose(); }} style={{ cursor: 'pointer' }}>
                    <div className={role === 'business' ? 'owner-avatar' : 'u-avatar'}>{ownerInitial}</div>
                    <div className={role === 'business' ? 'owner-info' : ''}>
                        <div className={role === 'business' ? 'name' : 'u-name'}>{ownerName}</div>
                        <div className={role === 'business' ? 'role' : 'u-role'}>{ownerRole}</div>
                    </div>
                </div>

                {/* Nav */}
                <nav className={role === 'business' ? 'sidebar-nav' : 'sb-nav'}>
                    <div className={role === 'business' ? 'nav-label' : 'nav-lbl'}>Navigation</div>
                    {navItems.map((item) => (
                        <div
                            key={item.section}
                            className={`nav-item ${activeSection === item.section ? 'active' : ''}`}
                            onClick={() => { onNavigate(item.section); onClose(); }}
                        >
                            <i className={item.icon}></i>
                            {item.label}
                        </div>
                    ))}
                </nav>

                {/* Logout */}
                <div className={role === 'business' ? 'sidebar-bottom' : 'sb-bottom'}>
                    <button className="logout-btn" onClick={() => navigate('/login')}>
                        <i className="fa-solid fa-right-from-bracket"></i>
                        Logout
                    </button>
                </div>
            </aside>
        </>
    )
}
