import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar'
import Topbar from '../../components/shared/Topbar'
import BusinessCard from '../../components/customer/BusinessCard'
import CategoryCard from '../../components/customer/CategoryCard'
import ChatBox from '../../components/shared/ChatSection'
import { useAppData } from '../../context/AppDataContext'
import '../../styles/dashboard.css'

const CATEGORIES = [
    { icon: 'fa-solid fa-scissors', label: 'Fashion & Tailoring' },
    { icon: 'fa-solid fa-camera', label: 'Photography' },
    { icon: 'fa-solid fa-utensils', label: 'Food & Bakery' },
    { icon: 'fa-solid fa-spa', label: 'Beauty & Salon' },
    { icon: 'fa-solid fa-screwdriver-wrench', label: 'Repair & Electronics' },
]

// ─── Explore Section ─────────────────────────────────────────────────────────
function Explore({ vendors, onChatClick }) {
    const [selected, setSelected] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')

    const filtered = useMemo(() => {
        return vendors.filter(v => {
            const matchesCategory = selected === 'All' || v.category === selected

            const nameToMatch = v.businessName || v.name || v.ownerName || ''
            const locationToMatch = v.location || ''
            const categoryToMatch = v.category || ''
            const searchLower = searchQuery.toLowerCase().trim()

            const matchesSearch = !searchLower ||
                nameToMatch.toLowerCase().includes(searchLower) ||
                locationToMatch.toLowerCase().includes(searchLower) ||
                categoryToMatch.toLowerCase().includes(searchLower)

            return matchesCategory && matchesSearch
        })
    }, [vendors, selected, searchQuery])

    return (
        <div className="content">
            {/* Search bar */}
            <div className="card">
                <div className="search-bar">
                    <div className="search-wrap">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input className="search-input" type="text" placeholder="Search businesses, services, or locations…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div>
                <div className="sec-head"><i className="fa-solid fa-grid-2"></i> Browse Categories</div>
                <div className="cat-scroll">
                    <CategoryCard icon="fa-solid fa-th" label="All"
                        active={selected === 'All'} onClick={() => setSelected('All')} />
                    {CATEGORIES.map((c) => (
                        <CategoryCard key={c.label} icon={c.icon} label={c.label}
                            active={selected === c.label} onClick={() => setSelected(c.label)} />
                    ))}
                </div>
            </div>

            {/* Business cards */}
            <div>
                <div className="sec-head">
                    <i className="fa-solid fa-store"></i>
                    {selected === 'All' ? ' Businesses Near You' : ` ${selected} Businesses`}
                    <span style={{ fontSize: '.75rem', color: 'var(--muted)', marginLeft: '.3rem' }}>
                        ({filtered.length} found)
                    </span>
                </div>
                <div className="biz-grid">
                    {filtered.map((b, i) => {
                        const mappedBiz = {
                            id: b.id,
                            icon: b.businessName?.charAt(0),
                            theme: `t${(i % 6) + 1}`,
                            cat: b.category,
                            name: b.businessName,
                            loc: b.location,
                            rating: 4.8,
                            reviews: b.reviews?.length || 0,
                            desc: 'Specializing in custom quality services.',
                            wa: b.whatsapp ? `https://wa.me/${b.whatsapp.replace(/\D/g, '')}` : '#',
                            ig: `https://instagram.com/${b.instagram?.replace('@', '') || ''}`,
                            verified: b.verified
                        }

                        return <BusinessCard key={b.id} business={mappedBiz} onView={() => alert("Preview coming soon!")} onChat={() => onChatClick(b.id, b.businessName)} />
                    })}
                </div>
            </div>
        </div>
    )
}

// ─── Customer Profile Section ─────────────────────────────────────────────────
function Profile({ user, setUser }) {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/me/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(user)
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                setIsEditing(false);
                setMessage("Profile updated successfully!");
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage("Failed to update");
            }
        } catch(err) {
            setMessage("Server error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="content">
            <div className="card">
                <div className="sec-head"><i className="fa-solid fa-user"></i> My Profile</div>
                {message && <p style={{color: 'green', marginBottom: '1rem'}}>{message}</p>}
                
                {!isEditing ? (
                    <div className="profile-hero-c">
                        <div className="p-avatar">
                            {user.FullName ? user.FullName.charAt(0).toUpperCase() : 'U'}
                            <div className="p-cam"><i className="fa-solid fa-camera"></i></div>
                        </div>
                        <div>
                            <div className="p-name">{user.FullName || "User Name"}</div>
                            <div className="p-meta">{user.Email || "email@example.com"} · {user.Phone || "0000000000"}</div>
                            <div className="p-actions" style={{marginTop: '1rem'}}>
                                <button className="btn-primary-d" onClick={() => setIsEditing(true)}>
                                    <i className="fa-solid fa-pen"></i> Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSave} style={{maxWidth: '400px'}}>
                        <div className="form-group-d">
                            <label className="form-label">Full Name</label>
                            <input className="form-input-d" value={user.FullName || ''} onChange={(e) => setUser({...user, FullName: e.target.value})} required />
                        </div>
                        <div className="form-group-d">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-input-d" value={user.Email || ''} onChange={(e) => setUser({...user, Email: e.target.value})} required />
                        </div>
                        <div className="form-group-d">
                            <label className="form-label">Phone</label>
                            <input type="tel" className="form-input-d" value={user.Phone || ''} onChange={(e) => setUser({...user, Phone: e.target.value})} required />
                        </div>
                        <div style={{display: 'flex', gap: '10px', marginTop: '1rem'}}>
                            <button type="submit" className="btn-primary-d" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button type="button" className="btn-ghost-d" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

// ─── Section title map ────────────────────────────────────────────────────────
const TITLES = {
    explore: 'Explore Businesses',
    profile: 'My Profile',
    messages: 'Messages',
    saved: 'Saved Businesses',
}

// ─── CustomerDashboard (main export) ─────────────────────────────────────────
export default function CustomerDashboard() {
    const { vendors, threads, createThread } = useAppData()
    const navigate = useNavigate()

    const [section, setSection] = useState('explore')
    const [history, setHistory] = useState(['explore'])
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [user, setUser] = useState({ FullName: '', Email: '', Phone: '' })

    const handleNavigate = (newSection) => {
        if (newSection !== section) {
            setHistory(prev => [...prev, newSection]);
            setSection(newSection);
        }
    };

    const handleBack = () => {
        if (history.length > 1) {
            const newHistory = [...history];
            newHistory.pop();
            const prev = newHistory[newHistory.length - 1];
            setHistory(newHistory);
            setSection(prev);
        } else {
            navigate('/role-select');
        }
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const res = await fetch("http://localhost:5000/me", { credentials: "include" });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                } else {
                    navigate('/customer-login');
                }
            } catch(e) { console.log(e) }
        }
        fetchUserDetails();
    }, [navigate])

    const handleChatClick = (vendorId, vendorName) => {
        // Mocking thread creation for now since we're using mock vendors from context
        alert(`Starting chat with ${vendorName}. (Mock feature bridged with AppData)`);
        setSection('messages');
    }

    const renderSection = () => {
        switch (section) {
            case 'explore': return <Explore vendors={vendors} onChatClick={handleChatClick} />
            case 'profile': return <Profile user={user} setUser={setUser} />
            case 'messages': return <ChatBox threads={[]} avatarKey="initials" />
            case 'saved': return <div className="content"><p>Saved Businesses coming soon!</p></div>
            default: return <Explore vendors={vendors} onChatClick={handleChatClick} />
        }
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--dark)' }}>
            <Sidebar
                role="customer"
                activeSection={section}
                onNavigate={handleNavigate}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                user={user}
            />
            <div className="main">
                <Topbar
                    title={TITLES[section]}
                    subtitle={user.FullName ? `Hi, ${user.FullName} · SellSmart` : "· SellSmart"}
                    role="customer"
                    onMenuClick={() => setSidebarOpen(true)}
                    user={user}
                    onAvatarClick={() => handleNavigate('profile')}
                    onBack={handleBack}
                />
                {renderSection()}
            </div>
        </div>
    )
}
