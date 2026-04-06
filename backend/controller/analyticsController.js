import { Product } from "../model/productmodel.js";
import { Engagement } from "../model/engagementmodel.js";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { getCSVInsights, calculateEngagementScore } from "../utils/analyticsService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCRIPT_PATH = path.join(__dirname, "..", "..", "ml", "predict_recommendations.py");

/**
 * Endpoint: /analytics/trending
 * Returns: Top 10 products with highest current or predicted engagement. 
 */
export const getTrendingProducts = async (req, res) => {
    try {
        // 1. Fetch live products from MongoDB
        const allProducts = await Product.find({}).sort({ createdAt: -1 });

        if (allProducts.length === 0) {
            return res.status(200).json({ success: true, trending: [] });
        }

        // 1b. Fetch Hourly Pulse (Last 30 days) to educate the ML on the marketplace's "Golden Hours"
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const hourlyPulse = await Engagement.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            { 
                $group: {
                    _id: { $hour: "$createdAt" },
                    score: { 
                        $sum: { 
                            $cond: [{ $eq: ["$type", "comment"] }, 10, 
                            { $cond: [{ $eq: ["$type", "like"] }, 5, 1] }]
                        } 
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 2. Map MongoDB products to simple numerical format for ML engine
        const inputData = {
            current_products: allProducts.map(p => {
                const numericId = parseInt(p._id.toString().slice(-4), 16) % 10 + 1;
                return {
                    mongo_id: p._id.toString(),
                    product_id: numericId,
                    hour: new Date(p.createdAt).getHours(),
                    views: p.views || 0,
                    likes: (p.likes || []).length,
                    comments: (p.comments || []).length
                };
            }),
            hourly_pulse: hourlyPulse // Add the time-series context
        };

        // 3. Execute ML Engine (Python script) to get predictions
        const pythonProcess = spawn('python', [SCRIPT_PATH, '--json']);
        
        let stdout = '';
        let stderr = '';

        pythonProcess.stdout.on('data', (data) => stdout += data.toString());
        pythonProcess.stderr.on('data', (data) => stderr += data.toString());

        pythonProcess.on('close', async (code) => {
            if (code !== 0) {
                console.error("ML Process Error:", stderr);
                return res.status(500).json({ success: false, message: "ML analysis failed" });
            }

            try {
                const mlPredictions = JSON.parse(stdout);
                
                // Map ML predictions back to full MongoDB product objects
                const trending = mlPredictions.slice(0, 10).map(pred => {
                    // pred.product_id contains the original MongoDB ID (or numeric for historical)
                    const product = allProducts.find(p => p._id.toString() === pred.product_id.toString());
                    
                    if (!product) return null;

                    return {
                        ...product._doc,
                        engagement_potential: pred.engagement_potential,
                        rank: pred.rank
                    };
                }).filter(p => p !== null);

                res.status(200).json({ success: true, trending });

            } catch (err) {
                console.error("Parse Error:", err, stdout);
                res.status(500).json({ success: false, message: "Failed to parse ML results" });
            }
        });

        // Write live products to ML script for real-world contextual ranking
        pythonProcess.stdin.write(JSON.stringify(inputData));
        pythonProcess.stdin.end();

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Endpoint: /analytics/recommendations (Vendor Specific)
 * Returns: Insights on which categories are performing best based on CSV + Live trends.
 */
export const getVendorRecommendations = async (req, res) => {
    try {
        const vendorId = req.vendor._id.toString();

        // 1. Get vendor products (Using robust ID search)
        const vProducts = await Product.find({ 
            $or: [
                { vendorToken: req.vendor._id },
                { vendorToken: vendorId }
            ]
         });

        // 2. Get overall category intelligence from CSV simulate 
        const categoryTrends = await getCSVInsights();

        // 3. Get Live Golden Hour from Pulse
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const hourlyPulse = await Engagement.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            { 
                $group: {
                    _id: { $hour: "$createdAt" },
                    score: { 
                        $sum: { 
                            $cond: [{ $eq: ["$type", "comment"] }, 10, 
                            { $cond: [{ $eq: ["$type", "like"] }, 5, 1] }]
                        } 
                    }
                }
            },
            { $sort: { score: -1 } } // Find highest pulse hour
        ]);

        const goldenHour = hourlyPulse.length > 0 ? hourlyPulse[0]._id : 18;

        // 4. Logic: Find vendor's worst performing category vs global best performing
        const vendorCategories = [...new Set(vProducts.map(p => p.category))];
        const bestGlobalCategory = categoryTrends[0].category;

        let advice = "";
        let action = "Invest more in high-engagement categories.";

        if (!vendorCategories.includes(bestGlobalCategory)) {
            advice = `Consider expanding into the "${bestGlobalCategory}" niche. Globally, it has the highest engagement potential.`;
        } else {
            advice = `Your placement in "${bestGlobalCategory}" is good. Focus on higher-quality visual content inside this niche.`;
        }

        res.status(200).json({
            success: true,
            globalTrends: categoryTrends.slice(0, 3), 
            recommendation: {
                targetCategory: bestGlobalCategory,
                advice,
                action,
                golden_hour: goldenHour
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Endpoint: /analytics/insights (Vendor Specific)
 * Returns: Raw performance metrics across their inventory.
 */
export const getVendorInsights = async (req, res) => {
    try {
        const vendorIdString = req.vendor._id.toString();
        const products = await Product.find({ 
            $or: [
                { vendorToken: req.vendor._id },
                { vendorToken: vendorIdString }
            ]
        });

        const insights = products.reduce((acc, p) => {
            acc.totalViews += p.views || 0;
            acc.totalLikes += (p.likes || []).length;
            acc.totalComments += (p.comments || []).length;
            return acc;
        }, { totalViews: 0, totalLikes: 0, totalComments: 0, count: products.length });

        insights.engagementScore = calculateEngagementScore(
            insights.totalLikes,
            insights.totalComments,
            insights.totalViews
        );

        // Fetch Weekly Engagement Velocity (Last 7 Days)
        const startOfSevenDaysAgo = new Date();
        startOfSevenDaysAgo.setDate(startOfSevenDaysAgo.getDate() - 7);
        startOfSevenDaysAgo.setHours(0, 0, 0, 0);

        const vendorProductIds = products.map(p => p._id);
        
        const engagements = await Engagement.find({
            $or: [
                { vendorToken: req.vendor._id },
                { vendorToken: vendorIdString },
                { productId: { $in: vendorProductIds } }
            ],
            createdAt: { $gte: startOfSevenDaysAgo }
        });

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const velocity = [];
        
        // Populate exactly 7 days
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayName = days[d.getDay()];
            
            // Calculate engagement for this specific date
            const dayScore = engagements.reduce((acc, e) => {
                const eDate = new Date(e.createdAt);
                if (eDate.getDate() === d.getDate() && eDate.getMonth() === d.getMonth()) {
                    const weight = e.type === "view" ? 1 : e.type === "like" ? 5 : 10;
                    return acc + weight;
                }
                return acc;
            }, 0);

            velocity.push({
                day: dayName,
                engagement: dayScore || 0 // Default to 0 instead of blank
            });
        }

        res.status(200).json({ 
            success: true, 
            insights,
            velocity 
        });

    } catch (error) {
        console.error("Vendor Insights Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
