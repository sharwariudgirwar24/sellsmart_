export default function AnimatedBackground() {
    return (
        <div className="bg-panel">
            <div className="blob blob-a"></div>
            <div className="blob blob-b"></div>
            <div className="blob blob-c"></div>

            <div className="deco-icons">
                <div className="deco-icon" style={{ color: '#7BBBFF' }}><i className="fa-solid fa-store"></i></div>
                <div className="deco-icon" style={{ color: '#B8A9FF' }}><i className="fa-solid fa-chart-line"></i></div>
                <div className="deco-icon" style={{ color: '#7BBBFF' }}><i className="fa-solid fa-bag-shopping"></i></div>
                <div className="deco-icon" style={{ color: '#050F2A' }}><i className="fa-solid fa-handshake"></i></div>
                <div className="deco-icon" style={{ color: '#B8A9FF' }}><i className="fa-solid fa-scissors"></i></div>
                <div className="deco-icon" style={{ color: '#7BBBFF' }}><i className="fa-solid fa-camera"></i></div>
                <div className="deco-icon" style={{ color: '#050F2A' }}><i className="fa-solid fa-arrow-trend-up"></i></div>
                <div className="deco-icon" style={{ color: '#B8A9FF' }}><i className="fa-solid fa-star"></i></div>
            </div>

            <svg className="scene-svg" viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="200" width="1440" height="120" fill="rgba(123,187,255,0.12)" rx="0" />
                <rect x="50" y="100" width="100" height="120" fill="rgba(184,169,255,0.35)" rx="6" />
                <rect x="60" y="115" width="25" height="30" fill="rgba(255,255,255,0.4)" rx="3" />
                <rect x="100" y="115" width="25" height="30" fill="rgba(255,255,255,0.4)" rx="3" />
                <rect x="55" y="88" width="90" height="18" fill="rgba(123,187,255,0.55)" rx="4" />
                <rect x="180" y="130" width="120" height="90" fill="rgba(123,187,255,0.3)" rx="6" />
                <rect x="195" y="150" width="35" height="45" fill="rgba(255,255,255,0.3)" rx="3" />
                <rect x="180" y="118" width="120" height="16" fill="rgba(184,169,255,0.5)" rx="4" />
                <rect x="330" y="60" width="80" height="160" fill="rgba(123,187,255,0.35)" rx="6" />
                <rect x="340" y="75" width="20" height="25" fill="rgba(255,255,255,0.4)" rx="2" />
                <rect x="375" y="75" width="20" height="25" fill="rgba(255,255,255,0.4)" rx="2" />
                <rect x="440" y="110" width="110" height="110" fill="rgba(184,169,255,0.3)" rx="6" />
                <rect x="440" y="98" width="110" height="16" fill="rgba(123,187,255,0.45)" rx="4" />
                <rect x="580" y="80" width="90" height="140" fill="rgba(123,187,255,0.32)" rx="6" />
                <rect x="900" y="120" width="110" height="100" fill="rgba(184,169,255,0.3)" rx="6" />
                <rect x="1040" y="90" width="80" height="130" fill="rgba(123,187,255,0.35)" rx="6" />
                <rect x="1150" y="110" width="130" height="110" fill="rgba(184,169,255,0.28)" rx="6" />
                <rect x="1310" y="130" width="100" height="90" fill="rgba(123,187,255,0.3)" rx="6" />
            </svg>
        </div>
    )
}
