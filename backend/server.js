import "dotenv/config";
import app from "./app.js";
import { connectdb } from "./Database/connection.js";

import http from "http";
import { initSocket } from "./socket.js";
import { loadCSVAnalytics } from "./utils/analyticsService.js";


// database connection (runs after dotenv has loaded .env)
connectdb();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Load Analytics CSV (Hybrid Cold-Start Data)
loadCSVAnalytics().catch(err => console.error("Failed to load CSV Analytics:", err));


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

