import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar'
import Topbar from '../../components/shared/Topbar'
import PostGallery from '../../components/vendor/PostGallery'
import AnalyticsCharts from '../../components/vendor/AnalyticsCharts'
import ChatBox from '../../components/shared/ChatSection'

import { useAppData } from '../../context/AppDataContext'
import '../../styles/dashboard.css'

// ─── Overview Section ──────────────────────────────────────────────────────
function Overview({ onNavigate, vendor, posts, insights, recommendations }) {
    // Fallback if insights are not loaded
    const totalViews = insights?.totalViews || 0;
    const totalLikes = insights?.totalLikes || 0;
    const totalComments = insights?.totalComments || 0;
    const engagementScore = insights?.engagementScore?.toFixed(1) || '0.0';

    const globalTrendingCat = recommendations?.targetCategory || "N/A";
    const advice = recommendations?.advice || "Keep posting high-quality content!";


    return (
        <div className="content">
            <div className="dash-welcome">
                <div className="dash-welcome-icon"><i className="fa-solid fa-store"></i></div>
                <div>
                    <h2>Welcome back, {vendor?.FullName || 'Business Owner'}! 👋</h2>
                    <p>Your profile is live. Customers can discover <strong>{vendor?.BusinessName || 'your business'}</strong>.</p>
                </div>
            </div>

            <div className="section-heading"><i className="fa-solid fa-chart-line"></i> Performance Insights</div>
            <div className="dash-stats">
                {[
                    { val: totalViews, lbl: 'Total Post Views', icon: 'fa-eye', color: '#6366f1' },
                    { val: totalLikes, lbl: 'Total Post Likes', icon: 'fa-heart', color: '#f43f5e' },
                    { val: totalComments, lbl: 'Total Comments', icon: 'fa-comment', color: '#ec4899' },
                    { val: engagementScore, lbl: 'Engagement Score', icon: 'fa-bolt', color: '#f59e0b' },
                ].map(({ val, lbl, icon, color }) => (
                    <div className="stat-card" key={lbl}>
                        <div className="stat-icon-w" style={{ background: color + '20', color: color }}>
                            <i className={`fa-solid ${icon}`}></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-val">{val}</div>
                            <div className="stat-lbl">{lbl}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ─── NEW CHARTS SECTION ─── */}
            <div className="section-heading"><i className="fa-solid fa-chart-area"></i> Engagement Analysis</div>
            <AnalyticsCharts posts={posts} insights={insights} />

            {recommendations && (
                <div className="recommendation-card" style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid var(--indigo-lt)', padding: '20px', borderRadius: '15px' }}>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <i className="fa-solid fa-wand-magic-sparkles" style={{ color: 'var(--indigo-lt)' }}></i>
                        <h3 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>Growth Recommendation</h3>
                    </div>
                    <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.5' }}>{advice}</p>
                    <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(99,102,241,0.2)', color: 'var(--indigo-lt)', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}>
                            Top Global Niche: {globalTrendingCat}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{recommendations.action}</span>
                    </div>
                </div>
            )}


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
    const { setAuth } = useAppData();
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
                setAuth(data.vendor, 'vendor');
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
                            <input className="form-input-d" value={vendor.BusinessName || ''} onChange={(e) => setVendor({...vendor, BusinessName: e.target.value})} required />
                        </div>
                        <div className="form-group-d">
                            <label className="form-label">Owner Name</label>
                            <input className="form-input-d" value={vendor.FullName || ''} onChange={(e) => setVendor({...vendor, FullName: e.target.value})} required />
                        </div>
                        <div className="form-group-d">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-input-d" value={vendor.Email || ''} onChange={(e) => setVendor({...vendor, Email: e.target.value})} required />
                        </div>
                        <div className="form-group-d">
                            <label className="form-label">Phone</label>
                            <input type="tel" className="form-input-d" value={vendor.Phone || ''} onChange={(e) => setVendor({...vendor, Phone: e.target.value})} required />
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
                <div className="section-heading"><i className="fa-solid fa-cloud-arrow-up"></i> {initialData ? 'Edit Post' : 'Post Your Work'}</div>
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
                        {loading ? 'Processing…' : (initialData ? 'Update Post' : 'Publish Post')}
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
                            <input className="form-input-d" type={type} defaultValue={val} name={name} readOnly />
                        </div>
                    ))}
                </div>
                <p style={{marginTop: '1rem', fontSize: '0.8rem', color: '#888'}}>Note: Profile details can be changed in the 'Edit Profile' section.</p>
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
    const [recs, setRecs] = useState([])
    const navigate = useNavigate()
    const { threads, vendorInsights, vendorRecommendations, fetchInsights, fetchRecommendations } = useAppData()
    const [posts, setPosts] = useState([])
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
            newHistory.pop();
            const prev = newHistory[newHistory.length - 1];
            setHistory(newHistory);
            setSection(prev);
            if (prev !== 'upload') setEditingPost(null);
        } else {
            navigate('/role-select');
        }
    };
    useEffect(() => {
        const fetchVendorData = async () => {
            try {
                const [vRes, pRes, rRes] = await Promise.all([
                    fetch("http://localhost:5000/vendor/me", { credentials: "include" }),
                    fetch("http://localhost:5000/vendor/posts", { credentials: "include" }),
                    fetch("http://localhost:5000/recommendations")
                ]);

                let vendorData = { FullName: '', BusinessName: '', Email: '', Phone: '' };
                let productList = [];
                let recommendations = [];

                if (vRes.ok) {
                    const data = await vRes.json();
                    vendorData = data.vendor;
                }

                if (pRes.ok) {
                    const data = await pRes.json();
                    productList = data.products;
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
                }

                if (rRes.ok) {
                    const data = await rRes.json();
                    setRecs(data.recommendations);
                }

                setVendor(vendorData);
                fetchInsights();
                fetchRecommendations();
            } catch(e) { console.log("Vendor Dash Fetch Error:", e) }
        }
        
        fetchVendorData();
    }, [fetchInsights, fetchRecommendations])


    const renderSection = () => {
        switch (section) {
            case 'overview': return <Overview onNavigate={handleNavigate} vendor={vendor} posts={posts} insights={vendorInsights} recommendations={vendorRecommendations} />

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
                                            } catch (err) { alert("Error connecting to server"); }
                                        }
                                    }} 
                                  />
            case 'messages': return <ChatBox threads={threads} avatarKey="initials" />

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
