import mongoose from "mongoose";
import bcrypt from "bcrypt";

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

// ---------------------------------------
// Entity schema & model
// ---------------------------------------
const entitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "SS Driftwood"
    classification: { type: String, required: true }, // e.g. "ship", "planet", "station"
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Unique per owner:
entitySchema.index({ owner: 1, name: 1 }, { unique: true });

//---------------------------------------
// Session model
//---------------------------------------
const sessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    entityId: { type: mongoose.Schema.Types.ObjectId, ref: "Entity" },
    token: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now, expires: "2h" }, // session expires after 2 hours
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//---------------------------------------
// User model
//---------------------------------------
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    entities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Entity" }],
    password: { type: String, required: true }, // store hashed passwords
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// ---------------------------------------
// Export models
// ---------------------------------------
export const Session = mongoose.model("Session", sessionSchema);
export const Entity = mongoose.model("Entity", entitySchema);
export const User = mongoose.model("User", userSchema);
