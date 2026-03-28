import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:5000", { withCredentials: true, autoConnect: false });


const AppDataContext = createContext();

// ─── Initial Data Seeds ────────────────────────────────────────────────────────
const SEED_VENDORS = [
    {
        id: '1',
        name: 'Priya\'s Boutique',
        ownerName: 'Priya',
        email: 'priya@boutique.com',
        phone: '+91 98765 43210',
        businessName: 'Priya\'s Boutique',
        category: 'Fashion & Tailoring',
        whatsapp: '+91 98765 43210',
        instagram: '@priyasboutique',
        location: 'Pune, Maharashtra',
        verified: true,
        stats: { views: 124, contacts: 38 },
        reviews: [
            { id: 1, user: 'Ananya', rating: 5, text: 'Great stitching! Fits perfectly.' }
        ]
    },
    {
        id: '2',
        name: 'Arjun Photography',
        ownerName: 'Arjun',
        email: 'arjun@photo.com',
        phone: '+91 88888 88888',
        businessName: 'Arjun Photography',
        category: 'Photography',
        whatsapp: '+91 88888 88888',
        instagram: '@arjunphoto',
        location: 'Mumbai, Maharashtra',
        verified: true,
        stats: { views: 340, contacts: 55 },
        reviews: []
    }
];

const SEED_POSTS = [
    { id: '1', vendorId: '1', type: 'image', icon: '🧵', label: 'Photo', caption: 'Bridal Lehenga Set', price: '₹8,500', available: 'available' },
    { id: '2', vendorId: '1', type: 'image', icon: '📸', label: 'Photo', caption: 'Silk Blouse Embroidery', price: '₹1,200', available: 'available' },
    { id: '3', vendorId: '1', type: 'video', icon: '🎥', label: 'Video', caption: 'Stitching Process Reel', price: '₹600', available: 'available' },
    { id: '4', vendorId: '2', type: 'image', icon: '📸', label: 'Photo', caption: 'Wedding Shoot', price: '₹15,000', available: 'busy' }
];

const SEED_THREADS = [
    { id: '1', vendorId: '1', customerId: 'c1', name: 'Ananya S.', preview: 'Hi! I need a blouse in 3 days', time: '10:30 AM', unread: 2, initials: 'AS', color: '#4f46e5', resolved: false, messages: [{ id: 'm1', senderRole: 'customer', text: 'Hi! I need a blouse in 3 days', time: '10:30 AM', status: 'delivered' }] },
    { id: '2', vendorId: '1', customerId: 'c2', name: 'Rahul M.', preview: 'Yes, we do!', time: 'Yesterday', unread: 0, initials: 'RM', color: '#7c3aed', resolved: true, messages: [{ id: 'm2', senderRole: 'customer', text: 'Can you do embroidery work?', time: 'Yesterday', status: 'seen' }, { id: 'm3', senderRole: 'vendor', text: 'Yes, we do!', time: 'Yesterday', status: 'seen' }] }
];

const SEED_NOTIFS = [
    { id: '1', type: 'info', title: 'Welcome to SellSmart!', time: '1d ago', read: false },
    { id: '2', type: 'success', title: 'Profile Approved', time: '12h ago', read: false }
];

// ─── Provider Component ────────────────────────────────────────────────────────
export function AppDataProvider({ children }) {
    // ─── State ───
    const [currentUser, setCurrentUser] = useState(() => {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    });

    const [vendors, setVendors] = useState([]);

    const [posts, setPosts] = useState([]);

    const [threads, setThreads] = useState(() => {
        const stored = localStorage.getItem('threads');
        return stored ? JSON.parse(stored) : SEED_THREADS;
    });

    const [typingState, setTypingState] = useState({}); // { threadId: { vendor: true, customer: false } }

    const fetchThreads = async () => {
        try {
            const res = await fetch("http://localhost:5000/chat/threads", { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                const mappedThreads = await Promise.all(data.threads.map(async (t) => {
                    // Fetch messages for each thread to initialize
                    const mRes = await fetch(`http://localhost:5000/chat/messages/${t._id}`, { credentials: "include" });
                    const mData = await mRes.json();
                    return {
                        id: t._id,
                        name: t.name || t._id.substring(0, 8),
                        preview: t.lastMessage,
                        time: new Date(t.lastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        unread: 0,
                        messages: mData.messages?.map(m => ({
                            id: m._id,
                            senderRole: m.senderModel === 'User' ? 'customer' : 'vendor',
                            text: m.content,
                            time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            status: (m.senderModel === (currentUser.role === 'vendor' ? 'Vendor' : 'User')) ? 'delivered' : 'seen'
                        }))
                    };

                }));
                setThreads(mappedThreads);
            }
        } catch (e) {
            console.log("Fetch Threads Error:", e);
        }
    };

    const fetchVendors = async () => {
        try {
            const res = await fetch("http://localhost:5000/vendors");
            if (res.ok) {
                const data = await res.json();
                setVendors(data.vendors);
            }
        } catch (e) { console.log(e); }
    };

    // Socket connection
    useEffect(() => {
        if (currentUser) {
            fetchThreads();
            fetchVendors();
            socket.connect();


            socket.emit("authenticate", currentUser.id || currentUser._id);
            
            const handleMessage = (msg) => {
                setThreads(prev => {
                    const threadId = msg.sender === (currentUser.id || currentUser._id) ? msg.receiver : msg.sender;
                    const exists = prev.find(t => t.id === threadId);
                    
                    if (exists) {
                        return prev.map(t => t.id === threadId ? {
                            ...t,
                            messages: [...(t.messages || []), {
                                id: msg._id,
                                senderRole: msg.senderModel === 'User' ? 'customer' : 'vendor',
                                text: msg.content,
                                time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                status: 'delivered'
                            }],
                            preview: msg.content,
                            time: 'Just now',
                            unread: (msg.receiver === (currentUser.id || currentUser._id)) ? t.unread + 1 : t.unread
                        } : t);
                    } else {
                        // New thread - try to find name from global vendor list if applicable
                        let otherName = 'New Chat';
                        if (msg.senderModel === 'Vendor' || msg.receiverModel === 'Vendor') {
                            const v = vendors.find(vend => (vend.id || vend._id) === threadId);
                            if (v) otherName = v.BusinessName || v.FullName;
                        }

                        return [{
                            id: threadId,
                            name: otherName,
                            preview: msg.content,
                            time: 'Just now',
                            unread: (msg.receiver === (currentUser.id || currentUser._id)) ? 1 : 0,
                            messages: [{
                                id: msg._id,
                                senderRole: msg.senderModel === 'User' ? 'customer' : 'vendor',
                                text: msg.content,
                                time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                status: 'delivered'
                            }]
                        }, ...prev];
                    }

                });
            };

            socket.on("receive_message", handleMessage);
            socket.on("message_sent", handleMessage);

            return () => {
                socket.off("receive_message", handleMessage);
                socket.off("message_sent", handleMessage);
                socket.disconnect();
            }
        }
    }, [currentUser]);

    const [notifications, setNotifications] = useState([]);
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [vendorInsights, setVendorInsights] = useState(null);
    const [vendorRecommendations, setVendorRecommendations] = useState(null);



    // ─── Effects for Persistance ───
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    }, [currentUser]);

    const setAuth = (user, role) => {
        if (user) {
            const userData = { ...user, role: role || user.role };
            setCurrentUser(userData);
            localStorage.setItem('currentUser', JSON.stringify(userData));
        }
    };

    // Auto-check session on mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                // Try fetching user profile first
                const uRes = await fetch("http://localhost:5000/me", { credentials: "include" });
                if (uRes.ok) {
                    const uData = await uRes.json();
                    setAuth(uData.user, 'customer');
                    return;
                }

                // Try fetching vendor profile if user fails
                const vRes = await fetch("http://localhost:5000/vendor/me", { credentials: "include" });
                if (vRes.ok) {
                    const vData = await vRes.json();
                    setAuth(vData.vendor, 'vendor');
                }
            } catch (err) {
                console.log("Session recovery failed:", err);
            }
        };

        if (!currentUser) {
            checkSession();
        }
    }, []);

    const login = (email, password, role) => {
        // This is now just a fallback / helper. 
        // Real logic should use setAuth from Login components after successful fetch.
        return { success: true }; 
    };

    const register = (userData) => {
        const newUser = { ...userData, id: Date.now().toString(), stats: { views: 0, contacts: 0 }, reviews: [] };
        if (userData.role === 'vendor') {
            setVendors([...vendors, newUser]);
        }
        setCurrentUser({ ...newUser });
        return { success: true };
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.clear(); // Complete cleanup
        window.location.href = "/role-select";
    };

    // ─── Analytics Methods ───
    const fetchTrending = async () => {
        try {
            const res = await fetch("http://localhost:5000/analytics/trending", { credentials: "include" });
            const data = await res.json();
            if (data.success) setTrendingProducts(data.trending);
        } catch (e) { console.error("Fetch Trending Error:", e); }
    };

    const fetchInsights = async () => {
        if (!currentUser || currentUser.role !== 'vendor') return;
        try {
            const res = await fetch("http://localhost:5000/analytics/insights", { credentials: "include" });
            const data = await res.json();
            if (data.success) setVendorInsights(data.insights);
        } catch (e) { console.error("Fetch Insights Error:", e); }
    };

    const fetchRecommendations = async () => {
        if (!currentUser || currentUser.role !== 'vendor') return;
        try {
            const res = await fetch("http://localhost:5000/analytics/recommendations", { credentials: "include" });
            const data = await res.json();
            if (data.success) setVendorRecommendations(data.recommendation);
        } catch (e) { console.error("Fetch Recommendations Error:", e); }
    };


    // ─── Post Methods ───
    const addPost = (postData) => {
        if (!currentUser || currentUser.role !== 'vendor') return;
        const newPost = { ...postData, id: Date.now().toString(), vendorId: currentUser.id };
        setPosts([newPost, ...posts]);
    };

    const deletePost = (postId) => {
        setPosts(posts.filter(p => p.id !== postId));
    };

    const updatePost = (postId, updatedData) => {
        setPosts(posts.map(p => p.id === postId ? { ...p, ...updatedData } : p));
    };

    // ─── Profile / Settings Methods ───
    const updateVendorProfile = (vendorId, profileData) => {
        setVendors(vendors.map(v => v.id === vendorId ? { ...v, ...profileData } : v));
        if (currentUser?.id === vendorId) {
            setCurrentUser(prev => ({ ...prev, ...profileData }));
        }
    };

    // ─── Messaging Methods ───
    const formatTime = () => {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const generateBotResponse = (text) => {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('much') || lowerText.includes('₹')) {
            return "Our pricing depends on your specific needs. Please share more details so I can provide an accurate quote.";
        }
        if (lowerText.includes('time') || lowerText.includes('how long') || lowerText.includes('when') || lowerText.includes('days')) {
            return "Delivery generally takes 3-5 business days. When is your deadline?";
        }
        if (lowerText.includes('hello') || lowerText.includes('hi ') || lowerText === 'hi' || lowerText.includes('hey')) {
            return "Hello! Thanks for reaching out to us. How can we help you today?";
        }
        if (lowerText.includes('location') || lowerText.includes('where') || lowerText.includes('address')) {
            return "We are located at the address in our profile. Let us know if you need help finding us!";
        }
        if (lowerText.includes('custom') || lowerText.includes('design')) {
            return "We love custom requests! Please share some references of what you have in mind.";
        }
        if (lowerText.includes('urgent') || lowerText.includes('emergency')) {
            return "I have notified the business owner about your urgent request. They will reply as soon as possible!";
        }
        // AI Fallback removed as per user request
        return null;
    };

    const setTyping = (threadId, isTyping) => {
        setTypingState(prev => ({
            ...prev,
            [threadId]: isTyping
        }));
    };

    const sendMessage = (threadId, text, senderRole = 'vendor') => {
        if (!currentUser) return;
        
        socket.emit("send_message", {
            sender: currentUser.id || currentUser._id,
            senderModel: currentUser.role === 'vendor' ? 'Vendor' : 'User',
            receiver: threadId, // Assuming threadId is the ID of the other person
            receiverModel: currentUser.role === 'vendor' ? 'User' : 'Vendor',
            content: text
        });
    };


    const updateMessageStatus = (threadId, messageId, newStatus) => {
        setThreads(currentThreads => currentThreads.map(t => {
            if (t.id === threadId) {
                const updatedMessages = t.messages.map(m => m.id === messageId ? { ...m, status: newStatus } : m);
                return { ...t, messages: updatedMessages };
            }
            return t;
        }));
    };

    const editMessage = (threadId, messageId, newText) => {
        setThreads(currentThreads => currentThreads.map(t => {
            if (t.id === threadId) {
                const updatedMessages = t.messages.map(m => m.id === messageId ? { ...m, text: newText, edited: true } : m);
                return { ...t, messages: updatedMessages };
            }
            return t;
        }));
    };

    const markThreadRead = (threadId) => {
        setThreads(currentThreads => currentThreads.map(t => {
            if (t.id === threadId) {
                const updatedMessages = t.messages.map(m => m.senderRole !== currentUser?.role ? { ...m, status: 'seen' } : m);
                return { ...t, unread: 0, messages: updatedMessages };
            }
            return t;
        }));
    };

    const toggleThreadResolved = (threadId) => {
        setThreads(currentThreads => currentThreads.map(t => {
            if (t.id === threadId) {
                return { ...t, resolved: !t.resolved };
            }
            return t;
        }));
    };

    const createThread = (vendorId, customerId, customerName) => {
        const vendor = vendors.find(v => v.id === vendorId);
        const newThread = {
            id: Date.now().toString(),
            vendorId,
            customerId,
            name: customerName,
            vendorName: vendor?.businessName || 'Business',
            preview: 'Say hello!',
            time: formatTime(),
            unread: 0,
            initials: customerName.substring(0, 2).toUpperCase(),
            color: '#4f46e5',
            resolved: false,
            messages: []
        };
        setThreads([newThread, ...threads]);
        return newThread.id;
    };

    // ─── Context Value ───
    const value = {
        currentUser,
        vendors,
        posts,
        threads,
        notifications,
        typingState,
        login,
        register,
        logout,
        addPost,
        deletePost,
        updatePost,
        updateVendorProfile,
        sendMessage,
        editMessage,
        createThread,
        markThreadRead,
        toggleThreadResolved,
        setTyping,
        setAuth, 
        trendingProducts,
        vendorInsights,
        vendorRecommendations,
        fetchTrending,
        fetchInsights,
        fetchRecommendations,
        markNotificationsRead: () => setNotifications(notifications.map(n => ({ ...n, read: true })))
    };


    return (
        <AppDataContext.Provider value={value}>
            {children}
        </AppDataContext.Provider>
    );
}

export const useAppData = () => useContext(AppDataContext);
