// client.js
import * as api from "./api.js";
import { io } from "socket.io-client";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const SOCKET_IO_ADDR = process.env.SOCKET_IO_ADDR || "http://localhost:3000";
const MAIN = process.env.MAIN || process.argv[2];
const token = process.argv[3]; // must be set to a valid session token from /login

let socket;

export async function loadMainScript() {
  // Get the function file from command line arguments
  if (!MAIN) {
    console.error("Usage: node client.js <path-to-step-module>");
    process.exit(1);
  }

  const mainURL = pathToFileURL(resolve(MAIN)).href;
  const { default: loop } = await import(mainURL);

  // --- ticking loop --- TODO: edit so that it runs based on the number of ops sent to server each loop
  setInterval(() => {
    Promise.resolve(loop(api)).catch((err) => {
      console.error("[STEP ERROR]", err);
    });
  }, api.TICK_DURATION_MS);
}

/**
 * Send an op to the server:
 * server expects: socket.on("op", async (functionName, args) => ...)
 *
 * @param {{id: string, op: string, args?: any[]}} payload
 */
function emitOp({ functionName, args }) {
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
}

function connectSocket() {
  socket = io(SOCKET_IO_ADDR, {
    transports: ["websocket"], // optional, but avoids long-polling weirdness
    auth: { token },
    autoConnect: true,
    reconnection: true,
  });
}

// --- socket.io connection ---
if (!token) {
  console.error("Missing TOKEN env var.");
  process.exit(1);
}

connectSocket();

// Helpful logs
socket.on("connect", () =>
  console.log("\x1b[32m%s\x1b[0m", "Connected to server.\n\n")
);
socket.on("connect_error", (err) =>
  console.error("Connect error:", err.message)
);
socket.on("disconnect", (reason) => console.log("Disconnected:", reason));
socket.on("program error", (msg) => console.error("Program error:", msg));

loadMainScript();

const client = { token, emitOp, socket };

export default client;
