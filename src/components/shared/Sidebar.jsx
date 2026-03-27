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
    { section: 'feed', icon: 'fa-solid fa-rss', label: 'Feed' },
    { section: 'explore', icon: 'fa-solid fa-compass', label: 'Explore' },
    { section: 'profile', icon: 'fa-solid fa-user', label: 'My Profile' },
    { section: 'messages', icon: 'fa-solid fa-comment-dots', label: 'Messages' },
    { section: 'saved', icon: 'fa-solid fa-bookmark', label: 'Saved' },
]

export default function Sidebar({ role = 'business', activeSection, onNavigate, isOpen, onClose, user }) {
    const navigate = useNavigate()
    const navItems = role === 'business' ? businessNavItems : customerNavItems
    
    // Prioritize Vendor Name (FullName) for the display name and initial
    const vendorName = user?.FullName || (role === 'business' ? 'Business Owner' : 'Customer');
    const bizName = user?.BusinessName || '';
    
    // Determine avatar initial based on Vendor's first alphabet
    const ownerInitial = vendorName.charAt(0).toUpperCase();
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
                    <div className={role === 'business' ? 'owner-avatar' : 'u-avatar'} style={{ overflow: 'hidden' }}>
                        {user?.avatar?.url ? (
                            <img src={user.avatar.url} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : ownerInitial}
                    </div>
                    <div className={role === 'business' ? 'owner-info' : ''}>
                    <div className={role === 'business' ? 'name' : 'u-name'}>{vendorName}</div>
                    {bizName && role === 'business' && <div className="biz-subname" style={{fontSize: '0.7rem', color: 'var(--muted)', marginTop: '2px'}}>{bizName}</div>}
                    <div className={role === 'business' ? 'role' : 'u-role'} style={{marginTop: '4px'}}>{ownerRole}</div>
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
