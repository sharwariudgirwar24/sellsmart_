import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar'
import Topbar from '../../components/shared/Topbar'
import PostGallery from '../../components/vendor/PostGallery'
import ChatBox from '../../components/shared/ChatSection'
import '../../styles/dashboard.css'

// ─── Sample Data (replace with API calls) ──────────────────────────────────
// TODO: GET /api/vendor/posts
const SAMPLE_POSTS = [
    { id: 1, icon: '🧵', label: 'Photo', caption: 'Bridal Lehenga Set', price: '₹8,500' },
    { id: 2, icon: '📸', label: 'Photo', caption: 'Silk Blouse Embroidery', price: '₹1,200' },
    { id: 3, icon: '🎥', label: 'Video', caption: 'Stitching Process Reel', price: '₹600' },
    { id: 4, icon: '👗', label: 'Photo', caption: 'Kids Party Wear', price: '₹2,000' },
    { id: 5, icon: '🪡', label: 'Photo', caption: 'Heavy Work Saree Blouse', price: '₹3,500' },
    { id: 6, icon: '✂️', label: 'Photo', caption: 'Casual Kurta – Cotton', price: '₹800' },
]

// TODO: GET /api/messages/threads
const SAMPLE_THREADS = [
    { id: 1, name: 'Ananya S.', preview: 'Hi! I need a blouse in 3 days', time: '2m', unread: 2, initials: 'AS', color: '#4f46e5' },
    { id: 2, name: 'Rahul M.', preview: 'Can you do embroidery work?', time: '1h', unread: 0, initials: 'RM', color: '#7c3aed' },
    { id: 3, name: 'Meera K.', preview: 'What are your charges?', time: '3h', unread: 1, initials: 'MK', color: '#9333ea' },
]

// ─── Overview Section ──────────────────────────────────────────────────────
function Overview({ onNavigate }) {
    return (
        <div className="content">
            <div className="dash-welcome">
                <div className="dash-welcome-icon"><i className="fa-solid fa-store"></i></div>
                <div>
                    <h2>Welcome back, Business Owner! 👋</h2>
                    <p>Your profile is live. Customers can already discover and contact you.</p>
                </div>
            </div>

            <div className="section-heading"><i className="fa-solid fa-chart-bar"></i> Quick Stats</div>
            <div className="dash-stats">
                {[
                    { val: '124', lbl: 'Profile Views', delta: '+12% this week' },
                    { val: '38', lbl: 'WhatsApp Contacts', delta: '+5 this week' },
                    { val: '9', lbl: 'Posts Published', delta: '2 new' },
                ].map(({ val, lbl, delta }) => (
                    <div className="stat-card" key={lbl}>
                        <div className="stat-val">{val}</div>
                        <div className="stat-lbl">{lbl}</div>
                        <div className="stat-delta"><i className="fa-solid fa-arrow-up"></i> {delta}</div>
                    </div>
                ))}
            </div>

            <div className="section-heading"><i className="fa-solid fa-bolt"></i> Quick Actions</div>
            <div className="dash-quick-actions">
                <button className="quick-btn" onClick={() => onNavigate('upload')}>
                    <i className="fa-solid fa-cloud-arrow-up"></i> Post Work
                </button>
                <button className="quick-btn" onClick={() => onNavigate('profile')}>
                    <i className="fa-solid fa-pen-to-square"></i> Edit Profile
                </button>
                <button className="quick-btn" onClick={() => onNavigate('messages')}>
                    <i className="fa-solid fa-comment-dots"></i> Messages
                </button>
            </div>
        </div>
    )
}

// ─── Profile Section ────────────────────────────────────────────────────────
function Profile() {
    return (
        <div className="content">
            <div className="card">
                <div className="section-heading"><i className="fa-solid fa-store"></i> Business Profile</div>
                <div className="profile-hero">
                    <div className="profile-avatar-wrap">
                        <div className="profile-avatar">🧵</div>
                        <div className="avatar-cam"><i className="fa-solid fa-camera"></i></div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Priya's Boutique</h2>
                        <div className="verified"><i className="fa-solid fa-circle-check"></i> Verified Business</div>
                        <div className="cat-tag"><i className="fa-solid fa-tag"></i> Fashion &amp; Tailoring</div>
                        <div className="profile-meta">
                            <span><i className="fa-solid fa-location-dot"></i> Pune, Maharashtra</span>
                            <span><i className="fa-solid fa-phone"></i> +91 98765 43210</span>
                            <span><i className="fa-regular fa-envelope"></i> priya@boutique.com</span>
                        </div>
                        <div className="profile-actions">
                            <button className="btn-primary-d"><i className="fa-solid fa-pen"></i> Edit Profile</button>
                            <a href="https://wa.me/919876543210" className="wa-btn" target="_blank" rel="noreferrer">
                                <i className="fa-brands fa-whatsapp"></i> WhatsApp
                            </a>
                            <button className="btn-ghost-d"><i className="fa-solid fa-share-nodes"></i> Share</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Upload Post Section ─────────────────────────────────────────────────────
function UploadSection({ onDone }) {
    const [type, setType] = useState('image')
    const [avail, setAvail] = useState('available')
    const [loading, setLoading] = useState(false)

    const handlePublish = (e) => {
        e.preventDefault()
        setLoading(true)
        // TODO: POST /api/vendor/posts (multipart/form-data)
        setTimeout(() => { setLoading(false); onDone() }, 700)
    }

    return (
        <div className="content">
            <div className="card">
                <div className="section-heading"><i className="fa-solid fa-cloud-arrow-up"></i> Post Your Work</div>
                <div className="upload-type-row">
                    {['image', 'video'].map((t) => (
                        <button key={t} type="button"
                            className={`upload-type-btn ${type === t ? 'selected' : ''}`}
                            onClick={() => setType(t)}>
                            <i className={`fa-solid fa-${t}`}></i>
                            <span>{t === 'image' ? 'Image Post' : 'Video Post'}</span>
                        </button>
                    ))}
                </div>
                <form onSubmit={handlePublish}>
                    <div className="upload-zone">
                        <i className={`fa-solid fa-${type}`}></i>
                        <strong>Click or drag to upload {type === 'image' ? 'an image' : 'a video'}</strong>
                        <small>{type === 'image' ? 'JPG, PNG, WEBP – max 10 MB' : 'MP4, MOV – max 100 MB'}</small>
                    </div>
                    <div className="form-group-d">
                        <label className="form-label">Title / Caption</label>
                        <input className="form-input-d" name="title" type="text" placeholder="e.g. Festive silk blouse collection" />
                    </div>
                    <div className="form-group-d">
                        <label className="form-label">Description</label>
                        <textarea className="form-textarea" name="description" placeholder="Describe your work…"></textarea>
                    </div>
                    <div className="price-avail-row">
                        <div className="form-group-d" style={{ marginTop: 0 }}>
                            <label className="form-label">Starting Price (₹)</label>
                            <input className="form-input-d" name="price" type="number" placeholder="500" />
                        </div>
                        <div className="form-group-d" style={{ marginTop: 0 }}>
                            <label className="form-label">Availability</label>
                            <div className="avail-toggle">
                                {['available', 'busy'].map((a) => (
                                    <button key={a} type="button"
                                        className={`avail-btn ${avail === a ? 'on' : ''}`}
                                        onClick={() => setAvail(a)}>
                                        {a.charAt(0).toUpperCase() + a.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="publish-btn" disabled={loading}>
                        <i className="fa-solid fa-paper-plane"></i>
                        {loading ? 'Publishing…' : 'Publish Post'}
                    </button>
                </form>
            </div>
        </div>
    )
}

// ─── Settings Section ────────────────────────────────────────────────────────
function Settings() {
    return (
        <div className="content">
            <div className="card">
                <div className="section-heading"><i className="fa-solid fa-gear"></i> Account Settings</div>
                <div className="settings-grid">
                    {[
                        { label: 'Business Name', type: 'text', val: "Priya's Boutique", name: 'businessName' },
                        { label: 'Category', type: 'text', val: 'Fashion & Tailoring', name: 'category' },
                        { label: 'WhatsApp', type: 'tel', val: '+91 98765 43210', name: 'whatsapp' },
                        { label: 'Instagram Handle', type: 'text', val: '@priyasboutique', name: 'instagram' },
                        { label: 'City / Location', type: 'text', val: 'Pune, Maharashtra', name: 'location' },
                    ].map(({ label, type, val, name }) => (
                        <div className="form-group-d" key={name}>
                            <label className="form-label">{label}</label>
                            <input className="form-input-d" type={type} defaultValue={val} name={name} />
                        </div>
                    ))}
                </div>
                {/* TODO: PUT /api/vendor/settings */}
                <button className="publish-btn" style={{ marginTop: '1.2rem' }}>
                    <i className="fa-solid fa-floppy-disk"></i> Save Changes
                </button>
            </div>
        </div>
    )
}

// ─── Section title map ───────────────────────────────────────────────────────
const TITLES = {
    overview: 'Dashboard Overview',
    profile: 'My Business Profile',
    upload: 'Post Work',
    posts: 'My Posts',
    messages: 'Messages',
    settings: 'Settings',
}

// ─── VendorDashboard (main export) ─────────────────────────────────────────
export default function VendorDashboard() {
    const [section, setSection] = useState('overview')
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const navigate = useNavigate()

    const renderSection = () => {
        switch (section) {
            case 'overview': return <Overview onNavigate={setSection} />
            case 'profile': return <Profile />
            case 'upload': return <UploadSection onDone={() => setSection('posts')} />
            case 'posts': return <PostGallery posts={SAMPLE_POSTS} />
            case 'messages': return <ChatBox threads={SAMPLE_THREADS} avatarKey="initials" />
            case 'settings': return <Settings />
            default: return <Overview onNavigate={setSection} />
        }
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--dark)' }}>
            <Sidebar
                role="business"
                activeSection={section}
                onNavigate={setSection}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <div className="main">
                <Topbar
                    title={TITLES[section]}
                    subtitle="· SellSmart Business"
                    role="business"
                    onMenuClick={() => setSidebarOpen(true)}
                />
                {renderSection()}
            </div>
        </div>
    )
}
