/**
 * PostGallery – Grid display of vendor's uploaded posts (photos/videos).
 * Props:
 *   posts {Array} – Array of post objects: { icon, label, caption, price }
 *   onEdit {func} – Called with post when Edit is clicked
 *   onDelete {func} – Called with post when Delete is clicked
 *
 * TODO: Connect to backend:
 *   - GET /api/vendor/posts → fetch posts list
 *   - DELETE /api/vendor/posts/:id → delete a post
 */
export default function PostGallery({ posts = [], onEdit, onDelete }) {
    return (
        <div className="content">
            <div className="card">
                <div className="section-heading">
                    <i className="fa-solid fa-images"></i> My Posts ({posts.length})
                </div>
                {posts.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>
                        <i className="fa-solid fa-images" style={{ fontSize: '2rem', marginBottom: '.5rem', display: 'block' }}></i>
                        No posts yet. Click <strong>Post Work</strong> to add your first post!
                    </div>
                ) : (
                    <div className="portfolio-grid">
                        {posts.map((post, i) => (
                            <div className="portfolio-item" key={post.id ?? i}>
                                <div className="thumb">{post.icon}</div>
                                <div className="item-type-badge">{post.label}</div>
                                <div className="overlay">
                                    <div className="caption">{post.caption}</div>
                                    <div className="price-tag">{post.price}</div>
                                </div>
                                <div className="item-actions">
                                    <button
                                        className="item-act-btn"
                                        title="Edit"
                                        onClick={(e) => { e.stopPropagation(); onEdit?.(post); }}
                                    >
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                    <button
                                        className="item-act-btn"
                                        title="Delete"
                                        style={{ color: 'var(--error)' }}
                                        onClick={(e) => { e.stopPropagation(); onDelete?.(post); }}
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
