import mongoose from "mongoose";

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

export const Session = mongoose.model("Session", sessionSchema);
