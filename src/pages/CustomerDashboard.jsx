import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import '../styles/dashboard.css'

// ─── Sample Data ─────────────────────────────────────────────────────────────
const categories = [
    { icon: 'fa-solid fa-scissors', label: 'Tailoring' },
    { icon: 'fa-solid fa-utensils', label: 'Food' },
    { icon: 'fa-solid fa-camera', label: 'Photography' },
    { icon: 'fa-solid fa-paint-brush', label: 'Art & Craft' },
    { icon: 'fa-solid fa-spa', label: 'Beauty' },
    { icon: 'fa-solid fa-screwdriver-wrench', label: 'Repair' },
    { icon: 'fa-solid fa-music', label: 'Music' },
    { icon: 'fa-solid fa-graduation-cap', label: 'Tutoring' },
    { icon: 'fa-solid fa-leaf', label: 'Home Garden' },
    { icon: 'fa-solid fa-ellipsis', label: 'More' },
]

const businesses = [
    { icon: '🧵', theme: 't1', cat: 'Tailoring', name: "Priya's Boutique", loc: 'Pune, 1.2 km', rating: 4.9, reviews: 142, desc: 'Custom stitching, bridal wear & embroidery. 8+ years experience.', wa: 'https://wa.me/919876543210', ig: 'https://instagram.com', verified: true },
    { icon: '📸', theme: 't2', cat: 'Photography', name: 'SnapMoments Studio', loc: 'Kothrud, 2.4 km', rating: 4.7, reviews: 88, desc: 'Portrait, event & product photography with professional editing.', wa: 'https://wa.me/919876543211', ig: 'https://instagram.com', verified: true },
    { icon: '🍰', theme: 't3', cat: 'Food', name: 'HomeSweet Bakery', loc: 'Baner, 3 km', rating: 4.8, reviews: 203, desc: 'Custom cakes, pastries & homemade chocolates. Order fresh daily.', wa: 'https://wa.me/919876543212', ig: 'https://instagram.com', verified: false },
    { icon: '💆', theme: 't4', cat: 'Beauty', name: 'Glow Parlour', loc: 'Aundh, 1.8 km', rating: 4.6, reviews: 67, desc: 'Facial, waxing, nail art & bridal makeup services. Home visit available.', wa: 'https://wa.me/919876543213', ig: 'https://instagram.com', verified: true },
    { icon: '🔧', theme: 't5', cat: 'Repair', name: 'FixIt Express', loc: 'Wakad, 4.1 km', rating: 4.5, reviews: 112, desc: 'Electronics & appliance repair. Door-step service available.', wa: 'https://wa.me/919876543214', ig: 'https://instagram.com', verified: false },
    { icon: '🎨', theme: 't6', cat: 'Art & Craft', name: 'ArtVibe Studio', loc: 'Hinjawadi, 5 km', rating: 4.8, reviews: 54, desc: 'Handmade artwork, painted décor & custom gifts for all occasions.', wa: 'https://wa.me/919876543215', ig: 'https://instagram.com', verified: true },
]

const savedBusinesses = [businesses[0], businesses[1], businesses[3]]

// ─── Section Components ─────────────────────────────────────────────────────

function Explore({ onNavigate }) {
    const [activeCategory, setActiveCategory] = useState('All')

    return (
        <div className="content">
            {/* Search */}
            <div className="card">
                <div className="search-bar">
                    <div className="search-wrap">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input className="search-input" type="text" placeholder="Search for businesses, services…" />
                    </div>
                    <button className="filter-btn">
                        <i className="fa-solid fa-sliders"></i> Filter
                    </button>
                    <div className="loc-pill">
                        <i className="fa-solid fa-location-dot"></i> Pune
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div>
                <div className="sec-head"><i className="fa-solid fa-grid-2"></i> Browse Categories</div>
                <div className="cat-scroll">
                    <div className={`cat-chip ${activeCategory === 'All' ? 'active' : ''}`} onClick={() => setActiveCategory('All')}>
                        <i className="fa-solid fa-th"></i>
                        <span>All</span>
                    </div>
                    {categories.map((c, i) => (
                        <div className={`cat-chip ${activeCategory === c.label ? 'active' : ''}`} key={i} onClick={() => setActiveCategory(c.label)}>
                            <i className={c.icon}></i>
                            <span>{c.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Business Cards */}
            <div>
                <div className="sec-head"><i className="fa-solid fa-store"></i>
                    {activeCategory === 'All' ? 'Businesses Near You' : activeCategory + ' Businesses'}
                    <span style={{ fontSize: '.75rem', fontWeight: 400, color: 'var(--muted)', marginLeft: '.3rem' }}>
                        ({businesses.length} found)
                    </span>
                </div>
                <div className="biz-grid">
                    {businesses.map((b, i) => (
                        <div className="biz-card" key={i}>
                            <div className={`biz-thumb ${b.theme}`}>
                                <span>{b.icon}</span>
                                <div className="biz-cat-badge">{b.cat}</div>
                                {b.verified && <div className="biz-verified">✓ Verified</div>}
                            </div>
                            <div className="biz-body">
                                <div className="biz-name">{b.name}</div>
                                <div className="biz-loc"><i className="fa-solid fa-location-dot"></i> {b.loc}</div>
                                <div className="biz-stars">
                                    {'★'.repeat(Math.floor(b.rating))}
                                    {b.rating % 1 !== 0 ? '½' : ''}
                                    <span>({b.reviews} reviews)</span>
                                </div>
                                <div className="biz-desc">{b.desc}</div>
                                <div className="biz-actions">
                                    <button className="btn-sm btn-primary-sm"><i className="fa-solid fa-eye"></i> View</button>
                                    <a href={b.wa} className="btn-sm btn-wa-sm" target="_blank" rel="noreferrer">
                                        <i className="fa-brands fa-whatsapp"></i>
                                    </a>
                                    <a href={b.ig} className="btn-sm btn-ig-sm" target="_blank" rel="noreferrer">
                                        <i className="fa-brands fa-instagram"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function CustomerProfile() {
    return (
        <div className="content">
            <div className="card">
                <div className="sec-head"><i className="fa-solid fa-user"></i> My Profile</div>
                <div className="profile-hero-c">
                    <div className="p-avatar">
                        A
                        <div className="p-cam"><i className="fa-solid fa-camera"></i></div>
                    </div>
                    <div>
                        <div className="p-name">Aditi Sharma</div>
                        <div className="p-meta">aditi.sharma@email.com · +91 98765 43210</div>
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

            <div className="card">
                <div className="sec-head"><i className="fa-solid fa-heart"></i> Preferred Categories</div>
                <div className="pref-grid">
                    {[
                        { icon: 'fa-solid fa-scissors', label: 'Tailoring' },
                        { icon: 'fa-solid fa-camera', label: 'Photography' },
                        { icon: 'fa-solid fa-utensils', label: 'Food & Bakery' },
                        { icon: 'fa-solid fa-spa', label: 'Beauty & Wellness' },
                    ].map((p, i) => (
                        <div className="pref-chip" key={i}>
                            <span><i className={p.icon}></i> {p.label}</span>
                            <i className="fa-solid fa-xmark" style={{ color: 'var(--muted)', cursor: 'pointer' }}></i>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const customerThreads = [
    { name: "Priya's Boutique", preview: 'Your blouse will be ready by Friday!', time: '5m', unread: 1, icon: '🧵', color: '#4f46e5' },
    { name: 'SnapMoments Studio', preview: 'Send me the event details please', time: '2h', unread: 0, icon: '📸', color: '#7c3aed' },
    { name: 'HomeSweet Bakery', preview: 'Cake is ready for pickup 🎂', time: '1d', unread: 0, icon: '🍰', color: '#9333ea' },
]

function CustomerMessages() {
    const [activeThread, setActiveThread] = useState(0)
    const [msgText, setMsgText] = useState('')

    return (
        <div className="content">
            <div className="msg-layout">
                <div className="msg-list">
                    <div className="ml-header">Conversations</div>
                    {customerThreads.map((t, i) => (
                        <div className={`msg-thread ${activeThread === i ? 'active' : ''}`} key={i} onClick={() => setActiveThread(i)}>
                            <div className="t-avatar" style={{ background: `linear-gradient(135deg, ${t.color}, #9333ea)`, fontSize: '1rem' }}>{t.icon}</div>
                            <div className="msg-thread-info">
                                <div className="thread-name">{t.name}</div>
                                <div className="thread-preview">{t.preview}</div>
                            </div>
                            <span className="msg-time">{t.time}</span>
                            {t.unread > 0 && <div className="msg-unread">{t.unread}</div>}
                        </div>
                    ))}
                </div>
                <div className="chat-panel">
                    <div className="chat-header">
                        <div className="t-avatar" style={{ background: `linear-gradient(135deg, ${customerThreads[activeThread].color}, #9333ea)`, fontSize: '1rem' }}>
                            {customerThreads[activeThread].icon}
                        </div>
                        <div>
                            <div className="ch-name">{customerThreads[activeThread].name}</div>
                            <div className="ch-status">● Online</div>
                        </div>
                    </div>
                    <div className="chat-messages">
                        <div className="chat-msg received">
                            <div className="bubble">{customerThreads[activeThread].preview}</div>
                            <div className="msg-meta">10:15 AM</div>
                        </div>
                        <div className="chat-msg sent">
                            <div className="bubble">Thank you! That sounds great.</div>
                            <div className="msg-meta">10:18 AM · Seen</div>
                        </div>
                    </div>
                    <div className="chat-input-row">
                        <input className="chat-input" placeholder="Type a message…" value={msgText} onChange={e => setMsgText(e.target.value)} />
                        <button className="send-btn"><i className="fa-solid fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Saved() {
    return (
        <div className="content">
            <div>
                <div className="sec-head"><i className="fa-solid fa-bookmark"></i> Saved Businesses ({savedBusinesses.length})</div>
                <div className="biz-grid">
                    {savedBusinesses.map((b, i) => (
                        <div className="biz-card" key={i}>
                            <div className={`biz-thumb ${b.theme}`}>
                                <span>{b.icon}</span>
                                <div className="biz-cat-badge">{b.cat}</div>
                                {b.verified && <div className="biz-verified">✓ Verified</div>}
                            </div>
                            <div className="biz-body">
                                <div className="biz-name">{b.name}</div>
                                <div className="biz-loc"><i className="fa-solid fa-location-dot"></i> {b.loc}</div>
                                <div className="biz-stars">{'★'.repeat(Math.floor(b.rating))}<span>({b.reviews})</span></div>
                                <div className="biz-desc">{b.desc}</div>
                                <div className="biz-actions">
                                    <button className="btn-sm btn-primary-sm"><i className="fa-solid fa-eye"></i> View</button>
                                    <a href={b.wa} className="btn-sm btn-wa-sm" target="_blank" rel="noreferrer">
                                        <i className="fa-brands fa-whatsapp"></i>
                                    </a>
                                    <button className="btn-sm btn-ghost-sm" title="Remove from saved">
                                        <i className="fa-solid fa-bookmark"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ─── Main CustomerDashboard Component ────────────────────────────────────────
const sectionTitles = {
    explore: 'Explore Businesses',
    profile: 'My Profile',
    messages: 'Messages',
    saved: 'Saved Businesses',
}

export default function CustomerDashboard() {
    const [activeSection, setActiveSection] = useState('explore')
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const renderSection = () => {
        switch (activeSection) {
            case 'explore': return <Explore onNavigate={setActiveSection} />
            case 'profile': return <CustomerProfile />
            case 'messages': return <CustomerMessages />
            case 'saved': return <Saved />
            default: return <Explore onNavigate={setActiveSection} />
        }
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--dark)' }}>
            <Sidebar
                role="customer"
                activeSection={activeSection}
                onNavigate={setActiveSection}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <div className="main">
                <Topbar
                    title={sectionTitles[activeSection]}
                    subtitle="· SellSmart"
                    role="customer"
                    onMenuClick={() => setSidebarOpen(true)}
                />
                {renderSection()}
            </div>
        </div>
    )
}
