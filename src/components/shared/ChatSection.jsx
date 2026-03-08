import { useState } from 'react'

/**
 * ChatSection – Reusable chat/messaging panel.
 * Works for both Customer and Vendor dashboards.
 *
 * Props:
 *   threads {Array} – Array of conversation thread objects:
 *     { name, preview, time, unread, initials?, icon?, color }
 *   avatarKey {string} – 'initials' (for vendor) or 'icon' (for customer)
 *
 * TODO: Connect selectedThread and message send to backend WebSocket or REST API.
 *   - GET /api/messages/threads  → thread list
 *   - GET /api/messages/:threadId → message history
 *   - POST /api/messages/:threadId → send message
 */
export default function ChatSection({ threads = [], avatarKey = 'initials' }) {
    const [activeThread, setActiveThread] = useState(0)
    const [msgText, setMsgText] = useState('')

    // TODO: fetch messages from backend when activeThread changes
    const handleSend = () => {
        if (!msgText.trim()) return
        // TODO: POST /api/messages/:threadId  body: { text: msgText }
        setMsgText('')
    }

    const activeData = threads[activeThread]

    return (
        <div className="content">
            <div className="messages-layout">
                {/* Thread list */}
                <div className="msg-list">
                    <div className="msg-list-header">
                        Conversations
                        <span style={{ color: 'var(--indigo-lt)', fontSize: '.75rem' }}>
                            {threads.reduce((a, t) => a + (t.unread || 0), 0)} new
                        </span>
                    </div>
                    {threads.map((t, i) => (
                        <div
                            className={`msg-thread ${activeThread === i ? 'active' : ''}`}
                            key={i}
                            onClick={() => setActiveThread(i)}
                        >
                            <div
                                className="msg-avatar"
                                style={{ background: `linear-gradient(135deg, ${t.color}, #9333ea)` }}
                            >
                                {avatarKey === 'icon' ? t.icon : t.initials}
                            </div>
                            <div className="msg-thread-info">
                                <div className="thread-name">{t.name}</div>
                                <div className="thread-preview">{t.preview}</div>
                            </div>
                            <span className="msg-time">{t.time}</span>
                            {t.unread > 0 && <div className="msg-unread">{t.unread}</div>}
                        </div>
                    ))}
                </div>

                {/* Chat panel */}
                {activeData && (
                    <div className="chat-panel">
                        <div className="chat-header">
                            <div
                                className="msg-avatar"
                                style={{ background: `linear-gradient(135deg, ${activeData.color}, #9333ea)` }}
                            >
                                {avatarKey === 'icon' ? activeData.icon : activeData.initials}
                            </div>
                            <div>
                                <div className="ch-name">{activeData.name}</div>
                                <div className="ch-status">● Online</div>
                            </div>
                        </div>

                        <div className="chat-messages">
                            <div className="chat-msg received">
                                <div className="bubble">{activeData.preview}</div>
                                <div className="msg-meta">10:32 AM</div>
                            </div>
                            <div className="chat-msg sent">
                                <div className="bubble">Hi! Sure, I'd be happy to help. Can you share more details?</div>
                                <div className="msg-meta">10:34 AM · Seen</div>
                            </div>
                        </div>

                        <div className="chat-input-row">
                            <input
                                className="chat-input"
                                placeholder="Type a message…"
                                value={msgText}
                                onChange={(e) => setMsgText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button className="send-btn" onClick={handleSend}>
                                <i className="fa-solid fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
