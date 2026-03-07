import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import '../styles/dashboard.css'

// ─── Section Components ─────────────────────────────────────────────────────

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

            <div>
                <div className="section-heading"><i className="fa-solid fa-chart-bar"></i> Quick Stats</div>
                <div className="dash-stats">
                    <div className="stat-card">
                        <div className="stat-val">124</div>
                        <div className="stat-lbl">Profile Views</div>
                        <div className="stat-delta"><i className="fa-solid fa-arrow-up"></i> +12% this week</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-val">38</div>
                        <div className="stat-lbl">WhatsApp Contacts</div>
                        <div className="stat-delta"><i className="fa-solid fa-arrow-up"></i> +5 this week</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-val">9</div>
                        <div className="stat-lbl">Posts Published</div>
                        <div className="stat-delta"><i className="fa-solid fa-arrow-up"></i> 2 new</div>
                    </div>
                </div>
            </div>

            <div>
                <div className="section-heading"><i className="fa-solid fa-bolt"></i> Quick Actions</div>
                <div className="dash-quick-actions">
                    <button className="quick-btn" onClick={() => onNavigate('upload')}>
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        Post Work
                    </button>
                    <button className="quick-btn" onClick={() => onNavigate('profile')}>
                        <i className="fa-solid fa-pen-to-square"></i>
                        Edit Profile
                    </button>
                    <button className="quick-btn" onClick={() => onNavigate('messages')}>
                        <i className="fa-solid fa-comment-dots"></i>
                        Messages
                    </button>
                </div>
            </div>
        </div>
    )
}

function BusinessProfile() {
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
                        <div className="cat-tag"><i className="fa-solid fa-tag"></i> Fashion & Tailoring</div>
                        <div className="profile-meta">
                            <span><i className="fa-solid fa-location-dot"></i> Pune, Maharashtra</span>
                            <span><i className="fa-solid fa-phone"></i> +91 98765 43210</span>
                            <span><i className="fa-regular fa-envelope"></i> priya@boutique.com</span>
                            <span><i className="fa-solid fa-clock"></i> Mon–Sat, 10 AM – 7 PM</span>
                        </div>
                        <div className="profile-actions">
                            <button className="btn-primary-d"><i className="fa-solid fa-pen"></i> Edit Profile</button>
                            <a href="https://wa.me/919876543210" className="wa-btn" target="_blank" rel="noreferrer">
                                <i className="fa-brands fa-whatsapp"></i> WhatsApp
                            </a>
                            <button className="btn-ghost-d"><i className="fa-solid fa-share-nodes"></i> Share Profile</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="info-2col">
                <div className="info-card">
                    <div className="section-heading"><i className="fa-solid fa-clock"></i> Business Hours</div>
                    {[['Mon–Fri', '10:00 AM – 7:00 PM'], ['Saturday', '11:00 AM – 5:00 PM'], ['Sunday', 'Closed']].map(([day, time]) => (
                        <div className="hours-row" key={day}>
                            <span className="day">{day}</span>
                            <span className={time === 'Closed' ? 'closed' : 'time'}>{time}</span>
                        </div>
                    ))}
                </div>
                <div className="info-card">
                    <div className="section-heading"><i className="fa-solid fa-scissors"></i> Services Offered</div>
                    <div className="services-list">
                        {['Custom Stitching', 'Blouse Work', 'Embroidery', 'Alterations', 'Bridal Wear', 'Kids Wear'].map(s => (
                            <span className="service-chip" key={s}>{s}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="section-heading"><i className="fa-solid fa-share-nodes"></i> Social & Contact Links</div>
                <div className="social-grid">
                    <a href="https://wa.me/919876543210" className="social-card wa" target="_blank" rel="noreferrer">
                        <i className="fa-brands fa-whatsapp" style={{ color: '#25d366' }}></i>
                        <span>WhatsApp</span>
                    </a>
                    <a href="https://instagram.com" className="social-card ig" target="_blank" rel="noreferrer">
                        <i className="fa-brands fa-instagram" style={{ color: '#ec4899' }}></i>
                        <span>Instagram</span>
                    </a>
                    <a href="https://facebook.com" className="social-card fb" target="_blank" rel="noreferrer">
                        <i className="fa-brands fa-facebook" style={{ color: '#3b82f6' }}></i>
                        <span>Facebook</span>
                    </a>
                    <a href="https://youtube.com" className="social-card yt" target="_blank" rel="noreferrer">
                        <i className="fa-brands fa-youtube" style={{ color: '#ef4444' }}></i>
                        <span>YouTube</span>
                    </a>
                </div>
            </div>
        </div>
    )
}

function UploadPost() {
    const [uploadType, setUploadType] = useState('image')
    const [availability, setAvailability] = useState('available')

    return (
        <div className="content">
            <div className="card">
                <div className="section-heading"><i className="fa-solid fa-cloud-arrow-up"></i> Post Your Work</div>

                <div className="upload-type-row">
                    <button className={`upload-type-btn ${uploadType === 'image' ? 'selected' : ''}`} onClick={() => setUploadType('image')}>
                        <i className="fa-solid fa-image"></i><span>Image Post</span>
                    </button>
                    <button className={`upload-type-btn ${uploadType === 'video' ? 'selected' : ''}`} onClick={() => setUploadType('video')}>
                        <i className="fa-solid fa-video"></i><span>Video Post</span>
                    </button>
                </div>

                <div className="upload-zone">
                    <i className={`fa-solid ${uploadType === 'image' ? 'fa-image' : 'fa-video'}`}></i>
                    <strong>Click or drag to upload {uploadType === 'image' ? 'an image' : 'a video'}</strong>
                    <small>{uploadType === 'image' ? 'JPG, PNG, WEBP up to 10MB' : 'MP4, MOV up to 100MB'}</small>
                </div>

                <div className="form-group-d">
                    <label className="form-label">Title / Caption</label>
                    <input className="form-input-d" type="text" placeholder="e.g. Handcrafted silk blouse – Festive collection" />
                </div>
                <div className="form-group-d">
                    <label className="form-label">Description</label>
                    <textarea className="form-textarea" placeholder="Describe your work, materials used, starting price…"></textarea>
                </div>

                <div className="price-avail-row">
                    <div className="form-group-d" style={{ marginTop: 0 }}>
                        <label className="form-label">Starting Price (₹)</label>
                        <input className="form-input-d" type="number" placeholder="e.g. 500" />
                    </div>
                    <div className="form-group-d" style={{ marginTop: 0 }}>
                        <label className="form-label">Availability</label>
                        <div className="avail-toggle">
                            <button className={`avail-btn ${availability === 'available' ? 'on' : ''}`} onClick={() => setAvailability('available')}>Available</button>
                            <button className={`avail-btn ${availability === 'busy' ? 'on' : ''}`} onClick={() => setAvailability('busy')}>Busy</button>
                        </div>
                    </div>
                </div>

                <button className="publish-btn">
                    <i className="fa-solid fa-paper-plane"></i>
                    Publish Post
                </button>
            </div>
        </div>
    )
}

const samplePosts = [
    { icon: '🧵', label: 'Photo', caption: 'Bridal Lehenga Set', price: '₹8,500' },
    { icon: '📸', label: 'Photo', caption: 'Silk Blouse Embroidery', price: '₹1,200' },
    { icon: '🎥', label: 'Video', caption: 'Stitching Process', price: '₹600' },
    { icon: '👗', label: 'Photo', caption: 'Kids Party Wear', price: '₹2,000' },
    { icon: '🪡', label: 'Photo', caption: 'Heavy Work Saree Blouse', price: '₹3,500' },
    { icon: '✂️', label: 'Photo', caption: 'Casual Kurta', price: '₹800' },
]

function MyPosts() {
    return (
        <div className="content">
            <div className="card">
                <div className="section-heading"><i className="fa-solid fa-images"></i> My Posts ({samplePosts.length})</div>
                <div className="portfolio-grid">
                    {samplePosts.map((post, i) => (
                        <div className="portfolio-item" key={i}>
                            <div className="thumb">{post.icon}</div>
                            <div className="item-type-badge">{post.label}</div>
                            <div className="item-actions">
                                <button className="item-act-btn" title="Edit"><i className="fa-solid fa-pen"></i></button>
                                <button className="item-act-btn" title="Delete" style={{ color: 'var(--error)' }}><i className="fa-solid fa-trash"></i></button>
                            </div>
                            <div className="overlay">
                                <div className="caption">{post.caption}</div>
                                <div className="price-tag">{post.price}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const threads = [
    { name: 'Ananya S.', preview: 'Hi! I need a blouse in 3 days', time: '2m', unread: 2, initials: 'AS', color: '#4f46e5' },
    { name: 'Rahul M.', preview: 'Can you do embroidery work?', time: '1h', unread: 0, initials: 'RM', color: '#7c3aed' },
    { name: 'Meera K.', preview: 'What are your charges?', time: '3h', unread: 1, initials: 'MK', color: '#9333ea' },
]

function Messages() {
    const [activeThread, setActiveThread] = useState(0)
    const [msgText, setMsgText] = useState('')

    return (
        <div className="content">
            <div className="messages-layout">
                <div className="msg-list">
                    <div className="msg-list-header">
                        Conversations
                        <span style={{ color: 'var(--indigo-lt)', fontSize: '.75rem' }}>{threads.reduce((a, t) => a + t.unread, 0)} new</span>
                    </div>
                    {threads.map((t, i) => (
                        <div className={`msg-thread ${activeThread === i ? 'active' : ''}`} key={i} onClick={() => setActiveThread(i)}>
                            <div className="msg-avatar" style={{ background: `linear-gradient(135deg, ${t.color}, #9333ea)` }}>{t.initials}</div>
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
                        <div className="msg-avatar" style={{ background: `linear-gradient(135deg, ${threads[activeThread].color}, #9333ea)` }}>
                            {threads[activeThread].initials}
                        </div>
                        <div>
                            <div className="ch-name">{threads[activeThread].name}</div>
                            <div className="ch-status">● Online</div>
                        </div>
                    </div>
                    <div className="chat-messages">
                        <div className="chat-msg received">
                            <div className="bubble">{threads[activeThread].preview}</div>
                            <div className="msg-meta">10:32 AM</div>
                        </div>
                        <div className="chat-msg sent">
                            <div className="bubble">Hi! Sure, I'd be happy to help. Can you share more details?</div>
                            <div className="msg-meta">10:34 AM · Seen</div>
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

function Settings() {
    return (
        <div className="content">
            <div className="card">
                <div className="section-heading"><i className="fa-solid fa-gear"></i> Account Settings</div>
                <div className="settings-grid">
                    <div className="form-group-d">
                        <label className="form-label">Business Name</label>
                        <input className="form-input-d" type="text" defaultValue="Priya's Boutique" />
                    </div>
                    <div className="form-group-d">
                        <label className="form-label">Category</label>
                        <input className="form-input-d" type="text" defaultValue="Fashion & Tailoring" />
                    </div>
                    <div className="form-group-d">
                        <label className="form-label">WhatsApp Number</label>
                        <input className="form-input-d" type="tel" defaultValue="+91 98765 43210" />
                    </div>
                    <div className="form-group-d">
                        <label className="form-label">Instagram Handle</label>
                        <input className="form-input-d" type="text" defaultValue="@priyasboutique" />
                    </div>
                    <div className="form-group-d">
                        <label className="form-label">City / Location</label>
                        <input className="form-input-d" type="text" defaultValue="Pune, Maharashtra" />
                    </div>
                    <div className="form-group-d">
                        <label className="form-label">Facebook Page</label>
                        <input className="form-input-d" type="text" defaultValue="Priya's Boutique" />
                    </div>
                </div>
                <div className="form-group-d">
                    <label className="form-label">Business Description</label>
                    <textarea className="form-textarea" defaultValue="Specializing in custom stitching, bridal wear, and embroidery work. Over 8 years of experience serving clients across Pune." />
                </div>
                <button className="publish-btn" style={{ marginTop: '1.2rem' }}>
                    <i className="fa-solid fa-floppy-disk"></i>
                    Save Changes
                </button>
            </div>
        </div>
    )
}

// ─── Main Dashboard Component ────────────────────────────────────────────────
const sectionTitles = {
    overview: 'Dashboard Overview',
    profile: 'My Business Profile',
    upload: 'Post Work',
    posts: 'My Posts',
    messages: 'Messages',
    settings: 'Settings',
}

export default function BusinessDashboard() {
    const [activeSection, setActiveSection] = useState('overview')
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const renderSection = () => {
        switch (activeSection) {
            case 'overview': return <Overview onNavigate={setActiveSection} />
            case 'profile': return <BusinessProfile />
            case 'upload': return <UploadPost />
            case 'posts': return <MyPosts />
            case 'messages': return <Messages />
            case 'settings': return <Settings />
            default: return <Overview onNavigate={setActiveSection} />
        }
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--dark)' }}>
            <Sidebar
                role="business"
                activeSection={activeSection}
                onNavigate={setActiveSection}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <div className="main">
                <Topbar
                    title={sectionTitles[activeSection]}
                    subtitle="· SellSmart Business"
                    role="business"
                    onMenuClick={() => setSidebarOpen(true)}
                />
                {renderSection()}
            </div>
        </div>
    )
}
