import mongoose from "mongoose";
import { Entity } from "./models/entity.js";

const DEFAULT_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/spaceship_rpg";

/**
 * Call this once at startup before using any database functions.
 */
export async function initDatabase(uri = DEFAULT_URI) {
  if (mongoose.connection.readyState === 1) return; // already connected

  await mongoose.connect(uri);
  await Entity.syncIndexes();

  console.log("[DB] Connected to Mongo:", uri);
}
