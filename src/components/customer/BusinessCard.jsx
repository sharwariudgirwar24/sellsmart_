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
export default function BusinessCard({ business: b, onView, onChat, showRemove = false, onRemove }) {
    return (
        <div className="biz-card">
            <div className={`biz-thumb ${b.theme}`}>
                <span>{b.icon}</span>
                <div className="biz-cat-badge">{b.cat}</div>
                {b.verified && <div className="biz-verified">✓ Verified</div>}
            </div>
            <div className="biz-body">
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
                <div className="biz-actions">
                    <button className="btn-sm btn-primary-sm" onClick={() => onChat ? onChat(b) : onView?.(b)}>
                        <i className="fa-regular fa-comment-dots"></i> Message
                    </button>
                    <a href={b.wa} className="btn-sm btn-wa-sm" target="_blank" rel="noreferrer">
                        <i className="fa-brands fa-whatsapp"></i>
                    </a>
                    {showRemove ? (
                        <button className="btn-sm btn-ghost-sm" title="Remove from saved" onClick={() => onRemove?.(b)}>
                            <i className="fa-solid fa-bookmark"></i>
                        </button>
                    ) : (
                        <a href={b.ig} className="btn-sm btn-ig-sm" target="_blank" rel="noreferrer">
                            <i className="fa-brands fa-instagram"></i>
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}
