import { useState, useRef, useEffect, useMemo } from 'react'
import { useAppData } from '../../context/AppDataContext'

export default function ChatSection({ threads = [], avatarKey = 'initials' }) {
    const { currentUser, sendMessage, toggleThreadResolved, markThreadRead, typingState, editMessage } = useAppData()
    const [activeThreadIndex, setActiveThreadIndex] = useState(0)
    const [msgText, setMsgText] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const messagesEndRef = useRef(null)

    // Derived active thread based on filtered list so index doesn't mismatch
    const filteredThreads = useMemo(() => {
        return threads.filter(t => {
            if (!searchQuery) return true;
            return t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.preview?.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [threads, searchQuery]);

    const activeData = filteredThreads[activeThreadIndex];

    // Auto scroll to bottom and mark read
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        if (activeData && activeData.unread > 0) {
            markThreadRead(activeData.id);
        }
    }, [activeData?.messages, activeData?.id]);

    const handleSend = () => {
        if (!msgText.trim() || !activeData || !currentUser) return
        sendMessage(activeData.id, msgText, currentUser.role)
        setMsgText('')
    }

    const renderStatus = (status) => {
        if (status === 'sent') return <span className="m-status"><i className="fa-solid fa-check"></i></span>;
        if (status === 'delivered') return <span className="m-status"><i className="fa-solid fa-check-double"></i></span>;
        if (status === 'seen') return <span className="m-status read"><i className="fa-solid fa-check-double"></i></span>;
        return null;
    }

    return (
        <div className="content h-full">
            <div className="messages-layout">
                {/* Thread list */}
                <div className="msg-list">
                    <div className="msg-list-header">
                        Conversations
                        <span style={{ color: 'var(--indigo-lt)', fontSize: '.75rem', marginLeft: '0.5rem' }}>
                            {threads.reduce((a, t) => a + (t.unread || 0), 0)} new
                        </span>
                    </div>

                    <div className="msg-search-wrap">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            className="msg-search-input"
                            type="text"
                            placeholder="Search chats"
                            value={searchQuery}
                            onChange={e => {
                                setSearchQuery(e.target.value);
                                setActiveThreadIndex(0); // Reset index on search
                            }}
                        />
                    </div>

                    {filteredThreads.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
                            No conversations found.
                        </div>
                    ) : (
                        filteredThreads.map((t, i) => (
                            <div
                                className={`msg - thread ${activeThreadIndex === i ? 'active' : ''} ${t.resolved ? 'resolved' : ''} `}
                                key={t.id}
                                onClick={() => setActiveThreadIndex(i)}
                            >
                                <div
                                    className="msg-avatar"
                                    style={{ background: `linear - gradient(135deg, ${t.color || '#4f46e5'}, #9333ea)` }}
                                >
                                    {avatarKey === 'icon' ? (t.icon || '💬') : (t.initials || '..')}
                                </div>
                                <div className="msg-thread-info">
                                    <div className="thread-name">{t.name} {t.resolved && <i className="fa-solid fa-circle-check text-green-500 text-xs ml-1" title="Resolved"></i>}</div>
                                    <div className="thread-preview">{typingState[t.id] ? <span className="typing-text">typing...</span> : t.preview}</div>
                                </div>
                                <span className="msg-time">{t.time}</span>
                                {t.unread > 0 && <div className="msg-unread">{t.unread}</div>}
                            </div>
                        ))
                    )}
                </div>

                {/* Chat panel */}
                {activeData ? (
                    <div className="chat-panel">
                        <div className="chat-header">
                            <div
                                className="msg-avatar"
                                style={{ background: `linear - gradient(135deg, ${activeData.color || '#4f46e5'}, #9333ea)` }}
                            >
                                {avatarKey === 'icon' ? (activeData.icon || '💬') : (activeData.initials || '..')}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className="ch-name">
                                    {currentUser.role === 'vendor' ? activeData.name : activeData.vendorName || activeData.name}
                                </div>
                                <div className="ch-status">
                                    {typingState[activeData.id] ? 'typing...' : '● Online'}
                                </div>
                            </div>

                            {currentUser.role === 'vendor' && (
                                <button
                                    className={`btn - sm ${activeData.resolved ? 'btn-ghost-sm' : 'btn-primary-sm'} `}
                                    onClick={() => toggleThreadResolved(activeData.id)}
                                >
                                    <i className={`fa - solid ${activeData.resolved ? 'fa-arrow-rotate-left' : 'fa-check'} `}></i>
                                    {activeData.resolved ? ' Reopen' : ' Resolve'}
                                </button>
                            )}
                        </div>

                        <div className="chat-messages">
                            {activeData.messages?.length === 0 ? (
                                <div style={{ textAlign: 'center', color: 'var(--muted)', marginTop: '2rem' }}>
                                    Start a conversation!
                                </div>
                            ) : (
                                activeData.messages?.map((m, i) => {
                                    const isSent = m.senderRole === currentUser?.role;
                                    return (
                                        <div key={m.id || i} className={`chat - msg ${isSent ? 'sent' : 'received'} `}>
                                            <div className="bubble group-bubble">
                                                {m.text}
                                                {m.edited && <span className="msg-edited">(edited)</span>}

                                                {isSent && currentUser.role === 'vendor' && (
                                                    <button
                                                        className="edit-msg-btn"
                                                        onClick={() => {
                                                            const newText = prompt("Edit your message:", m.text);
                                                            if (newText && newText.trim() !== m.text) {
                                                                editMessage(activeData.id, m.id, newText.trim());
                                                            }
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>
                                                )}
                                            </div>
                                            <div className="msg-meta">
                                                {m.time}
                                                {isSent && renderStatus(m.status)}
                                            </div>
                                        </div>
                                    );
                                })
                            )}

                            {typingState[activeData.id] && (
                                <div className="chat-msg received">
                                    <div className="bubble typing-indicator">
                                        <span></span><span></span><span></span>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {!activeData.resolved ? (
                            <div className="chat-input-row">
                                <input
                                    className="chat-input"
                                    placeholder="Type a message…"
                                    value={msgText}
                                    onChange={(e) => setMsgText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                />
                                <button className="send-btn" onClick={handleSend} disabled={!msgText.trim()}>
                                    <i className="fa-solid fa-paper-plane"></i>
                                </button>
                            </div>
                        ) : (
                            <div className="chat-input-row justify-center bg-gray-50 text-gray-500 italic">
                                This conversation has been marked as resolved.
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="chat-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
                        Select a conversation to start chatting
                    </div>
                )}
            </div>
        </div>
    )
}

