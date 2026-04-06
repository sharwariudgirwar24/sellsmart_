import { exec, spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { Product } from "../model/productmodel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Controller to handle ML recommendations
 */
export const getRecommendations = async (req, res) => {
    try {
        const scriptPath = path.join(__dirname, "..", "..", "ml", "predict_recommendations.py");
        
        // 1. Fetch current products from database
        const allProducts = await Product.find({});
        
        // 2. Map products to numerical features for the ML model
        // Cold start strategy: We pass ALL products, even those with 0 likes/views.
        const productInputs = allProducts.map(p => {
            // Simple mapping: MongoDB _id to a consistent numerical ID for the model
            // If the model expects product_id 1-10, we can wrap or hash
            const numericId = parseInt(p._id.toString().slice(-4), 16) % 100 + 1; 
            
            return {
                mongo_id: p._id.toString(),
                product_id: numericId,
                hour: new Date(p.createdAt || Date.now()).getHours(),
                views: p.views || 0,
                likes: (p.likes || []).length,
                comments: (p.comments || []).length
            };
        });

        // 3. Execute the python script and pipe data to stdin
        const pythonProcess = spawn('python', [scriptPath, '--json']);
        
        let stdout = '';
        let stderr = '';

        pythonProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error("ML Process error code:", code, stderr);
                return res.status(500).json({ success: false, message: "ML script failed" });
            }

            try {
                const recommendations = JSON.parse(stdout);
                res.status(200).json({ success: true, recommendations });
            } catch (err) {
                console.error("Parse error:", err, stdout);
                res.status(500).json({ success: false, message: "Failed to parse ML output" });
            }
        });

        // Send the current inventory to Python via stdin
        const inputData = {
            current_products: productInputs
        };
        pythonProcess.stdin.write(JSON.stringify(inputData));
        pythonProcess.stdin.end();

    } catch (error) {
        console.error("Recommendation Controller Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
