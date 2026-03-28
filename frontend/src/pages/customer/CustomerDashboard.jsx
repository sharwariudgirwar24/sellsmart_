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
function Explore({ onChatClick, onBizClick }) {
    const { vendors: globalVendors, trendingProducts, fetchTrending } = useAppData()
    const [view, setView] = useState('businesses') // 'businesses' or 'products'
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')
    const [products, setProducts] = useState([])

    const [vendors, setVendors] = useState(() => globalVendors?.map(v => ({
        id: v.id || v._id,
        businessName: v.BusinessName || v.name,
        ownerName: v.FullName || v.ownerName,
        email: v.Email || v.email,
        phone: v.Phone || v.phone,
        category: v.category || 'General',
        location: v.location || 'Pune, Maharashtra',
        verified: true
    })) || [])

    const [savedVendors, setSavedVendors] = useState([])
    const [searching, setSearching] = useState(false)


    const fetchSavedVendors = async () => {
        try {
            const res = await fetch("http://localhost:5000/saved-vendors", { credentials: "include" })
            if (res.ok) {
                const data = await res.json()
                setSavedVendors(data.savedVendors.map(v => v._id))
            }
        } catch (e) { console.log(e) }
    }

    const fetchResults = async () => {
        setSearching(true)
        try {
            const params = new URLSearchParams()
            if (searchQuery) params.append('keyword', searchQuery)
            if (selectedCategory !== 'All') params.append('category', selectedCategory)
            
            if (view === 'products') {
                const res = await fetch(`http://localhost:5000/products?${params.toString()}`)
                if (res.ok) {
                    const data = await res.json()
                    setProducts(data.products)
                }
            } else {
                const res = await fetch(`http://localhost:5000/vendors?${params.toString()}`)
                if (res.ok) {
                    const data = await res.json()
                    setVendors(data.vendors.map(v => ({
                        id: v._id || v.id,
                        businessName: v.BusinessName || v.name || 'Unknown Business',
                        ownerName: v.FullName || v.ownerName || 'Unknown Owner',
                        email: v.Email || v.email,
                        phone: v.Phone || v.phone,
                        category: v.category || 'General',
                        location: v.location || 'Pune, Maharashtra',
                        verified: true
                    })));
                } else {
                    console.error("Fetch Vendors Failed:", res.status);
                }
            }
        } catch (e) {
            console.error("Fetch Results Error:", e);
        } finally {
            setSearching(false)
        }

    }

    // Initial fetch and fetch on view/category change
    useEffect(() => {
        fetchSavedVendors()
        fetchResults()
        fetchTrending()
    }, [view, selectedCategory, fetchTrending])


    const handleSearch = (e) => {
        if (e) e.preventDefault();
        fetchResults();
    }

    const handleToggleSave = async (biz) => {
        const isCurrentlySaved = savedVendors.includes(biz.id);
        const url = isCurrentlySaved 
            ? `http://localhost:5000/unsave-vendor/${biz.id}` 
            : `http://localhost:5000/save-vendor/${biz.id}`;
        
        try {
            const res = await fetch(url, { 
                method: isCurrentlySaved ? 'DELETE' : 'POST', 
                credentials: "include" 
            });
            if (res.ok) {
                setSavedVendors(prev => 
                    isCurrentlySaved ? prev.filter(id => id !== biz.id) : [...prev, biz.id]
                );
            }
        } catch (e) { console.log(e) }
    }

    const clearSearch = () => {

        setSearchQuery('');
        // We use a small timeout to ensure state is updated before fetching, 
        // or we can pass the empty string directly to fetchResults.
        setSearching(true);
        const params = new URLSearchParams();
        if (selectedCategory !== 'All') params.append('category', selectedCategory);
        
        const urlMap = view === 'products' ? 'products' : 'vendors';
        fetch(`http://localhost:5000/${urlMap}?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                const results = view === 'products' ? data.products : data.vendors.map(v => ({
                    id: v._id || v.id,
                    businessName: v.BusinessName || v.name || 'Unknown Business',
                    ownerName: v.FullName || v.ownerName || 'Unknown Owner',
                    email: v.Email || v.email,
                    phone: v.Phone || v.phone,
                    category: v.category || 'General',
                    location: v.location || 'Pune, Maharashtra',
                    verified: true
                }));
                if (view === 'products') setProducts(results);
                else setVendors(results);
            })
            .catch(e => console.error(e))
            .finally(() => setSearching(false));
    }

    const handleLike = async (productId, e) => {
        e.stopPropagation();
        try {
            const res = await fetch(`http://localhost:5000/product/like/${productId}`, { 
                method: 'POST', 
                credentials: "include" 
            });
            if (res.ok) fetchResults();
        } catch (e) { console.log(e) }
    }

    const handleViewProduct = (productId) => {
        fetch(`http://localhost:5000/product/view/${productId}`, { method: 'PATCH' });
    }


    return (
        <div className="content">
            {/* View Toggle & Search */}
            <div className="card">
                <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.05)', padding: '5px', borderRadius: '10px' }}>
                    <button 
                        className={`btn-ghost-d ${view === 'businesses' ? 'active-tab' : ''}`} 
                        onClick={() => setView('businesses')}
                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', color: '#000' }}
                    >
                        <i className="fa-solid fa-store" style={{marginRight: '8px'}}></i> Businesses
                    </button>
                    <button 
                        className={`btn-ghost-d ${view === 'products' ? 'active-tab' : ''}`} 
                        onClick={() => setView('products')}
                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', color: '#000' }}
                    >
                        <i className="fa-solid fa-bag-shopping" style={{marginRight: '8px'}}></i> Products
                    </button>
                </div>

                <form onSubmit={handleSearch} className="search-bar">
                    <div className="search-wrap">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input 
                            className="search-input" 
                            type="text" 
                            placeholder={`Search ${view === 'businesses' ? 'businesses, services…' : 'products, collections…'}`} 
                            value={searchQuery} 
                            onChange={e => setSearchQuery(e.target.value)} 
                        />
                        {searchQuery && (
                            <i className="fa-solid fa-xmark clear-icon" onClick={clearSearch}></i>
                        )}
                    </div>
                    <button type="submit" className="search-btn-v" disabled={searching}>
                        {searching ? (
                            <i className="fa-solid fa-spinner fa-spin"></i>
                        ) : (
                            <i className="fa-solid fa-magnifying-glass"></i>
                        )}
                        <span>{searching ? '...' : 'Search'}</span>
                    </button>
                </form>
            </div>


            {/* Categories */}
            <div>
                <div className="sec-head"><i className="fa-solid fa-grid-2"></i> Browse Categories</div>
                <div className="cat-scroll">
                    <CategoryCard icon="fa-solid fa-th" label="All"
                        active={selectedCategory === 'All'} onClick={() => setSelectedCategory('All')} />
                    {CATEGORIES.map((c) => (
                        <CategoryCard key={c.label} icon={c.icon} label={c.label}
                            active={selectedCategory === c.label} onClick={() => setSelectedCategory(c.label)} />
                    ))}
                </div>
            </div>

            {/* Suggested / Trending Section */}
            {view === 'products' && trendingProducts.length > 0 && (
                <div className="trending-sec" style={{marginTop: '2rem'}}>
                    <div className="sec-head">
                        <i className="fa-solid fa-fire" style={{color: '#ff4d4d'}}></i> Trending Now 
                        <span className="badge-ai">AI Predicted Potential</span>
                    </div>
                    <div className="trending-scroll">
                        {trendingProducts.slice(0, 5).map(rec => {
                            const p = products.find(prod => (prod.id || prod._id) == rec.product_id);
                            if (!p) return null;
                            return (
                                <div key={p._id} className="trend-item" onClick={() => handleViewProduct(p._id)}>
                                    <img src={p.images?.[0]?.url || ''} alt={p.name} />
                                    <div className="trend-overlay">
                                        <div className="trend-info">
                                            <span className="trend-cat">{p.category}</span>
                                            <h5>{p.name}</h5>
                                            <div className="trend-stats">
                                                <span><i className="fa-solid fa-heart"></i> {p.likes?.length || 0}</span>
                                                <span className="trend-score">{Math.round(rec.engagement_potential)} potential</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}


            {/* Results Grid */}
            <div style={{ marginTop: '2rem' }}>
                <div className="sec-head">
                    <i className={`fa-solid ${view === 'businesses' ? 'fa-store' : 'fa-bag-shopping'}`}></i>
                    {view === 'businesses' ? ' Recommended Businesses' : ' Explore Products'}
                    <span style={{ fontSize: '.75rem', color: 'var(--muted)', marginLeft: '.3rem' }}>
                        ({view === 'businesses' ? vendors.length : products.length} found)
                    </span>
                </div>

                {searching ? (
                    <div style={{textAlign: 'center', padding: '3rem', color: 'var(--muted)'}}>Searching...</div>
                ) : (
                    <div className={view === 'businesses' ? "biz-grid" : "product-grid-c"}>
                        {view === 'businesses' ? (
                            vendors.map((b, i) => (
                                <BusinessCard 
                                    key={b.id} 
                                    business={{
                                        ...b,
                                        icon: b.businessName?.charAt(0),
                                        theme: `t${(i % 6) + 1}`,
                                        cat: b.category,
                                        name: b.businessName,
                                        loc: b.location,
                                        rating: 4.8,
                                        reviews: 0,
                                        desc: 'Premium quality services.',
                                        wa: `https://wa.me/${b.phone}`,
                                        ig: '#'
                                    }} 
                                    onView={() => onBizClick(b.id)} 
                                    onChat={() => onChatClick(b.id, b.businessName)} 
                                    isSaved={savedVendors.includes(b.id)}
                                    onToggleSave={() => handleToggleSave(b)}
                                />

                            ))
                        ) : (
                            products.map((p) => (
                                <div key={p._id} className="p-card-c" onClick={() => handleViewProduct(p._id)}>
                                    <div className="p-card-img">
                                        {p.images && p.images[0] ? (
                                            <img src={p.images[0].url} alt={p.name} />
                                        ) : (
                                            <div className="p-placeholder">📸</div>
                                        )}
                                        <div className="p-price-tag">₹{p.price}</div>
                                        {trendingProducts.some(r => r.product_id == p._id) && (
                                            <div className="p-trend-badge"><i className="fa-solid fa-chart-line"></i> High Potential</div>
                                        )}

                                    </div>
                                    <div className="p-card-info">
                                        <h4>{p.name}</h4>
                                        <p>{p.description || 'No description available'}</p>
                                        <span className="p-cat-badge">{p.category}</span>
                                        
                                        <div className="p-interaction">
                                            <button className="p-i-btn" onClick={(e) => handleLike(p._id, e)}>
                                                <i className={`fa-${p.likes?.includes(useAppData().currentUser?.id) ? 'solid' : 'regular'} fa-heart`}></i> 
                                                <span>{p.likes?.length || 0}</span>
                                            </button>
                                            <button className="p-i-btn">
                                                <i className="fa-regular fa-comment"></i>
                                                <span>{p.comments?.length || 0}</span>
                                            </button>
                                            <div className="p-views">
                                                <i className="fa-regular fa-eye"></i> {p.views || 0}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        
                        {(view === 'businesses' ? vendors : products).length === 0 && (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                                No results found for "{searchQuery}"
                            </div>
                        )}
                    </div>
                )}
            </div>


            <style>{`
                .biz-grid, .product-grid-c { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .search-bar { display: flex; gap: 12px; align-items: center; margin-top: 10px; width: 100%; transition: all 0.3s ease; }
                .active-tab { background: var(--indigo-lt) !important; color: #000 !important; font-weight: 700; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }

                /* Trending Section Styles */
                .trending-scroll { display: flex; gap: 15px; overflow-x: auto; padding-bottom: 1rem; scrollbar-width: none; }
                .trending-scroll::-webkit-scrollbar { display: none; }
                .trend-item { min-width: 200px; height: 120px; border-radius: 12px; overflow: hidden; position: relative; cursor: pointer; border: 1px solid rgba(255,255,255,0.05); }
                .trend-item img { width: 100%; height: 100%; object-fit: cover; }
                .trend-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); display: flex; align-items: flex-end; padding: 10px; }
                .trend-info h5 { color: white; margin: 0; font-size: 0.9rem; }
                .trend-cat { font-size: 0.65rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px; }
                .trend-stats { display: flex; justify-content: space-between; align-items: center; margin-top: 5px; width: 100%; }
                .trend-stats span { font-size: 0.7rem; color: #fff; }
                .badge-ai { background: var(--indigo-lt); color: white; padding: 2px 8px; border-radius: 20px; font-size: 0.7rem; margin-left: 10px; font-weight: normal; }
                .trend-score { color: var(--accent) !important; font-weight: bold; }

                .product-grid-c { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
                .p-card-c { background: var(--card-bg); border-radius: 15px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); transition: transform 0.3s; cursor: pointer; }
                .p-card-c:hover { transform: translateY(-5px); border-color: var(--indigo-lt); }
                .p-card-img { height: 180px; position: relative; background: #2a2d3e; display: flex; align-items: center; justify-content: center; overflow: hidden; }
                .p-card-img img { width: 100%; height: 100%; object-fit: cover; }
                .p-placeholder { font-size: 2.5rem; opacity: 0.3; }
                .p-price-tag { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); backdrop-filter: blur(5px); color: var(--accent); padding: 4px 10px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; }
                .p-trend-badge { position: absolute; bottom: 10px; left: 10px; background: rgba(255, 77, 77, 0.9); color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.65rem; font-weight: bold; }

                .p-card-info { padding: 15px; }
                .p-card-info h4 { margin-bottom: 5px; font-size: 1rem; color: white; }
                .p-card-info p { font-size: 0.8rem; color: var(--muted); line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; min-height: 40px; }
                .p-cat-badge { display: inline-block; margin-top: 10px; font-size: 0.7rem; background: rgba(255,255,255,0.05); padding: 3px 8px; border-radius: 4px; color: var(--indigo-lt); }
                
                .p-interaction { display: flex; align-items: center; gap: 15px; margin-top: 15px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05); }
                .p-i-btn { background: transparent; border: none; color: var(--muted); display: flex; align-items: center; gap: 5px; font-size: 0.85rem; cursor: pointer; transition: color 0.2s; }
                .p-i-btn:hover { color: white; }
                .p-i-btn i.fa-solid { color: #ff4d4d; }
                .p-views { margin-left: auto; font-size: 0.8rem; color: var(--muted); opacity: 0.6; }
                
                .search-wrap { position: relative; flex: 1; display: flex; align-items: center; background: #fdfdfd; border-radius: 12px; padding: 0 1rem; border: 1px solid rgba(255,255,255,0.1); transition: all 0.2s; }
                .search-wrap:focus-within { border-color: var(--indigo-lt); background: #ffffff; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
                .search-input { background: transparent; border: none; color: #000000; padding: 0.8rem 0.5rem; width: 100%; outline: none; font-size: 0.95rem; padding-right: 2.5rem; font-weight: 500; }
                .search-wrap i { color: #666; }
                .clear-icon { position: absolute; right: 12px; color: #999; cursor: pointer; transition: color 0.2s; padding: 5px; }
                .clear-icon:hover { color: white; }
                
                .search-btn-v {
                    background: var(--indigo-lt);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 0.65rem 1.4rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.6rem;
                    transition: all 0.2s;
                    cursor: pointer;
                    white-space: nowrap;
                    min-width: 110px;
                }
                .search-btn-v:hover:not(:disabled) {
                    background: var(--indigo);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                }
                .search-btn-v:active:not(:disabled) {
                    transform: translateY(0);
                }
                .search-btn-v:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                @media (max-width: 600px) {
                    .search-bar { flex-direction: column; align-items: stretch; gap: 10px; }
                    .search-btn-v { width: 100%; padding: 0.8rem; }
                }

            `}</style>
        </div>
    )
}

// ─── Feed Section ────────────────────────────────────────────────────────────
function Feed({ onChatClick, onBizClick }) {
    const { currentUser, trendingProducts, fetchTrending } = useAppData();
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const fetchFeed = async () => {
        try {
            const [pRes, sRes] = await Promise.all([
                fetch("http://localhost:5000/products"),
                fetch("http://localhost:5000/saved-vendors", { credentials: "include" })
            ]);
            
            if (pRes.ok) {
                const pData = await pRes.json();
                setProducts(pData.products);
            }
            fetchTrending();

            if (sRes.ok) {
                const sData = await sRes.json();
                setSavedVendors(sData.savedVendors.map(v => v._id));
            }
        } catch (e) { console.error("Feed Fetch Error:", e); }
        finally { setLoading(false); }
    };
    
    // Define savedVendors state for the feed specifically (or use a global hook better)
    const [savedVendors, setSavedVendors] = useState([]);

    useEffect(() => { fetchFeed(); }, []);

    const handleToggleSave = async (vendorId) => {
        const isCurrentlySaved = savedVendors.includes(vendorId);
        const url = isCurrentlySaved 
            ? `http://localhost:5000/unsave-vendor/${vendorId}` 
            : `http://localhost:5000/save-vendor/${vendorId}`;
        
        try {
            const res = await fetch(url, { 
                method: isCurrentlySaved ? 'DELETE' : 'POST', 
                credentials: "include" 
            });
            if (res.ok) fetchFeed();
        } catch (e) { console.log(e) }
    }

    const handleLike = async (productId) => {
        try {
            const res = await fetch(`http://localhost:5000/product/like/${productId}`, { 
                method: 'POST', 
                credentials: "include" 
            });
            if (res.ok) fetchFeed();
        } catch (e) { console.log(e) }
    };

    // Sort products based on AI recommendations if available
    const sortedProducts = [...products].sort((a, b) => {
        const recA = trendingProducts.find(r => r.product_id == (a.id || a._id))?.engagement_potential || 0;
        const recB = trendingProducts.find(r => r.product_id == (b.id || b._id))?.engagement_potential || 0;
        return recB - recA;
    });


    return (
        <div className="content">
            <div className="sec-head">
                <i className="fa-solid fa-rss" style={{color: 'var(--accent)'}}></i> Personalised Feed
                <span className="badge-ai">AI Ranked</span>
            </div>
            
            {loading ? (
                <div style={{textAlign: 'center', padding: '3rem'}}>Loading your personalized feed...</div>
            ) : (
                <div className="feed-container">
                    {sortedProducts.map((p) => (
                        <div key={p._id} className="feed-post card">
                            <div className="post-header">
                                <div className="post-avatar" onClick={() => onBizClick(p.vendorToken)} style={{cursor: 'pointer'}}>{p.category?.charAt(0)}</div>
                                <div className="post-meta" onClick={() => onBizClick(p.vendorToken)} style={{cursor: 'pointer'}}>
                                    <div className="post-vendor">{p.category} Specialist</div>
                                    <div className="post-time">Posted recently</div>
                                </div>
                                <div className="post-menu-wrap">
                                    <button className="post-menu" onClick={(e) => {
                                        const menu = e.currentTarget.nextElementSibling;
                                        menu.classList.toggle('show');
                                    }}>
                                        <i className="fa-solid fa-ellipsis"></i>
                                    </button>
                                    <div className="post-dropdown">
                                        <button onClick={() => handleToggleSave(p.vendorToken)}>
                                            <i className={`fa-${savedVendors.includes(p.vendorToken) ? 'solid' : 'regular'} fa-bookmark`}></i>
                                            {savedVendors.includes(p.vendorToken) ? ' Unsave Vendor' : ' Save Vendor'}
                                        </button>
                                        <button onClick={() => onChatClick(p.vendorToken, "Chat Hub")}>
                                            <i className="fa-regular fa-comment-dots"></i> Message
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="post-content">
                                <h3>{p.name}</h3>
                                <p>{p.description}</p>
                            </div>

                            <div className="post-media">
                                {p.images && p.images[0] ? (
                                    <img src={p.images[0].url} alt={p.name} />
                                ) : (
                                    <div className="media-placeholder"><i className="fa-solid fa-image"></i></div>
                                )}
                                <div className="post-price">₹{p.price}</div>
                            </div>

                            <div className="post-footer">
                                <div className="post-actions">
                                    <button className={`post-action-btn ${p.likes?.includes(currentUser?.id) ? 'liked' : ''}`} onClick={() => handleLike(p._id)}>
                                        <i className={`fa-${p.likes?.includes(currentUser?.id) ? 'solid' : 'regular'} fa-heart`}></i>
                                        <span>{p.likes?.length || 0}</span>
                                    </button>
                                    <button className="post-action-btn">
                                        <i className="fa-regular fa-comment"></i>
                                        <span>{p.comments?.length || 0}</span>
                                    </button>
                                    <button className="post-action-btn">
                                        <i className="fa-solid fa-share-nodes"></i>
                                    </button>
                                </div>
                                <div className="post-views">
                                    <i className="fa-regular fa-eye"></i> {p.views || 0} views
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {sortedProducts.length === 0 && (
                        <div className="empty-feed">
                            <i className="fa-solid fa-box-open"></i>
                            <p>No products available yet. Check back soon!</p>
                        </div>
                    )}
                </div>
            )}
            
            <style>{`
                .feed-container { display: flex; flex-direction: column; gap: 25px; max-width: 600px; margin: 0 auto; }
                .feed-post { padding: 0 !important; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
                
                .post-header { padding: 15px; display: flex; align-items: center; gap: 12px; position: relative; }
                .post-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--indigo-lt); display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; }
                .post-meta { flex: 1; }
                .post-vendor { font-weight: 600; font-size: 0.95rem; color: #000; }
                .post-time { font-size: 0.75rem; color: #666; }
                
                .post-menu-wrap { position: relative; }
                .post-menu { background: transparent; border: none; color: var(--muted); cursor: pointer; padding: 5px; font-size: 1.2rem; }
                .post-dropdown { position: absolute; top: 100%; right: 0; background: #2a2d3e; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 5px; min-width: 150px; z-index: 10; display: none; box-shadow: 0 8px 16px rgba(0,0,0,0.4); }
                .post-dropdown.show { display: block; }
                .post-dropdown button { background: transparent; border: none; color: white; width: 100%; text-align: left; padding: 8px 12px; font-size: 0.85rem; cursor: pointer; border-radius: 6px; display: flex; align-items: center; gap: 10px; }
                .post-dropdown button:hover { background: rgba(255,255,255,0.1); }
                .post-dropdown button i { color: var(--accent); width: 15px; }
                
                .post-content { padding: 0 15px 15px 15px; }
                .post-content h3 { font-size: 1.1rem; margin-bottom: 5px; color: #000; }
                .post-content p { font-size: 0.9rem; color: #444; }
                
                .post-media { position: relative; width: 100%; min-height: 300px; background: #1a1c2a; display: flex; align-items: center; justify-content: center; }
                .post-media img { width: 100%; max-height: 500px; object-fit: cover; }
                .media-placeholder { font-size: 3rem; opacity: 0.1; }
                .post-price { position: absolute; bottom: 15px; right: 15px; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); padding: 5px 12px; border-radius: 20px; color: var(--accent); font-weight: bold; }
                
                .post-footer { padding: 12px 15px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between; }
                .post-actions { display: flex; gap: 20px; }
                .post-action-btn { background: transparent; border: none; color: var(--muted); display: flex; align-items: center; gap: 8px; font-size: 1rem; cursor: pointer; transition: all 0.2s; }
                .post-action-btn:hover { color: white; transform: scale(1.1); }
                .post-action-btn.liked { color: #ff4d4d; }
                .post-views { font-size: 0.8rem; color: var(--muted); opacity: 0.7; }
                
                .empty-feed { text-align: center; padding: 5rem 0; color: var(--muted); }
                .empty-feed i { font-size: 4rem; opacity: 0.1; margin-bottom: 1rem; }
            `}</style>
        </div>
    );
}

// ─── Business View Section (Profile) ─────────────────────────────────────────
function BusinessView({ vendorId, onBack, onChatClick }) {
    const [vendor, setVendor] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBusinessDetails = async () => {
        try {
            const [vRes, pRes] = await Promise.all([
                fetch(`http://localhost:5000/vendors`), // We don't have a single vendor fetch yet, so we filter
                fetch(`http://localhost:5000/products`)
            ]);
            
            if (vRes.ok) {
                const vData = await vRes.json();
                const found = vData.vendors.find(v => v._id === vendorId);
                setVendor(found);
            }
            if (pRes.ok) {
                const pData = await pRes.json();
                const vProducts = pData.products.filter(p => p.vendorToken === vendorId);
                setProducts(vProducts);
            }
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    };

    useEffect(() => { fetchBusinessDetails() }, [vendorId]);

    if (loading) return <div className="content">Loading profile...</div>;

    return (
        <div className="content">
            <button className="btn-ghost-sm" onClick={onBack} style={{marginBottom: '1rem'}}>
                <i className="fa-solid fa-arrow-left"></i> Back to Explore
            </button>
            
            <div className="card biz-profile-card">
                <div className="biz-banner" style={{background: 'var(--indigo-lt)', height: '100px', borderRadius: '10px 10px 0 0', position: 'relative'}}>
                    <div className="biz-p-avatar">{vendor?.BusinessName?.charAt(0)}</div>
                </div>
                <div className="biz-p-body" style={{padding: '50px 20px 20px 20px'}}>
                    <div className="biz-p-head">
                        <div>
                            <h2>{vendor?.BusinessName}</h2>
                            <p className="p-cat">{vendor?.category} · {vendor?.location || 'Local Business'}</p>
                        </div>
                        <button className="btn-primary-d" onClick={() => onChatClick(vendorId, vendor?.BusinessName)}>
                            <i className="fa-regular fa-comment-dots"></i> Message Now
                        </button>
                    </div>
                </div>
            </div>

            <div className="sec-head" style={{marginTop: '2rem'}}>Portfolio & Items</div>
            <div className="product-grid-c">
                {products.map(p => (
                    <div key={p._id} className="p-card-c">
                        <div className="p-card-img">
                            <img src={p.images?.[0]?.url} alt={p.name} />
                            <div className="p-price-tag">₹{p.price}</div>
                        </div>
                        <div className="p-card-info">
                            <h4>{p.name}</h4>
                            <p>{p.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .biz-profile-card { padding: 0 !important; overflow: hidden; background: #fff !important; }
                .biz-p-avatar { width: 80px; height: 80px; border-radius: 50%; background: #2a2d3e; border: 4px solid #fff; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; color: white; position: absolute; bottom: -40px; left: 20px; }
                .biz-p-head { display: flex; justify-content: space-between; align-items: center; }
                .biz-p-head h2 { margin: 0; font-size: 1.5rem; color: #000; }
                .p-cat { color: #555; margin-top: 5px; font-size: 0.9rem; }
            `}</style>
        </div>
    );
}

// ─── Customer Profile Section ─────────────────────────────────────────────────


function Profile({ user, setUser }) {
    const { setAuth } = useAppData();
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
                setAuth(data.user, 'customer');
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
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Instant local preview
        const reader = new FileReader();
        reader.onload = (event) => {
            setUser(prev => ({ ...prev, avatar: { ...prev.avatar, url: event.target.result } }));
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append("avatar", file);

        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/me/avatar", {
                method: "PUT",
                credentials: "include",
                body: formData
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    // Update global state with the actual server URL after successful upload
                    const updatedUser = { ...user, avatar: data.user.avatar };
                    setUser(updatedUser);
                    setAuth(updatedUser, 'customer');
                    setMessage("Avatar updated!");
                    setTimeout(() => setMessage(''), 3000);
                }
            }
        } catch (e) { 
            console.error(e);
            setMessage("Update failed");
        }
        finally { setLoading(false) }
    }

    const handleDeleteAvatar = async (e) => {
        e.stopPropagation();
        if (!window.confirm("Delete profile photo?")) return;
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/me/avatar", {
                method: "DELETE",
                credentials: "include"
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    const updatedUser = { ...user, avatar: null };
                    setUser(updatedUser);
                    setAuth(updatedUser, 'customer');
                    setMessage("Photo deleted");
                    setTimeout(() => setMessage(''), 3000);
                }
            }
        } catch (e) {
            console.error(e);
            setMessage("Failed to delete photo");
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
                        <div className="p-avatar-wrap">
                            <div className="p-avatar" style={{ backgroundColor: '#fff', overflow: 'hidden' }}>
                                {user.avatar?.url ? (
                                    <img 
                                        src={user.avatar.url} 
                                        alt="Profile" 
                                        style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}}
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                ) : null}
                                {(!user.avatar?.url) && <span style={{ color: '#000' }}>{user.FullName ? user.FullName.charAt(0).toUpperCase() : 'U'}</span>}
                                <label className="p-cam" htmlFor="avatar-upload" title="Upload Photo">
                                    <i className="fa-solid fa-camera" style={{ color: '#000' }}></i>
                                    <input type="file" id="avatar-upload" hidden accept="image/*" onChange={handleAvatarChange} />
                                </label>
                                {user.avatar?.url && (
                                    <button className="avatar-delete-btn" onClick={handleDeleteAvatar} title="Delete Photo">
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                )}
                            </div>
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
            <style>{`
                .profile-hero-c { display: flex; gap: 20px; align-items: center; padding: 10px 0; }
                .p-avatar-wrap { position: relative; }
                .p-avatar { 
                    width: 100px; height: 100px; border-radius: 50%; 
                    background: #fff; 
                    color: #000; display: flex; align-items: center; justify-content: center; 
                    font-size: 2.2rem; font-weight: bold; position: relative; 
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    border: 1px solid #ddd;
                }
                .p-cam { 
                    position: absolute; bottom: 5px; right: 5px; width: 30px; height: 30px; 
                    background: #fff; border-radius: 50%; color: #000; 
                    font-size: 0.9rem; display: flex; align-items: center; justify-content: center; 
                    border: 1px solid #ddd; cursor: pointer; transition: all 0.2s;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .p-cam:hover { transform: scale(1.1); background: var(--indigo-lt); color: #fff; }
                .avatar-delete-btn {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    width: 28px;
                    height: 28px;
                    background: #ff4d4d;
                    border-radius: 50%;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid #fff;
                    font-size: 0.75rem;
                    cursor: pointer;
                    transition: transform 0.2s;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
                }
                .avatar-delete-btn:hover { transform: scale(1.1); background: #e60000; }
                .p-name { font-size: 1.6rem; font-weight: bold; color: #000; }
                .p-meta { font-size: 0.9rem; color: #444; }
                .form-label { color: #333 !important; }
                .form-input-d { color: #000 !important; font-weight: 500; }
            `}</style>
        </div>
    )
}

// ─── Saved Businesses Section ────────────────────────────────────────────────
function Saved({ onChatClick, onBizClick }) {
    const [saved, setSaved] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchSaved = async () => {
        try {
            const res = await fetch("http://localhost:5000/saved-vendors", { credentials: "include" })
            if (res.ok) {
                const data = await res.json()
                setSaved(data.savedVendors)
            }
        } catch (e) { console.log(e) }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchSaved() }, [])

    const handleRemove = async (bizId) => {
        try {
            const res = await fetch(`http://localhost:5000/unsave-vendor/${bizId}`, { 
                method: 'DELETE', 
                credentials: "include" 
            });
            if (res.ok) {
                setSaved(prev => prev.filter(v => v._id !== bizId))
            }
        } catch (e) { console.log(e) }
    }

    if (loading) return <div className="content">Loading saved businesses...</div>

    return (
        <div className="content">
            <div className="sec-head"><i className="fa-solid fa-bookmark"></i> My Saved Businesses</div>
            
            {saved.length === 0 ? (
                <div className="card" style={{textAlign: 'center', padding: '3rem', color: 'var(--muted)'}}>
                    <i className="fa-regular fa-bookmark" style={{fontSize: '3rem', marginBottom: '1rem', opacity: .2}}></i>
                    <p>You haven't saved any businesses yet.</p>
                </div>
            ) : (
                <div className="biz-grid">
                    {saved.map((v, i) => (
                        <BusinessCard 
                            key={v._id} 
                            business={{
                                id: v._id,
                                name: v.BusinessName,
                                cat: v.category || 'General',
                                loc: 'Pune, Maharashtra',
                                icon: v.BusinessName?.charAt(0),
                                theme: `t${(i % 6) + 1}`,
                                wa: `https://wa.me/${v.Phone}`,
                                rating: 4.8,
                                reviews: 0,
                                desc: 'Saved for future reference.'
                            }}
                            isSaved={true}
                            onToggleSave={() => handleRemove(v._id)}
                            onChat={() => onChatClick(v._id, v.BusinessName)}
                            onView={() => onBizClick(v._id)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

// ─── Section title map ────────────────────────────────────────────────────────
const TITLES = {
    feed: 'Your Feed',
    explore: 'Explore Businesses',
    profile: 'My Profile',
    messages: 'Messages',
    saved: 'Saved Businesses',
    bizView: 'Business Portfolio'
}


// ─── CustomerDashboard (main export) ─────────────────────────────────────────
export default function CustomerDashboard() {
    const { threads, createThread } = useAppData()
    const navigate = useNavigate()

    const [section, setSection] = useState('feed')
    const [history, setHistory] = useState(['feed'])
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [user, setUser] = useState({ FullName: '', Email: '', Phone: '' })
    const [loading, setLoading] = useState(true)

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

        const init = async () => {
            await fetchUserDetails();
            setLoading(false);
        }
        init();
    }, [navigate])


    const [selectedChatId, setSelectedChatId] = useState(null)
    const [selectedBizId, setSelectedBizId] = useState(null)

    const handleChatClick = (vendorId, vendorName) => {
        setSelectedChatId(vendorId);
        handleNavigate('messages');
    }

    const handleBizClick = (vendorId) => {
        setSelectedBizId(vendorId);
        handleNavigate('bizView');
    }


    const renderSection = () => {
        if (loading && section === 'feed') return <div className="content">Loading feed...</div>;

        switch (section) {
            case 'feed': return <Feed onChatClick={handleChatClick} onBizClick={handleBizClick} />
            case 'explore': return <Explore onChatClick={handleChatClick} onBizClick={handleBizClick} />
            case 'profile': return <Profile user={user} setUser={setUser} />
            case 'messages': return <ChatBox threads={threads} avatarKey="initials" initialThreadId={selectedChatId} />
            case 'bizView': return <BusinessView vendorId={selectedBizId} onBack={handleBack} onChatClick={handleChatClick} />


            case 'saved': return <Saved onChatClick={handleChatClick} onBizClick={handleBizClick} />
            default: return <Explore onChatClick={handleChatClick} onBizClick={handleBizClick} />

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
