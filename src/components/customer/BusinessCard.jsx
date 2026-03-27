/**
 * BusinessCard – displays a single business listing card.
 * Props:
 *   business {object} – Business data object with fields:
 *     { icon, theme, cat, name, loc, rating, reviews, desc, wa, ig, verified }
 *   onView {func} – Called when "View" button is clicked
 *   onChat {func} – Called when "Message" button is clicked
 *   showRemove {bool} – Show "Remove" button instead of Instagram link (for Saved page)
 *   onRemove {func}  – Called when "Remove" button is clicked
 */
export default function BusinessCard({ 
    business: b, 
    onView, 
    onChat, 
    isSaved = false, 
    onToggleSave 
}) {
    return (
        <div className="biz-card">
            <div className={`biz-thumb ${b.theme}`}>
                <span>{b.icon}</span>
                <div className="biz-cat-badge">{b.cat}</div>
                {b.verified && <div className="biz-verified">✓ Verified</div>}
            </div>
            <div className="biz-body" onClick={() => onView?.(b)} style={{cursor: 'pointer'}}>
                <div className="biz-name">{b.name}</div>
                <div className="biz-loc">
                    <i className="fa-solid fa-location-dot"></i> {b.loc}
                </div>
                <div className="biz-stars">
                    {'★'.repeat(Math.floor(b.rating))}
                    {b.rating % 1 !== 0 ? '½' : ''}
                    <span>({b.reviews} reviews)</span>
                </div>
                <div className="biz-desc">{b.desc}</div>
            </div>
            <div className="biz-body-footer" style={{padding: '0 15px 15px 15px'}}>
                <div className="biz-actions">
                    <button className="btn-sm btn-primary-sm" onClick={(e) => {
                        e.stopPropagation();
                        onChat ? onChat(b) : onView?.(b);
                    }}>
                        <i className="fa-regular fa-comment-dots"></i> Message
                    </button>
                    
                    <button 
                        className={`btn-sm ${isSaved ? 'btn-danger-sm' : 'btn-ghost-sm'}`} 
                        title={isSaved ? "Remove from saved" : "Save business"} 
                        onClick={() => onToggleSave?.(b)}
                    >
                        <i className={`fa-${isSaved ? 'solid' : 'regular'} fa-bookmark`}></i>
                    </button>

                    <a href={b.wa} className="btn-sm btn-wa-sm" target="_blank" rel="noreferrer">
                        <i className="fa-brands fa-whatsapp"></i>
                    </a>
                </div>
            </div>
        </div>
    )
}

