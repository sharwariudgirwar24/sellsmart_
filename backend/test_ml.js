import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scriptPath = path.join(__dirname, "..", "ml", "predict_recommendations.py");

const pythonProcess = spawn('python', [scriptPath, '--json'], {env: process.env});
let stdout = '';
let stderr = '';

pythonProcess.stdout.on('data', (d) => stdout += d.toString());
pythonProcess.stderr.on('data', (d) => stderr += d.toString());

pythonProcess.on('close', (code) => {
    console.log("Code:", code);
    console.log("Stdout:", stdout);
    console.log("Stderr:", stderr);
});
const mockInput = {
    current_products: [
        { mongo_id: "test", product_id: 1, hour: 12, views: 0, likes: 0, comments: 0 }
    ]
};
pythonProcess.stdin.write(JSON.stringify(mockInput));
pythonProcess.stdin.end();
