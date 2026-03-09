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
                        // Map vendor structure to expected business card structure
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
function Profile({ currentUser }) {
    return (
        <div className="content">
            <div className="card">
                <div className="sec-head"><i className="fa-solid fa-user"></i> My Profile</div>
                <div className="profile-hero-c">
                    <div className="p-avatar">
                        {currentUser?.name?.charAt(0) || 'C'}
                        <div className="p-cam"><i className="fa-solid fa-camera"></i></div>
                    </div>
                    <div>
                        <div className="p-name">{currentUser?.name || 'Customer Name'}</div>
                        <div className="p-meta">{currentUser?.email} · {currentUser?.phone}</div>
                        <div className="p-meta" style={{ marginTop: '.3rem' }}>
                            <i className="fa-solid fa-location-dot" style={{ color: 'var(--indigo-lt)', marginRight: '.3rem' }}></i>
                            Pune, Maharashtra
                        </div>
                        <div className="p-actions">
                            <button className="btn-primary-d"><i className="fa-solid fa-pen"></i> Edit Profile</button>
                            <button className="btn-ghost-d"><i className="fa-solid fa-share-nodes"></i> Share</button>
                        </div>
                    </div>
                </div>
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
    const { currentUser, vendors, threads, createThread } = useAppData()
    const navigate = useNavigate()

    // Redirect if not logged in
    useEffect(() => {
        if (!currentUser || currentUser.role !== 'customer') {
            navigate('/customer-login')
        }
    }, [currentUser, navigate])

    const [section, setSection] = useState('explore')
    const [sidebarOpen, setSidebarOpen] = useState(false)

    if (!currentUser) return null

    const customerThreads = threads.filter(t => t.customerId === currentUser.id)

    const handleChatClick = (vendorId, vendorName) => {
        let existingThread = customerThreads.find(t => t.vendorId === vendorId)
        if (!existingThread) {
            createThread(vendorId, currentUser.id, vendorName)
        }
        setSection('messages')
    }

    const renderSection = () => {
        switch (section) {
            case 'explore': return <Explore vendors={vendors} onChatClick={handleChatClick} />
            case 'profile': return <Profile currentUser={currentUser} />
            case 'messages': return <ChatBox threads={customerThreads} avatarKey="initials" />
            case 'saved': return <div className="content"><p>You don't have any saved businesses yet.</p></div>
            default: return <Explore vendors={vendors} onChatClick={handleChatClick} />
        }
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--dark)' }}>
            <Sidebar
                role="customer"
                activeSection={section}
                onNavigate={setSection}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <div className="main">
                <Topbar
                    title={TITLES[section]}
                    subtitle="· SellSmart"
                    role="customer"
                    onMenuClick={() => setSidebarOpen(true)}
                />
                {renderSection()}
            </div>
        </div>
    )
}
