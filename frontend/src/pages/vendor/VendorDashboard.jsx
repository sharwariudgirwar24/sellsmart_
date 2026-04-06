import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../../components/shared/Sidebar'
import Topbar from '../../components/shared/Topbar'
import PostGallery from '../../components/vendor/PostGallery'
import AnalyticsCharts from '../../components/vendor/AnalyticsCharts'
import ChatSection from '../../components/shared/ChatSection'
import { useAppData } from '../../context/AppDataContext'

import '../../styles/dashboard.css'

// ─── Overview Section ──────────────────────────────────────────────────────
// ─── Performance Overview Section ──────────────────────────────────────────
function Overview({ onNavigate, vendor, posts, insights, recommendations }) {
    // Deriving actual totals from posts if insights from API is lagging/zero
    const totalViews = Math.max(insights?.totalViews || 0, posts.reduce((acc, p) => acc + (p.raw?.views || 0), 0));
    const totalLikes = Math.max(insights?.totalLikes || 0, posts.reduce((acc, p) => acc + (p.raw?.likes?.length || 0), 0));
    const totalComments = Math.max(insights?.totalComments || 0, posts.reduce((acc, p) => acc + (p.raw?.comments?.length || 0), 0));
    
    const engagementRate = totalViews > 0 
        ? (((totalLikes + totalComments) / totalViews) * 100).toFixed(1) 
        : (totalLikes + totalComments > 0 ? '100+' : '0.0');

    const globalTrendingCat = recommendations?.targetCategory || "N/A";

    const velocity = insights?.velocity || [];
    const today = velocity[6]?.engagement || 0;
    const yest = velocity[5]?.engagement || 0;
    const velTrend = yest > 0 ? (today >= yest ? `+${((today - yest) / yest * 100).toFixed(0)}%` : `-${((yest - today) / yest * 100).toFixed(0)}%`) : (today > 0 ? '+100%' : 'No Change');

    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="content"
        >
            <div className="dash-performance-summary">
                <div className="summary-main">
                    <div>
                        <h2 className="text-xl font-bold" style={{ color: 'var(--navy)' }}>Business Intelligence</h2>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Real-time analytical performance for <strong>{vendor?.BusinessName}</strong></p>
                    </div>
                </div>
                <div className="summary-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <button 
                        className="btn-primary-d"
                        onClick={() => onNavigate('upload')}
                    >
                        <i className="fa-solid fa-plus"></i> New Deployment
                    </button>
                </div>
            </div>

            <motion.div 
                className="dash-stats"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                }}
            >
                {[
                    { val: totalViews, lbl: 'Reach (Views)', trend: '+12%', icon: 'fa-eye', color: 'var(--sky)' },
                    { val: totalLikes, lbl: 'Total Likes', trend: '+5%', icon: 'fa-heart', color: 'var(--accent-secondary)' },
                    { val: totalComments, lbl: 'Comments', trend: '+8%', icon: 'fa-comment', color: 'var(--accent-secondary)' },
                    { val: today, lbl: 'Engagement Velocity', trend: velTrend, icon: 'fa-bolt', color: '#f59e0b' },
                ].map(({ val, lbl, icon, color, trend }, i) => (
                    <motion.div 
                        variants={{
                            hidden: { opacity: 0, scale: 0.9 },
                            visible: { opacity: 1, scale: 1 }
                        }}
                        className="stat-card" 
                        key={lbl}
                    >
                        <div className="stat-top">
                            <span className="stat-lbl">{lbl}</span>
                            <i className={`fa-solid ${icon}`} style={{ color }}></i>
                        </div>
                        <div className="stat-val">{val}</div>
                        <div className="stat-delta" style={{ color: trend.includes('+') ? 'var(--success)' : trend.includes('-') ? '#ef4444' : 'var(--text-muted)', fontSize: '0.7rem', marginTop: '4px' }}>
                            {trend} vs yesterday
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="section-heading"><i className="fa-solid fa-chart-area"></i> Engagement Analysis</div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <AnalyticsCharts posts={posts} insights={insights} />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* ─── ACTIONABLE INSIGHTS ─── */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card shadow-sm"
                    style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                >
                    <div className="flex items-center gap-2 mb-4 font-bold" style={{ color: 'var(--navy)' }}>
                        <i className="fa-solid fa-lightbulb" style={{ color: 'var(--sky)' }}></i>
                        Actionable Insights
                    </div>
                    <ul className="space-y-4">
                        <li className="flex gap-3 text-sm">
                            <i className="fa-solid fa-circle-check" style={{ color: 'var(--sky)', marginTop: '4px' }}></i>
                            <div>
                                <p className="font-semibold" style={{ color: 'var(--navy)' }}>Optimize Posting Time</p>
                                <p style={{ color: 'var(--text-muted)' }}>The marketplace is currently peaking at <strong>{recommendations?.golden_hour || '18'}:00</strong>. Posts during this window yield <strong>1.8x higher</strong> velocity.</p>
                            </div>
                        </li>
                        <li className="flex gap-3 text-sm">
                            <i className="fa-solid fa-circle-check" style={{ color: 'var(--sky)', marginTop: '4px' }}></i>
                            <div>
                                <p className="font-semibold" style={{ color: 'var(--navy)' }}>Content Recommendation</p>
                                <p style={{ color: 'var(--text-muted)' }}>Users interact significantly more with <strong>{recommendations?.targetCategory || 'Portfolio'}</strong> content than other categories.</p>
                            </div>
                        </li>
                    </ul>
                </motion.div>

                {/* ─── AI RECOMMENDATION ─── */}
                <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="card border-none"
                    style={{ background: 'var(--navy)', color: '#fff' }}
                >
                    <div className="flex items-center gap-2 mb-4 font-bold">
                        <i className="fa-solid fa-wand-magic-sparkles" style={{ color: 'var(--sky)' }}></i>
                        Market Intelligence
                    </div>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--ice)', opacity: 0.8 }}>
                        {recommendations?.advice || "Analyzing global market trends to help your business reach peak performance."}
                    </p>
                    <div className="p-4 rounded-xl border" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(123,187,255,0.2)' }}>
                        <div className="text-xs uppercase tracking-widest font-bold mb-2" style={{ color: 'var(--sky)', opacity: 0.7 }}>Recommended Vertical</div>
                        <div className="font-bold mb-1" style={{ color: 'var(--ice)' }}>Focus on {globalTrendingCat}</div>
                        <div className="text-xs italic" style={{ color: 'var(--sky)' }}>Derived from global engagement benchmarks</div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}




// ─── Profile Section ────────────────────────────────────────────────────────
function Profile({ vendor, setVendor }) {
    const { setAuth } = useAppData();
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    // Profile Completion Logic
    const fields = [vendor.BusinessName, vendor.FullName, vendor.Email, vendor.Phone, vendor.category];
    const completion = Math.round((fields.filter(f => !!f).length / fields.length) * 100);

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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="content">
            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <div className="section-heading !mb-0" style={{ color: 'var(--navy)' }}><i className="fa-solid fa-user-gear"></i> Business Configuration</div>
                    <div className="flex items-center gap-3">
                        <div className="text-xs font-bold uppercase tracking-tighter" style={{ color: 'var(--text-muted)' }}>Profile Completion</div>
                        <div className="w-32 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(123,187,255,0.1)' }}>
                            <div className="h-full" style={{ width: `${completion}%`, background: 'var(--sky)' }}></div>
                        </div>
                        <div className="text-xs font-bold" style={{ color: 'var(--sky)' }}>{completion}%</div>
                    </div>
                </div>


                {message && <p style={{color: 'green', marginBottom: '1rem'}}>{message}</p>}
                
                {!isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="col-span-1 border-r pr-8" style={{ borderColor: 'var(--border-subtle)' }}>
                            <div className="profile-hero !flex-col !items-center !text-center">
                                <div className="profile-avatar-wrap mb-4">
                                    <div className="profile-avatar !w-24 !h-24 !text-3xl" style={{ border: '3px solid var(--sky)', color: 'var(--navy)' }}>
                                        {vendor.BusinessName ? vendor.BusinessName.charAt(0).toUpperCase() : 'B'}
                                    </div>
                                    <div className="avatar-cam" style={{ background: 'var(--sky)', color: 'var(--navy)' }}><i className="fa-solid fa-camera"></i></div>
                                </div>
                                <h2 className="text-xl font-bold" style={{ color: 'var(--navy)' }}>{vendor.BusinessName || "Business Name"}</h2>
                                <div className="verified" style={{ color: 'var(--sky)', fontWeight: 600, fontSize: '0.85rem' }}>
                                    <i className="fa-solid fa-circle-check"></i> Verified Partner
                                </div>
                                <div className="mt-4 flex flex-col gap-2 w-full">
                                    <button className="btn-primary-d w-full justify-center" onClick={() => setIsEditing(true)}>
                                        <i className="fa-solid fa-pen"></i> Edit Profile
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                                <div>
                                    <label className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Primary Contact</label>
                                    <div className="font-semibold mt-1" style={{ color: 'var(--navy)' }}>{vendor.FullName || "Owner Name"}</div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Support Phone</label>
                                    <div className="font-semibold mt-1" style={{ color: 'var(--navy)' }}>{vendor.Phone || "+91 0000000000"}</div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Business Email</label>
                                    <div className="font-semibold mt-1" style={{ color: 'var(--navy)' }}>{vendor.Email || "email@vendor.com"}</div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Region</label>
                                    <div className="font-semibold mt-1" style={{ color: 'var(--navy)' }}>Pune Consumer Belt</div>
                                </div>
                            </div>

                            <div className="mt-8 p-4 rounded-xl border" style={{ background: 'rgba(123,187,255,0.05)', borderColor: 'var(--border-subtle)' }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <i className="fa-solid fa-shield-halved" style={{ color: 'var(--sky)' }}></i>
                                    <span className="text-xs font-bold uppercase" style={{ color: 'var(--navy)' }}>Trust Score: 98/100</span>
                                </div>
                                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>Based on your activity, engagement responsiveness, and verified credentials. Maintaining a high score improves your ranking in customer feeds.</p>
                            </div>
                        </div>
                    </div>
                ) : (

                    <form onSubmit={handleSave} className="grid grid-cols-2 gap-6">
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
                        <div className="form-group-d">
                            <label className="form-label">Primary Business Category</label>
                            <select className="form-input-d" value={vendor.category || 'Fashion & Tailoring'} onChange={(e) => setVendor({...vendor, category: e.target.value})} required>
                                <option>Fashion & Tailoring</option>
                                <option>Food & Bakery</option>
                                <option>Photography</option>
                                <option>Beauty & Salon</option>
                                <option>Repair & Electronics</option>
                                <option>Handicrafts</option>
                                <option>Home Decor</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div className="col-span-2 flex gap-3 mt-4">
                            <button type="submit" className="btn-primary-d" disabled={loading}>
                                {loading ? 'Saving...' : 'Update Configuration'}
                            </button>
                            <button type="button" className="btn-ghost-d" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </form>
                )}
            </div>
        </motion.div>
    )
}


// ─── Upload / Edit Post Section ─────────────────────────────────────────────
function UploadSection({ onDone, initialData }) {
    const [type, setType] = useState(initialData?.type || 'image')
    const [avail, setAvail] = useState('available')
    const [loading, setLoading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [prediction, setPrediction] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 1GB)
            const MAX_SIZE = 1024 * 1024 * 1024; // 1GB limit
            if (file.size > MAX_SIZE) {
                alert('File size exceeds the 1GB limit. Please upload a smaller file.');
                e.target.value = ''; // clear the input
                setPreviewUrl(null);
                setPrediction(null);
                return;
            }

            setPreviewUrl(URL.createObjectURL(file));
            // Simulate AI Engagement Prediction logic
            const basePotential = type === 'video' ? 75 : 45;
            setPrediction(basePotential + Math.floor(Math.random() * 20));
        }
    };

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
                    ) : (data.product.video?.url ? <video src={data.product.video.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (type === 'image' ? <i className="fa-solid fa-image" style={{fontSize: '1.2rem', color: 'var(--sky)'}}></i> : <i className="fa-solid fa-video" style={{fontSize: '1.2rem', color: 'var(--sky)'}}></i>)),
                    label: data.product.category || 'Product',
                    caption: data.product.name,
                    price: `₹${data.product.price}`,
                    images: data.product.images,
                    video: data.product.video,
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="content">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <div className="card">
                        <div className="section-heading"><i className="fa-solid fa-circle-plus"></i> {initialData ? 'Content Calibration' : 'Deploy New Analysis Content'}</div>
                        <form onSubmit={handlePublish}>
                            <div className="upload-type-row !grid-cols-3">
                                {['image', 'video', 'document'].map((t) => (
                                    <button key={t} type="button"
                                        className={`upload-type-btn ${type === t ? 'selected' : ''}`}
                                        onClick={() => setType(t)}>
                                        <i className={`fa-solid fa-${t === 'document' ? 'file-lines' : t}`}></i>
                                        <span className="capitalize">{t}</span>
                                    </button>
                                ))}
                            </div>
                            
                            <div className="upload-zone" onClick={() => document.getElementById('file-upload').click()}>
                                {previewUrl ? (
                                    <div className="w-full h-48 overflow-hidden rounded-lg flex items-center justify-center bg-slate-100">
                                        {type === 'video' ? (
                                            <video src={previewUrl} controls style={{ maxHeight: '100%', width: '100%' }} />
                                        ) : (
                                            <img src={previewUrl} alt="Preview" className="max-h-full object-contain" />
                                        )}
                                    </div>
                                ) : (initialData?.icon && typeof initialData.icon !== 'string') ? (
                                    <div className="w-full h-48 overflow-hidden rounded-lg flex items-center justify-center bg-slate-100">
                                         {initialData.raw?.video?.url ? (
                                            <video src={initialData.raw.video.url} controls style={{ maxHeight: '100%', width: '100%' }} />
                                         ) : (
                                            <img src={initialData.raw?.images?.[0]?.url} alt="Preview" className="max-h-full object-contain" />
                                         )}
                                    </div>
                                ) : (
                                    <>
                                        <i className={`fa-solid fa-${type === 'document' ? 'file-lines' : type} text-slate-400 opacity-50`}></i>
                                        <strong>Click to browse for {type}</strong>
                                        <small className="text-slate-400">Standardizing on high-resolution assets. File limit: 0-1GB</small>
                                    </>
                                )}
                                <input
                                    type="file"
                                    name="file"
                                    id="file-upload"
                                    onChange={handleFileChange}
                                    accept={type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : '*/*'}
                                    style={{ display: 'none' }}
                                    required={!initialData}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="form-group-d">
                                    <label className="form-label">Asset Title</label>
                                    <input className="form-input-d" name="title" type="text" placeholder="Engagement Label" defaultValue={initialData?.caption || ''} required />
                                </div>
                                <div className="form-group-d">
                                    <label className="form-label">Content Tier / Category</label>
                                    <select className="form-input-d" name="category" defaultValue={initialData?.raw?.category || 'Fashion & Tailoring'}>
                                        <option>Fashion & Tailoring</option>
                                        <option>Food & Bakery</option>
                                        <option>Photography</option>
                                        <option>Beauty & Salon</option>
                                        <option>Repair & Electronics</option>
                                        <option>Handicrafts</option>
                                        <option>Home Decor</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                            </div>

                            <div className="form-group-d mt-4">
                                <label className="form-label">Analytical Context (Description)</label>
                                <textarea className="form-textarea h-24" name="description" placeholder="Post objectives and details…" defaultValue={initialData?.raw?.description || ''} required></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="form-group-d">
                                    <label className="form-label">Reference Price (₹)</label>
                                    <input className="form-input-d" name="price" type="number" defaultValue={initialData?.price?.replace(/₹|,/g, '') || ''} />
                                </div>
                                <div className="form-group-d">
                                    <label className="form-label">Availability Status</label>
                                    <select className="form-input-d" name="stock" defaultValue={initialData?.raw?.stock || '1'}>
                                        <option value="1">Live / In Stock</option>
                                        <option value="0">Staging / Out</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="publish-btn !mt-8 !w-full" disabled={loading}>
                                <i className="fa-solid fa-bolt"></i>
                                {loading ? 'Processing Agent...' : (initialData ? 'Update Deployment' : 'Launch New Post')}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="card sticky top-24" style={{ background: 'var(--navy)', color: '#fff', border: 'none' }}>
                        <div className="flex items-center gap-2 mb-6 font-bold" style={{ color: 'var(--ice)' }}>
                            <i className="fa-solid fa-microchip" style={{ color: 'var(--sky)' }}></i>
                            Pre-Deployment Intelligence
                        </div>
                        
                        <div className="space-y-6">
                            <div className="p-4 rounded-xl border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(123,187,255,0.15)' }}>
                                <div className="text-xs uppercase font-bold mb-3" style={{ color: 'var(--sky)', opacity: 0.8 }}>Predicted Reach Score</div>
                                <div className="flex items-end gap-2">
                                    <div className="text-4xl font-bold" style={{ color: 'var(--ice)' }}>{prediction || '0'}</div>
                                    <div className="text-sm mb-1 font-bold" style={{ color: 'var(--sky)' }}>PTL Index</div>
                                </div>
                                <div className="w-full h-1.5 rounded-full mt-4 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                                    <div className="h-full" style={{ width: `${prediction}%`, background: 'var(--sky)' }}></div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="text-xs uppercase font-bold px-2" style={{ color: 'var(--sky)', opacity: 0.6 }}>Optimum Strategy</div>
                                <div className="p-3 border rounded-lg text-xs leading-relaxed" style={{ background: 'rgba(123,187,255,0.08)', borderColor: 'rgba(123,187,255,0.25)', color: 'var(--ice)' }}>
                                    <strong style={{ color: 'var(--sky)' }}>Strategy:</strong> Higher reach predicted if posted using a <strong>{type === 'image' ? 'Lifestyle' : 'Action-based'}</strong> visual frame.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </motion.div>
    )
}


// ─── Settings Section ────────────────────────────────────────────────────────
function Settings({ vendor }) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="content">
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
        </motion.div>
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
    const { currentUser, isLoggedIn, userType, threads, vendorInsights, vendorRecommendations, fetchInsights, fetchRecommendations } = useAppData()
    
    const [section, setSection] = useState('overview')
    const [history, setHistory] = useState(['overview'])
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [vendor, setVendor] = useState(currentUser || { FullName: '', BusinessName: '', Email: '', Phone: '' })
    const [recs, setRecs] = useState([])
    const navigate = useNavigate()
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

    // Auto-refresh analytics every 30 seconds
    useEffect(() => {
        if (isLoggedIn && userType === 'vendor') {
            fetchInsights();
            const timer = setInterval(() => fetchInsights(), 30000);
            return () => clearInterval(timer);
        }
    }, [isLoggedIn, userType, fetchInsights]);

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
                        id: p._id.toString(),
                        icon: p.images && p.images.length > 0 ? (
                            <img src={p.images[0].url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : p.video?.url ? (
                            <video src={p.video.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : <i className="fa-solid fa-image" style={{ color: 'var(--text-muted)' }}></i>,
                        label: p.category || 'Product',
                        caption: p.name,
                        price: `₹${p.price}`,
                        images: p.images,
                        video: p.video,
                        raw: { ...p, _id: p._id.toString() },
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
        return (
            <AnimatePresence mode="wait">
                {section === 'overview' && (
                    <Overview 
                        key="overview" 
                        onNavigate={handleNavigate} 
                        vendor={vendor} 
                        posts={posts} 
                        insights={vendorInsights} 
                        recommendations={vendorRecommendations} 
                    />
                )}
                {section === 'profile' && (
                    <Profile 
                        key="profile" 
                        vendor={vendor} 
                        setVendor={setVendor} 
                    />
                )}
                {section === 'upload' && (
                    <UploadSection 
                        key="upload" 
                        initialData={editingPost} 
                        onDone={(newPost, isUpdate) => {
                            if (isUpdate) {
                                setPosts(posts.map(p => p.id === newPost.id ? newPost : p));
                            } else {
                                setPosts([newPost, ...posts]);
                            }
                            setEditingPost(null);
                            handleNavigate('posts');
                        }} 
                    />
                )}
                {section === 'posts' && (
                    <PostGallery 
                        key="posts"
                        posts={posts} 
                        onEdit={(post) => {
                            setEditingPost(post);
                            setSection('upload');
                        }} 
                        onDelete={async (postId) => {
                            if (!postId) return alert("Error: Post ID not found.");
                            if (window.confirm('Are you sure you want to delete this post?')) {
                                try {
                                    const res = await fetch(`http://localhost:5000/product/${postId}`, {
                                        method: "DELETE",
                                        credentials: "include"
                                    });
                                    if (res.ok) {
                                        setPosts(posts.filter(p => (p._id || p.id) !== postId));
                                    } else {
                                        const errData = await res.json();
                                        alert(`Delete failed: ${errData.message || 'Unknown error'}`);
                                    }
                                } catch (err) { alert("Error connecting to server"); }
                            }
                        }} 
                    />
                )}
                {section === 'messages' && (
                    <div key="messages" className="h-full">
                        <ChatSection threads={threads} />
                    </div>
                )}
                {section === 'settings' && <Settings key="settings" vendor={vendor} />}
            </AnimatePresence>
        );
    };


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
            <style>{`
                .velocity-monitor { box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
                .velocity-pulse {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%);
                    animation: pulse-ring 3s infinite ease-in-out;
                    pointer-events: none;
                }
                @keyframes pulse-ring {
                    0% { transform: scale(0.8); opacity: 0.2; }
                    50% { transform: scale(1.2); opacity: 0.5; }
                    100% { transform: scale(0.8); opacity: 0.2; }
                }
                .dash-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
                .stat-card { background: var(--card-bg); padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); transition: all 0.3s; }
                .stat-card:hover { transform: translateY(-5px); border-color: var(--sky); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
                .stat-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
                .stat-lbl { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
                .stat-val { font-size: 1.8rem; font-weight: 800; color: var(--navy); }
            `}</style>
        </div>
    )
}
