/**
 * VendorProfile – Business profile display and edit form.
 * Props:
 *   vendor {object} – Vendor profile data (passed from dashboard state or API)
 *
 * TODO: Connect to backend:
 *   - GET /api/vendor/profile → load vendor data
 *   - PUT /api/vendor/profile → save changes
 */
export default function VendorProfile({ vendor }) {
    const biz = vendor ?? {
        name: "Priya's Boutique",
        ownerName: 'Priya Sharma',
        category: 'Fashion & Tailoring',
        location: 'Pune, Maharashtra',
        phone: '+91 98765 43210',
        email: 'priya@boutique.com',
        hours: 'Mon–Sat, 10 AM – 7 PM',
        waLink: 'https://wa.me/919876543210',
        igHandle: '@priyasboutique',
        fbPage: "Priya's Boutique",
        description: 'Specializing in custom stitching, bridal wear, and embroidery work.',
        services: ['Custom Stitching', 'Blouse Work', 'Embroidery', 'Alterations', 'Bridal Wear', 'Kids Wear'],
        hours_detail: [['Mon–Fri', '10:00 AM – 7:00 PM'], ['Saturday', '11:00 AM – 5:00 PM'], ['Sunday', 'Closed']],
        verified: true,
    }

    return (
        <div className="content">
            {/* Profile Hero */}
            <div className="card">
                <div className="section-heading"><i className="fa-solid fa-store"></i> Business Profile</div>
                <div className="profile-hero">
                    <div className="profile-avatar-wrap">
                        <div className="profile-avatar">🧵</div>
                        <div className="avatar-cam"><i className="fa-solid fa-camera"></i></div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{biz.name}</h2>
                        {biz.verified && <div className="verified"><i className="fa-solid fa-circle-check"></i> Verified Business</div>}
                        <div className="cat-tag"><i className="fa-solid fa-tag"></i> {biz.category}</div>
                        <div className="profile-meta">
                            <span><i className="fa-solid fa-location-dot"></i> {biz.location}</span>
                            <span><i className="fa-solid fa-phone"></i> {biz.phone}</span>
                            <span><i className="fa-regular fa-envelope"></i> {biz.email}</span>
                            <span><i className="fa-solid fa-clock"></i> {biz.hours}</span>
                        </div>
                        <div className="profile-actions">
                            <button className="btn-primary-d"><i className="fa-solid fa-pen"></i> Edit Profile</button>
                            <a href={biz.waLink} className="wa-btn" target="_blank" rel="noreferrer">
                                <i className="fa-brands fa-whatsapp"></i> WhatsApp
                            </a>
                            <button className="btn-ghost-d"><i className="fa-solid fa-share-nodes"></i> Share Profile</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hours & Services */}
            <div className="info-2col">
                <div className="info-card">
                    <div className="section-heading"><i className="fa-solid fa-clock"></i> Business Hours</div>
                    {biz.hours_detail.map(([day, time]) => (
                        <div className="hours-row" key={day}>
                            <span className="day">{day}</span>
                            <span className={time === 'Closed' ? 'closed' : 'time'}>{time}</span>
                        </div>
                    ))}
                </div>
                <div className="info-card">
                    <div className="section-heading"><i className="fa-solid fa-scissors"></i> Services Offered</div>
                    <div className="services-list">
                        {biz.services.map((s) => (
                            <span className="service-chip" key={s}>{s}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Social Links */}
            <div className="card">
                <div className="section-heading"><i className="fa-solid fa-share-nodes"></i> Social &amp; Contact Links</div>
                <div className="social-grid">
                    <a href={biz.waLink} className="social-card wa" target="_blank" rel="noreferrer">
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
