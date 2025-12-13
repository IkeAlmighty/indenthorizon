// client.js
import * as api from "./functions.js";
import { io } from "socket.io-client";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const SOCKET_IO_ADDR = process.env.SOCKET_IO_ADDR || "http://localhost:3000";
const MAIN = process.env.MAIN || process.argv[2];

// Get the function file from command line arguments
if (!MAIN) {
  console.error("Usage: node client.js <path-to-step-module>");
  process.exit(1);
}

const stepUrl = pathToFileURL(resolve(MAIN)).href;
const { default: step } = await import(stepUrl);

// --- socket.io connection ---
const token = process.argv[3]; // must be set to a valid session token from /login
if (!token) {
  console.error(
    "Missing TOKEN env var. Example: TOKEN=abc123 node client.js ./myStep.js"
  );
  process.exit(1);
}

console.log(`creating a connection with token: START ${token} END`);

const socket = io(SOCKET_IO_ADDR, {
  transports: ["websocket"], // optional, but avoids long-polling weirdness
  auth: { token },
  autoConnect: true,
  reconnection: true,
});

// Helpful logs
socket.on("connect", () => console.log("Connected:", socket.id));
socket.on("connect_error", (err) =>
  console.error("Connect error:", err.message)
);
socket.on("disconnect", (reason) => console.log("Disconnected:", reason));
socket.on("program error", (msg) => console.error("Program error:", msg));

const client = {
  token,

  /**
   * Send an op to the server:
   * server expects: socket.on("op", async (functionName, args) => ...)
   *
   * @param {{id: string, op: string, args?: any[]}} payload
   */
  emitOp({ functionName, args }) {
    if (!socket.connected) {
      return Promise.reject(new Error("Socket not connected"));
    }

    return new Promise((resolve, reject) => {
      socket.emit("op", functionName, args, (response) => {
        if (!response) {
          reject(new Error("No response from server"));
        } else if (response.ok) {
          resolve(response.result);
        } else {
          reject(new Error(response.error || "Unknown op error"));
        }
      });
    });
  },

  socket,
};

export default client;

// --- ticking loop ---
setInterval(() => {
  Promise.resolve(step(api)).catch((err) => {
    console.error("[STEP ERROR]", err);
  });
}, api.TICK_DURATION_MS);
