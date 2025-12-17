import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from "./core.js";
import { Entity, Session, User } from "./db/models/index.js";
import { randomBytes } from "crypto";

const sessions = new Map();

async function syncSessions() {
  const allSessions = await Session.find({});

  allSessions.forEach((session) => {
    sessions.set(session.token, session);
  });
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  const session = sessions.get(token);

  if (!session) return next(new Error("Invalid token"));

  if (session.expiresAt < new Date()) {
    sessions.delete(token);
    return next(new Error("Token expired"));
  }

  socket.session = session;
  socket.userId = session.userId;
  socket.entityId = session.entityId;

  next();
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "SpaceshipCoder Server" });
});

app.get("/health", (req, res) => {
  res.status(200).send();
});

app.post("/login", async (req, res) => {
  // Validate credentials and entityName
  const { username, password, entityName } = req.body;

  console.log(`Logging in entity: ${entityName}`);

  const user = await User.findOne({ username });
  if (!user || !user.comparePassword(password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const entity = await Entity.findOne({ owner: user, name: entityName });

  if (!entity) {
    return res.status(401).json({
      error: `Choose a valid entity name: \n${user.entities.map((e) => e.name + "\n")}\n\nEx.: usage: body: { <username>, <password>, <entityName> }`,
    });
  }

  // Generate token in a secure way:
  const token = randomBytes(16).toString("hex");

  // Store session in DB
  const session = new Session({
    userId: user._id,
    token,
    entityId: entity._id,
  });

  await session.save();
  await syncSessions();

  res.json({ token, message: "Login successful" });
});

// Socket.IO events
io.on("connection", async (socket) => {
  const entity = await Entity.findById(socket.entityId);

  socket.on("disconnect", () => {
    console.log(`Entity disconnected: ${entity.name}`);
  });

  socket.on("op", async (functionName, args, ack) => {
    try {
      const result = await engine.pushOp(socket.entityId, functionName, args);
      ack({ ok: true, result });
    } catch (error) {
      ack({ ok: false, error: error.message });
    }
  });
});

// Start server
export async function startServer() {
  return await new Promise((resolve) => {
    httpServer.listen(PORT, async () => {
      console.log(`Server running on port ${PORT}`);
      resolve();
    });
  });
}
