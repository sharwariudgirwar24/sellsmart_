import React from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    AreaChart, Area, Legend, Cell, PieChart, Pie
} from 'recharts';

/**
 * AnalyticsCharts - A beautiful visualization suite for vendor metrics.
 */
export default function AnalyticsCharts({ posts = [], insights = null }) {
    
    // 1. Prepare data for "Post Comparison" Chart
    const barData = posts.slice(0, 6).map(p => ({
        name: p.caption?.length > 10 ? p.caption.substring(0, 8) + '..' : p.caption,
        views: p.raw?.views || 0,
        likes: (p.raw?.likes || []).length,
        engagement: (p.raw?.views * 0.1 + (p.raw?.likes?.length || 0) * 3 + (p.raw?.comments?.length || 0) * 5).toFixed(1)
    }));

    // 2. Simulated Growth Trend (based on current totals) 
    // Usually would come from a per-day historical API
    const trendData = [
        { day: 'Mon', engagement: (insights?.engagementScore * 0.2).toFixed(1) },
        { day: 'Tue', engagement: (insights?.engagementScore * 0.35).toFixed(1) },
        { day: 'Wed', engagement: (insights?.engagementScore * 0.3).toFixed(1) },
        { day: 'Thu', engagement: (insights?.engagementScore * 0.6).toFixed(1) },
        { day: 'Fri', engagement: (insights?.engagementScore * 0.85).toFixed(1) },
        { day: 'Sat', engagement: (insights?.engagementScore * 0.9).toFixed(1) },
        { day: 'Sun', engagement: (insights?.engagementScore || 0).toFixed(1) },
    ];

    // 3. Category Distribution (Pie Chart)
    const categoryCounts = posts.reduce((acc, p) => {
        const cat = p.label || 'Other';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});
    
    const pieData = Object.keys(categoryCounts).map(cat => ({ 
        name: cat, 
        value: categoryCounts[cat] 
    }));

    const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

    if (posts.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
                No engagement data to visualize yet. <br/>
                Once you post products and users interact, charts will appear here.
            </div>
        );
    }

    return (
        <div className="analytics-grid" style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            
            {/* ─── POST PERFORMANCE ─── */}
            <div className="chart-card" style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ marginBottom: '15px', color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>
                    <i className="fa-solid fa-chart-simple" style={{ marginRight: '8px', color: 'var(--indigo-lt)' }}></i>
                    Post Reach vs. Likes
                </div>
                <div style={{ width: '100%', height: '220px' }}>
                    <ResponsiveContainer>
                        <BarChart data={barData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} tick={{ fill: '#888' }} />
                            <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{ fill: '#888' }} />
                            <Tooltip 
                                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend verticalAlign="top" height={36} iconType="circle" />
                            <Bar name="Views" dataKey="views" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            <Bar name="Likes" dataKey="likes" fill="#ec4899" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ─── ENGAGEMENT TREND ─── */}
            <div className="chart-card" style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ marginBottom: '15px', color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>
                    <i className="fa-solid fa-bolt" style={{ marginRight: '8px', color: '#f59e0b' }}></i>
                    Engagement Velocity (Weekly)
                </div>
                <div style={{ width: '100%', height: '220px' }}>
                    <ResponsiveContainer>
                        <AreaChart data={trendData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={10} tick={{ fill: '#888' }} />
                            <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{ fill: '#888' }} />
                            <Tooltip 
                                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="engagement" stroke="#f59e0b" fillOpacity={1} fill="url(#colorEngage)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ─── CATEGORY SPLIT ─── */}
            {pieData.length > 1 && (
                <div className="chart-card" style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', gridColumn: '1 / -1' }}>
                    <div style={{ marginBottom: '15px', color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>
                        <i className="fa-solid fa-pie-chart" style={{ marginRight: '8px', color: '#10b981' }}></i>
                        Portfolio Distribution by Category
                    </div>
                    <div style={{ width: '100%', height: '180px', display: 'flex', alignItems: 'center' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend layout="vertical" align="right" verticalAlign="middle" />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ flex: 1, paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {pieData.map((p, i) => (
                                <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{p.name}</span>
                                    <strong style={{ color: '#fff' }}>{((p.value / posts.length) * 100).toFixed(0)}%</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
