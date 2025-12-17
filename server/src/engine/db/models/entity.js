import mongoose from "mongoose";

const development = process.env.NODE_ENV === "development";

const entitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "SS Driftwood"
    classification: { type: String, required: true }, // e.g. "ship", "planet", "station"
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Entity" }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    memory: { type: mongoose.Schema.Types.Mixed, default: {} }, // Flexible field for storing arbitrary data, accessible in dev scripts
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strict: !development,
  }
);

// Unique per owner:
entitySchema.index({ owner: 1, name: 1 }, { unique: true });

export const Entity = mongoose.model("Entity", entitySchema);
