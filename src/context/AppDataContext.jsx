import { createContext, useContext, useState, useEffect } from 'react';

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

    const [vendors, setVendors] = useState(() => {
        const stored = localStorage.getItem('vendors');
        return stored ? JSON.parse(stored) : SEED_VENDORS;
    });

    const [posts, setPosts] = useState(() => {
        const stored = localStorage.getItem('posts');
        return stored ? JSON.parse(stored) : SEED_POSTS;
    });

    const [threads, setThreads] = useState(() => {
        const stored = localStorage.getItem('threads');
        return stored ? JSON.parse(stored) : SEED_THREADS;
    });

    const [typingState, setTypingState] = useState({}); // { threadId: { vendor: true, customer: false } }

    const [notifications, setNotifications] = useState(() => {
        const stored = localStorage.getItem('notifications');
        return stored ? JSON.parse(stored) : SEED_NOTIFS;
    });

    // ─── Effects for Persistance ───
    useEffect(() => localStorage.setItem('currentUser', JSON.stringify(currentUser)), [currentUser]);
    useEffect(() => localStorage.setItem('vendors', JSON.stringify(vendors)), [vendors]);
    useEffect(() => localStorage.setItem('posts', JSON.stringify(posts)), [posts]);
    useEffect(() => localStorage.setItem('threads', JSON.stringify(threads)), [threads]);
    useEffect(() => localStorage.setItem('notifications', JSON.stringify(notifications)), [notifications]);

    // ─── Auth Methods ───
    const login = (email, password, role) => {
        let user;
        if (role === 'vendor') {
            user = vendors.find(v => v.email === email);
        } else {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                if (parsed.email === email && parsed.role === 'customer') {
                    user = parsed;
                }
            }
        }

        if (user) {
            setCurrentUser({ ...user, role });
            return { success: true };
        }

        const newUser = { id: Date.now().toString(), email, role, name: email.split('@')[0] };
        if (role === 'vendor') setVendors([...vendors, newUser]);
        setCurrentUser(newUser);
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
        localStorage.removeItem('currentUser');
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
        const messageId = Date.now().toString();
        const timeStr = formatTime();

        setThreads(threads.map(t => {
            if (t.id === threadId) {
                const msg = { id: messageId, senderRole, text, time: timeStr, status: 'sent' };
                // Simulate status upgrade to delivered
                setTimeout(() => updateMessageStatus(threadId, messageId, 'delivered'), 800);
                return { ...t, messages: [...t.messages, msg], preview: text, time: timeStr };
            }
            return t;
        }));

        // Mock Chatbot Response for Customers
        if (senderRole === 'customer') {
            const botText = generateBotResponse(text);
            if (botText) {
                setTyping(threadId, true);
                setTimeout(() => {
                    setThreads(currentThreads => currentThreads.map(t => {
                        if (t.id === threadId) {
                            const botMsg = { id: (Date.now() + 1).toString(), senderRole: 'vendor', text: botText, time: formatTime(), status: 'delivered' };

                            // If it's urgent, trigger a notification for the business
                            if (botText.includes('notified the business owner')) {
                                setNotifications(prev => [{ id: Date.now().toString(), type: 'info', title: `New inquiry from ${t.name}`, time: 'Just now', read: false }, ...prev]);
                            }

                            return { ...t, messages: [...t.messages, botMsg], preview: botText, time: formatTime(), unread: t.unread + 1 };
                        }
                        return t;
                    }));
                    setTyping(threadId, false);
                }, 2500); // 2.5-second delay to show "typing..."
            }
        }
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
        markNotificationsRead: () => setNotifications(notifications.map(n => ({ ...n, read: true })))
    };

    return (
        <AppDataContext.Provider value={value}>
            {children}
        </AppDataContext.Provider>
    );
}

export const useAppData = () => useContext(AppDataContext);
