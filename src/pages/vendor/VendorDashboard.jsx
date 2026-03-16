import { useState, useEffect } from 'react'
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
function Overview({ onNavigate, vendor }) {
    return (
        <div className="content">
            <div className="dash-welcome">
                <div className="dash-welcome-icon"><i className="fa-solid fa-store"></i></div>
                <div>
                    <h2>Welcome back, {vendor?.FullName || 'Business Owner'}! 👋</h2>
                    <p>Your profile is live. Customers can discover <strong>{vendor?.BusinessName || 'your business'}</strong>.</p>
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
function Profile({ vendor, setVendor }) {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/vendor/me/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(vendor)
            });
            if (res.ok) {
                const data = await res.json();
                setVendor(data.vendor);
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
                <div className="section-heading"><i className="fa-solid fa-store"></i> Business Profile</div>
                {message && <p style={{color: 'green', marginBottom: '1rem'}}>{message}</p>}
                
                {!isEditing ? (
                    <div className="profile-hero">
                        <div className="profile-avatar-wrap">
                            <div className="profile-avatar">{vendor.BusinessName ? vendor.BusinessName.charAt(0).toUpperCase() : 'B'}</div>
                            <div className="avatar-cam"><i className="fa-solid fa-camera"></i></div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{vendor.BusinessName || "Business Name"}</h2>
                            <div className="verified"><i className="fa-solid fa-circle-check"></i> Verified Business</div>
                            <div className="profile-meta" style={{ marginTop: '0.5rem' }}>
                                <span><i className="fa-solid fa-user"></i> {vendor.FullName || "Owner Name"}</span>
                                <span><i className="fa-solid fa-phone"></i> {vendor.Phone || "+91 0000000000"}</span>
                                <span><i className="fa-regular fa-envelope"></i> {vendor.Email || "email@vendor.com"}</span>
                            </div>
                            <div className="profile-actions" style={{marginTop: '1rem'}}>
                                <button className="btn-primary-d" onClick={() => setIsEditing(true)}>
                                    <i className="fa-solid fa-pen"></i> Edit Profile
                                </button>
                                <a href={`https://wa.me/${vendor.Phone}`} className="wa-btn" target="_blank" rel="noreferrer">
                                    <i className="fa-brands fa-whatsapp"></i> WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSave} style={{maxWidth: '400px'}}>
                        <div className="form-group-d">
                            <label className="form-label">Business Name</label>
                            <input className="form-input-d" value={vendor.BusinessName} onChange={(e) => setVendor({...vendor, BusinessName: e.target.value})} required />
                        </div>
                        <div className="form-group-d">
                            <label className="form-label">Owner Name</label>
                            <input className="form-input-d" value={vendor.FullName} onChange={(e) => setVendor({...vendor, FullName: e.target.value})} required />
                        </div>
                        <div className="form-group-d">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-input-d" value={vendor.Email} onChange={(e) => setVendor({...vendor, Email: e.target.value})} required />
                        </div>
                        <div className="form-group-d">
                            <label className="form-label">Phone</label>
                            <input type="tel" className="form-input-d" value={vendor.Phone} onChange={(e) => setVendor({...vendor, Phone: e.target.value})} required />
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

// ─── Upload / Edit Post Section ─────────────────────────────────────────────
function UploadSection({ onDone, initialData }) {
    const [type, setType] = useState(initialData?.type || 'image')
    const [avail, setAvail] = useState('available')
    const [loading, setLoading] = useState(false)

    const handlePublish = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            const formData = new FormData(e.target)
            const url = initialData 
                ? `http://localhost:5000/product/${initialData.id}` 
                : "http://localhost:5000/product/upload";
            const method = initialData ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                credentials: "include",
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                const updatedPost = {
                    id: data.product._id,
                    icon: data.product.images && data.product.images.length > 0 ? (
                        <img src={data.product.images[0].url} alt={data.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (type === 'image' ? '📸' : '🎥'),
                    label: data.product.category || 'Product',
                    caption: data.product.name,
                    price: `₹${data.product.price}`,
                    // store raw data for future edits
                    raw: data.product
                };
                setTimeout(() => { setLoading(false); onDone(updatedPost, !!initialData) }, 500);
            } else {
                const errorData = await res.json();
                alert(`Operation failed: ${errorData.message || 'Unknown error'}`);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            alert("Error processing post.");
            setLoading(false);
        }
    }

    return (
        <div className="content">
            <div className="card">
                <div className="section-heading"><i className="fa-solid fa-cloud-arrow-up"></i> {initialData ? 'Edit Your Work' : 'Post Your Work'}</div>
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
                    <div className="upload-zone" onClick={() => document.getElementById('file-upload').click()} style={{ cursor: 'pointer' }}>
                        {initialData && initialData.icon && typeof initialData.icon !== 'string' ? (
                            initialData.icon
                        ) : (
                            <i className={`fa-solid fa-${type}`}></i>
                        )}
                        <strong>{initialData ? 'Click to change image/video' : `Click or drag to upload ${type === 'image' ? 'an image' : 'a video'}`}</strong>
                        <small>{type === 'image' ? 'JPG, PNG, WEBP – max 10 MB' : 'MP4, MOV – max 100 MB'}</small>
                        <input
                            type="file"
                            name="file"
                            id="file-upload"
                            accept={type === 'image' ? 'image/*' : 'video/*'}
                            style={{ display: 'none' }}
                            required={!initialData}
                        />
                    </div>
                    <div className="form-group-d">
                        <label className="form-label">Title / Caption</label>
                        <input className="form-input-d" name="title" type="text" placeholder="e.g. Festive silk blouse collection" defaultValue={initialData?.caption || ''} required />
                    </div>
                    <div className="form-group-d">
                        <label className="form-label">Description</label>
                        <textarea className="form-textarea" name="description" placeholder="Describe your work…" defaultValue={initialData?.raw?.description || ''} required></textarea>
                    </div>
                    <div className="price-avail-row">
                        <div className="form-group-d" style={{ marginTop: 0 }}>
                            <label className="form-label">Starting Price (₹)</label>
                            <input className="form-input-d" name="price" type="number" placeholder="500" defaultValue={initialData?.price?.replace('₹', '').replace(',', '') || ''} />
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
                        {loading ? (initialData ? 'Updating…' : 'Publishing…') : (initialData ? 'Update Post' : 'Publish Post')}
                    </button>
                </form>
            </div>
        </div>
    )
}

// ─── Settings Section ────────────────────────────────────────────────────────
function Settings({ vendor }) {
    return (
        <div className="content">
            <div className="card">
                <div className="section-heading"><i className="fa-solid fa-gear"></i> Account Settings</div>
                <div className="settings-grid">
                    {[
                        { label: 'Business Name', type: 'text', val: vendor?.BusinessName || '', name: 'businessName' },
                        { label: 'Owner Name', type: 'text', val: vendor?.FullName || '', name: 'fullName' },
                        { label: 'WhatsApp / Phone', type: 'tel', val: vendor?.Phone || '', name: 'phone' },
                        { label: 'Registered Email', type: 'email', val: vendor?.Email || '', name: 'email' },
                        { label: 'City / Location', type: 'text', val: 'Pune, Maharashtra', name: 'location' },
                    ].map(({ label, type, val, name }) => (
                        <div className="form-group-d" key={name}>
                            <label className="form-label">{label}</label>
                            <input className="form-input-d" type={type} defaultValue={val} name={name} />
                        </div>
                    ))}
                </div>
                {/* TODO: PUT /api/vendor/settings */}
                <button className="publish-btn" style={{ marginTop: '1.2rem', marginBottom: '2rem' }}>
                    <i className="fa-solid fa-floppy-disk"></i> Save Changes
                </button>

                <div className="section-heading" style={{ borderTop: '1px solid #333', paddingTop: '1.5rem', marginTop: '1rem' }}>
                    <i className="fa-solid fa-sliders"></i> Preferences & More
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                    <button className="btn-ghost-d" onClick={() => alert('Theme Settings panel coming soon!')} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: 'none', color: '#fff', cursor: 'pointer', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><i className="fa-solid fa-palette" style={{ width: '20px' }}></i> Theme Settings</span>
                        <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.8rem', color: '#888' }}></i>
                    </button>
                    <button className="btn-ghost-d" onClick={() => alert('Security configuration is currently disabled.')} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: 'none', color: '#fff', cursor: 'pointer', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><i className="fa-solid fa-shield-halved" style={{ width: '20px' }}></i> Security</span>
                        <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.8rem', color: '#888' }}></i>
                    </button>
                    <button className="btn-ghost-d" onClick={() => alert('No recent activity to log.')} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: 'none', color: '#fff', cursor: 'pointer', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><i className="fa-solid fa-clock-rotate-left" style={{ width: '20px' }}></i> Activity Log</span>
                        <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.8rem', color: '#888' }}></i>
                    </button>
                    <button className="btn-ghost-d" onClick={() => alert('Adding secondary accounts requires Premium.')} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: 'none', color: '#fff', cursor: 'pointer', alignItems: 'center', marginTop: '0.5rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><i className="fa-solid fa-user-plus" style={{ width: '20px' }}></i> Add Another Account</span>
                        <i className="fa-solid fa-plus" style={{ fontSize: '0.8rem', color: '#888' }}></i>
                    </button>
                </div>
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
    const [history, setHistory] = useState(['overview'])
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [vendor, setVendor] = useState({ FullName: '', BusinessName: '', Email: '', Phone: '' })
    const navigate = useNavigate()
    const [posts, setPosts] = useState(SAMPLE_POSTS)
    const [editingPost, setEditingPost] = useState(null)

    const handleNavigate = (newSection) => {
        if (newSection !== section) {
            setHistory(prev => [...prev, newSection]);
            setSection(newSection);
            if (newSection !== 'upload') setEditingPost(null);
        }
    };

    const handleBack = () => {
        if (history.length > 1) {
            const newHistory = [...history];
            newHistory.pop(); // Remove current
            const prev = newHistory[newHistory.length - 1];
            setHistory(newHistory);
            setSection(prev);
            if (prev !== 'upload') setEditingPost(null);
        } else {
            navigate('/role-select');
        }
    };

    useEffect(() => {
        const fetchVendorDetails = async () => {
            try {
                const res = await fetch("http://localhost:5000/vendor/me", { credentials: "include" });
                if (res.ok) {
                    const data = await res.json();
                    setVendor(data.vendor);
                }
            } catch(e) { console.log(e) }
        }

        const fetchVendorPosts = async () => {
            try {
                const res = await fetch("http://localhost:5000/vendor/posts", { credentials: "include" });
                if (res.ok) {
                    const data = await res.json();
                    // map database products to frontend post format
                    const formattedPosts = data.products.map(p => ({
                        id: p._id,
                        icon: p.images && p.images.length > 0 ? (
                            <img src={p.images[0].url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : '📸',
                        label: p.category || 'Product',
                        caption: p.name,
                        price: `₹${p.price}`,
                        raw: p,
                    }));
                    setPosts(formattedPosts);
                } else {
                    // If not authorized or internal error, clear samples so user isn't misled
                    setPosts([]);
                }
            } catch (e) {
                console.log("Fetch Posts Error:", e);
                setPosts([]);
            }
        }
        
        fetchVendorDetails();
        fetchVendorPosts();
    }, [])

    const renderSection = () => {
        switch (section) {
            case 'overview': return <Overview onNavigate={handleNavigate} vendor={vendor} />
            case 'profile': return <Profile vendor={vendor} setVendor={setVendor} />
            case 'upload': return <UploadSection initialData={editingPost} onDone={(newPost, isUpdate) => {
                                        if (isUpdate) {
                                            setPosts(posts.map(p => p.id === newPost.id ? newPost : p));
                                        } else {
                                            setPosts([newPost, ...posts]);
                                        }
                                        setEditingPost(null);
                                        handleNavigate('posts');
                                   }} />
            case 'posts': return <PostGallery 
                                    posts={posts} 
                                    onEdit={(post) => {
                                        setEditingPost(post);
                                        setSection('upload');
                                    }} 
                                    onDelete={async (post) => {
                                        if (window.confirm('Are you sure you want to delete this post?')) {
                                            try {
                                                const res = await fetch(`http://localhost:5000/product/${post.id}`, {
                                                    method: "DELETE",
                                                    credentials: "include"
                                                });
                                                if (res.ok) {
                                                    setPosts(posts.filter(p => p.id !== post.id));
                                                } else {
                                                    const errData = await res.json();
                                                    alert(`Delete failed: ${errData.message || 'Unknown error'}`);
                                                }
                                            } catch (err) {
                                                console.error(err);
                                                alert("Error connecting to server for deletion.");
                                            }
                                        }
                                    }} 
                                  />
            case 'messages': return <ChatBox threads={SAMPLE_THREADS} avatarKey="initials" />
            case 'settings': return <Settings vendor={vendor} />
            default: return <Overview onNavigate={handleNavigate} vendor={vendor} />
        }
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--dark)' }}>
            <Sidebar
                role="business"
                activeSection={section}
                onNavigate={handleNavigate}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                user={vendor}
            />
            <div className="main">
                <Topbar
                    title={TITLES[section]}
                    subtitle={vendor.BusinessName ? `${vendor.BusinessName} · SellSmart Business` : "· SellSmart Business"}
                    role="business"
                    onMenuClick={() => setSidebarOpen(true)}
                    user={vendor}
                    onAvatarClick={() => handleNavigate('profile')}
                    onBack={handleBack}
                />
                {renderSection()}
            </div>
        </div>
    )
}
