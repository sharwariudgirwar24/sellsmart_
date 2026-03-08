import { useState } from 'react'
import Sidebar from '../../components/shared/Sidebar'
import Topbar from '../../components/shared/Topbar'
import BusinessCard from '../../components/customer/BusinessCard'
import CategoryCard from '../../components/customer/CategoryCard'
import ChatBox from '../../components/shared/ChatSection'
import '../../styles/dashboard.css'

// ─── Sample Data (replace with API calls) ──────────────────────────────────
// TODO: GET /api/categories
const CATEGORIES = [
    { icon: 'fa-solid fa-scissors', label: 'Tailoring' },
    { icon: 'fa-solid fa-utensils', label: 'Food' },
    { icon: 'fa-solid fa-camera', label: 'Photography' },
    { icon: 'fa-solid fa-paint-brush', label: 'Art & Craft' },
    { icon: 'fa-solid fa-spa', label: 'Beauty' },
    { icon: 'fa-solid fa-screwdriver-wrench', label: 'Repair' },
    { icon: 'fa-solid fa-music', label: 'Music' },
    { icon: 'fa-solid fa-graduation-cap', label: 'Tutoring' },
    { icon: 'fa-solid fa-leaf', label: 'Home Garden' },
]

// TODO: GET /api/businesses?lat=&lng=&category=
const BUSINESSES = [
    { id: 1, icon: '🧵', theme: 't1', cat: 'Tailoring', name: "Priya's Boutique", loc: 'Pune, 1.2 km', rating: 4.9, reviews: 142, desc: 'Custom stitching, bridal wear & embroidery. 8+ years experience.', wa: 'https://wa.me/919876543210', ig: 'https://instagram.com', verified: true },
    { id: 2, icon: '📸', theme: 't2', cat: 'Photography', name: 'SnapMoments Studio', loc: 'Kothrud, 2.4 km', rating: 4.7, reviews: 88, desc: 'Portrait, event & product photography with professional editing.', wa: 'https://wa.me/919876543211', ig: 'https://instagram.com', verified: true },
    { id: 3, icon: '🍰', theme: 't3', cat: 'Food', name: 'HomeSweet Bakery', loc: 'Baner, 3 km', rating: 4.8, reviews: 203, desc: 'Custom cakes, pastries & homemade chocolates.', wa: 'https://wa.me/919876543212', ig: 'https://instagram.com', verified: false },
    { id: 4, icon: '💆', theme: 't4', cat: 'Beauty', name: 'Glow Parlour', loc: 'Aundh, 1.8 km', rating: 4.6, reviews: 67, desc: 'Facial, waxing, nail art & bridal makeup. Home visits available.', wa: 'https://wa.me/919876543213', ig: 'https://instagram.com', verified: true },
    { id: 5, icon: '🔧', theme: 't5', cat: 'Repair', name: 'FixIt Express', loc: 'Wakad, 4.1 km', rating: 4.5, reviews: 112, desc: 'Electronics & appliance repair. Door-step service available.', wa: 'https://wa.me/919876543214', ig: 'https://instagram.com', verified: false },
    { id: 6, icon: '🎨', theme: 't6', cat: 'Art & Craft', name: 'ArtVibe Studio', loc: 'Hinjawadi, 5 km', rating: 4.8, reviews: 54, desc: 'Handmade artwork, painted décor & custom gifts for all occasions.', wa: 'https://wa.me/919876543215', ig: 'https://instagram.com', verified: true },
]

const MSG_THREADS = [
    { id: 1, name: "Priya's Boutique", preview: 'Your blouse will be ready by Friday!', time: '5m', unread: 1, icon: '🧵', color: '#4f46e5' },
    { id: 2, name: 'SnapMoments Studio', preview: 'Send me the event details please', time: '2h', unread: 0, icon: '📸', color: '#7c3aed' },
    { id: 3, name: 'HomeSweet Bakery', preview: 'Cake is ready for pickup 🎂', time: '1d', unread: 0, icon: '🍰', color: '#9333ea' },
]

// ─── Explore Section ─────────────────────────────────────────────────────────
function Explore() {
    const [selected, setSelected] = useState('All')

    const filtered = selected === 'All'
        ? BUSINESSES
        : BUSINESSES.filter((b) => b.cat === selected)

    return (
        <div className="content">
            {/* Search bar */}
            <div className="card">
                <div className="search-bar">
                    <div className="search-wrap">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input className="search-input" type="text" placeholder="Search businesses, services…" />
                    </div>
                    <button className="filter-btn"><i className="fa-solid fa-sliders"></i> Filter</button>
                    <div className="loc-pill"><i className="fa-solid fa-location-dot"></i> Pune</div>
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
                    {filtered.map((b) => (
                        <BusinessCard key={b.id} business={b} />
                    ))}
                </div>
            </div>
        </div>
    )
}

// ─── Customer Profile Section ─────────────────────────────────────────────────
function Profile() {
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
        </div>
    )
}

// ─── Saved Section ────────────────────────────────────────────────────────────
function Saved() {
    const saved = [BUSINESSES[0], BUSINESSES[1], BUSINESSES[3]]
    return (
        <div className="content">
            <div className="sec-head">
                <i className="fa-solid fa-bookmark"></i> Saved Businesses ({saved.length})
            </div>
            <div className="biz-grid">
                {saved.map((b) => (
                    <BusinessCard key={b.id} business={b} showRemove />
                ))}
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
    const [section, setSection] = useState('explore')
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const renderSection = () => {
        switch (section) {
            case 'explore': return <Explore />
            case 'profile': return <Profile />
            case 'messages': return <ChatBox threads={MSG_THREADS} avatarKey="icon" />
            case 'saved': return <Saved />
            default: return <Explore />
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
