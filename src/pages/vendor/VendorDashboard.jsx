import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar'
import Topbar from '../../components/shared/Topbar'
import PostGallery from '../../components/vendor/PostGallery'
import ChatBox from '../../components/shared/ChatSection'
import { useAppData } from '../../context/AppDataContext'
import '../../styles/dashboard.css'

// ─── Overview Section ──────────────────────────────────────────────────────
function Overview({ onNavigate, vendorName, stats }) {
    return (
        <div className="content">
            <div className="dash-welcome">
                <div className="dash-welcome-icon"><i className="fa-solid fa-store"></i></div>
                <div>
                    <h2>Hello {vendorName}! 👋</h2>
                    <p>Your profile is live. Customers can already discover and contact you.</p>
                </div>
            </div>

            <div className="section-heading"><i className="fa-solid fa-chart-bar"></i> Quick Stats</div>
            <div className="dash-stats">
                {[
                    { val: stats?.views || 0, lbl: 'Profile Views', delta: '+12% this week' },
                    { val: stats?.contacts || 0, lbl: 'WhatsApp Contacts', delta: '+5 this week' },
                    { val: stats?.posts || 0, lbl: 'Posts Published', delta: '2 new' },
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
function Profile({ vendor, onEdit }) {
    return (
        <div className="content">
            <div className="card">
                <div className="section-heading"><i className="fa-solid fa-store"></i> Business Profile</div>
                <div className="profile-hero">
                    <div className="profile-avatar-wrap">
                        <div className="profile-avatar">{vendor?.businessName?.charAt(0) || '🧵'}</div>
                        <div className="avatar-cam"><i className="fa-solid fa-camera"></i></div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{vendor?.businessName || 'Your Business'}</h2>
                        <div className="verified"><i className="fa-solid fa-circle-check"></i> Verified Business</div>
                        <div className="cat-tag"><i className="fa-solid fa-tag"></i> {vendor?.category || 'Category'}</div>
                        <div className="profile-meta">
                            <span><i className="fa-solid fa-location-dot"></i> {vendor?.location || 'Location'}</span>
                            <span><i className="fa-solid fa-phone"></i> {vendor?.phone || 'Phone'}</span>
                            <span><i className="fa-regular fa-envelope"></i> {vendor?.email || 'Email'}</span>
                        </div>
                        <div className="profile-actions">
                            <button className="btn-primary-d" onClick={onEdit}><i className="fa-solid fa-pen"></i> Edit Profile</button>
                            {vendor?.whatsapp && (
                                <a href={`https://wa.me/${vendor.whatsapp.replace(/\D/g, '')}`} className="wa-btn" target="_blank" rel="noreferrer">
                                    <i className="fa-brands fa-whatsapp"></i> WhatsApp
                                </a>
                            )}
                            <button className="btn-ghost-d"><i className="fa-solid fa-share-nodes"></i> Share</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Upload Post Section ─────────────────────────────────────────────────────
function UploadSection({ onDone, editingPost, updatePost }) {
    const { addPost } = useAppData()
    const [type, setType] = useState(editingPost?.type || 'image')
    const [avail, setAvail] = useState(editingPost?.available || 'available')
    const [loading, setLoading] = useState(false)

    const handlePublish = (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = Object.fromEntries(new FormData(e.target))

        const postData = {
            type,
            icon: type === 'image' ? (type === 'image' && formData.title.toLowerCase().includes('shirt') ? '👕' : '📸') : '🎥',
            label: type === 'image' ? 'Photo' : 'Video',
            caption: formData.title,
            price: `₹${formData.price}`,
            available: avail
        }

        setTimeout(() => {
            if (editingPost) {
                updatePost(editingPost.id, postData)
            } else {
                addPost(postData)
            }
            setLoading(false)
            onDone()
        }, 700)
    }

    return (
        <div className="content">
            <div className="card">
                <div className="section-heading"><i className="fa-solid fa-cloud-arrow-up"></i> {editingPost ? 'Edit Post' : 'Post Your Work'}</div>
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
                        <input className="form-input-d" name="title" type="text" defaultValue={editingPost?.caption || ''} placeholder="e.g. Festive silk blouse collection" required />
                    </div>
                    <div className="form-group-d">
                        <label className="form-label">Description</label>
                        <textarea className="form-textarea" name="description" placeholder="Describe your work…"></textarea>
                    </div>
                    <div className="price-avail-row">
                        <div className="form-group-d" style={{ marginTop: 0 }}>
                            <label className="form-label">Starting Price (₹)</label>
                            <input className="form-input-d" name="price" type="number" defaultValue={editingPost?.price?.replace(/\D/g, '') || ''} placeholder="500" required />
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
                        {loading ? (editingPost ? 'Updating…' : 'Publishing…') : (editingPost ? 'Update Post' : 'Publish Post')}
                    </button>
                </form>
            </div>
        </div>
    )
}

// ─── Settings Section ────────────────────────────────────────────────────────
function Settings({ vendor, onSave }) {
    const handleSave = (e) => {
        e.preventDefault()
        const formData = Object.fromEntries(new FormData(e.target))
        onSave(formData)
    }

    return (
        <div className="content">
            <form className="card" onSubmit={handleSave}>
                <div className="section-heading"><i className="fa-solid fa-gear"></i> Account Settings</div>
                <div className="settings-grid">
                    {[
                        { label: 'Business Name', type: 'text', val: vendor?.businessName, name: 'businessName' },
                        { label: 'Category', type: 'text', val: vendor?.category, name: 'category' },
                        { label: 'WhatsApp', type: 'tel', val: vendor?.whatsapp || vendor?.phone, name: 'whatsapp' },
                        { label: 'Instagram Handle', type: 'text', val: vendor?.instagram, name: 'instagram' },
                        { label: 'City / Location', type: 'text', val: vendor?.location, name: 'location' },
                    ].map(({ label, type, val, name }) => (
                        <div className="form-group-d" key={name}>
                            <label className="form-label">{label}</label>
                            <input className="form-input-d" type={type} defaultValue={val || ''} name={name} required />
                        </div>
                    ))}
                </div>
                <button type="submit" className="publish-btn" style={{ marginTop: '1.2rem' }}>
                    <i className="fa-solid fa-floppy-disk"></i> Save Changes
                </button>
            </form>
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
    const { currentUser, posts, threads, deletePost, updatePost, updateVendorProfile } = useAppData()
    const navigate = useNavigate()

    // Redirect if not logged in
    useEffect(() => {
        if (!currentUser || currentUser.role !== 'vendor') {
            navigate('/vendor-login')
        }
    }, [currentUser, navigate])

    const [section, setSection] = useState('overview')
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [editingPost, setEditingPost] = useState(null)

    if (!currentUser) return null

    // Filter data for current vendor
    const vendorPosts = posts.filter(p => p.vendorId === currentUser.id)
    const vendorThreads = threads.filter(t => t.vendorId === currentUser.id)

    // Handlers
    const handleEditPost = (post) => {
        setEditingPost(post)
        setSection('upload')
    }

    const handleDeletePost = (post) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            deletePost(post.id)
        }
    }

    const handleSaveSettings = (data) => {
        updateVendorProfile(currentUser.id, data)
        setSection('profile')
    }

    const renderSection = () => {
        switch (section) {
            case 'overview': return <Overview onNavigate={setSection} vendorName={currentUser.name || currentUser.ownerName} stats={{ ...currentUser.stats, posts: vendorPosts.length }} />
            case 'profile': return <Profile vendor={currentUser} onEdit={() => setSection('settings')} />
            case 'upload': return <UploadSection onDone={() => { setSection('posts'); setEditingPost(null); }} editingPost={editingPost} updatePost={updatePost} />
            case 'posts': return <PostGallery posts={vendorPosts} onEdit={handleEditPost} onDelete={handleDeletePost} />
            case 'messages': return <ChatBox threads={vendorThreads} avatarKey="initials" />
            case 'settings': return <Settings vendor={currentUser} onSave={handleSaveSettings} />
            default: return <Overview onNavigate={setSection} vendorName={currentUser.name} />
        }
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--dark)' }}>
            <Sidebar
                role="business"
                activeSection={section}
                onNavigate={(s) => { setEditingPost(null); setSection(s); }}
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
