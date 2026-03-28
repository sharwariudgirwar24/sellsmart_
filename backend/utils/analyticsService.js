import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to CSV
const CSV_PATH = path.join(__dirname, "..", "..", "data", "sellsmart_dataset.csv");

let csvData = [];

/**
 * Load CSV data into memory for lookup.
 * This satisfies the "Cold Start" requirement using pre-collected data.
 */
export const loadCSVAnalytics = () => {
    return new Promise((resolve, reject) => {
        const results = [];
        if (!fs.existsSync(CSV_PATH)) {
            console.warn("Analytics CSV not found, proceeding with empty data.");
            return resolve([]);
        }

        fs.createReadStream(CSV_PATH)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => {
                csvData = results;
                console.log(`Loaded ${csvData.length} records from analytics CSV.`);
                resolve(csvData);
            })
            .on("error", (err) => reject(err));
    });
};

/**
 * Calculate Engagement Score using weighted formula:
 * (views * 0.1) + (likes * 3) + (comments * 5)
 */
export const calculateEngagementScore = (likes = 0, comments = 0, views = 0) => {
    return (views * 0.1) + (likes * 3) + (comments * 5);
};

/**
 * Get aggregated data from CSV by Category simulation.
 * Mapping logic: Since CSV doesn't have categories, we map product_ids 1-10 to common categories used in the app.
 */
export const getCSVInsights = async () => {
    if (csvData.length === 0) await loadCSVAnalytics();
    
    // Simulate Category Mapping for the CSV data
    const categoryMap = {
        '1': 'Electronics', '2': 'Fashion', '3': 'Home', '4': 'Food', '5': 'Beauty',
        '6': 'Electronics', '7': 'Fashion', '8': 'Home', '9': 'Food', '10': 'Beauty'
    };

    const categoryStats = {};

    csvData.forEach(row => {
        const cat = categoryMap[row.product_id] || 'General';
        if (!categoryStats[cat]) {
            categoryStats[cat] = { views: 0, likes: 0, comments: 0, count: 0 };
        }
        categoryStats[cat].views += parseInt(row.views || 0);
        categoryStats[cat].likes += parseInt(row.likes || 0);
        categoryStats[cat].comments += parseInt(row.comments || 0);
        categoryStats[cat].count += 1;
    });

    // Compute average engagement score per category
    return Object.keys(categoryStats).map(cat => ({
        category: cat,
        avgEngagement: calculateEngagementScore(
            categoryStats[cat].likes / categoryStats[cat].count,
            categoryStats[cat].comments / categoryStats[cat].count,
            categoryStats[cat].views / categoryStats[cat].count
        ),
        totalEngagement: calculateEngagementScore(
            categoryStats[cat].likes,
            categoryStats[cat].comments,
            categoryStats[cat].views
        )
    })).sort((a, b) => b.avgEngagement - a.avgEngagement);
};
