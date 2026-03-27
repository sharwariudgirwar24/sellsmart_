import "dotenv/config";
import app from "./app.js";
import { connectdb } from "./Database/connection.js";

import http from "http";
import { initSocket } from "./socket.js";

// database connection (runs after dotenv has loaded .env)
connectdb();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

