import { Product } from "../model/productmodel.js";
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

        // 2. Map MongoDB products to simple numerical format for ML engine
        const inputData = allProducts.map(p => {
            // Product mapping logic: ensure we map IDs consistently to a numeric range (1-10) for ML
            const numericId = parseInt(p._id.toString().slice(-4), 16) % 10 + 1;
            
            return {
                mongo_id: p._id.toString(),
                product_id: numericId,
                hour: new Date(p.createdAt).getHours(),
                views: p.views || 0,
                likes: (p.likes || []).length,
                comments: (p.comments || []).length
            };
        });

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
                    const product = allProducts.find(p => p._id.toString() === pred.product_id);
                    return {
                        ...product?._doc,
                        engagement_potential: pred.engagement_potential,
                        rank: pred.rank
                    };
                }).filter(p => p._id);

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
        const vendorId = req.vendor.id;

        // 1. Get vendor products 
        const vProducts = await Product.find({ vendorToken: vendorId });

        // 2. Get overall category intelligence from CSV simulate 
        const categoryTrends = await getCSVInsights();

        // 3. Logic: Find vendor's worst performing category vs global best performing
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
                action
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
        const vendorId = req.vendor.id;
        const products = await Product.find({ vendorToken: vendorId });

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

        res.status(200).json({ success: true, insights });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
