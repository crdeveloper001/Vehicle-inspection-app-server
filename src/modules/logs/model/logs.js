import mongoose from "mongoose";

const apiLogSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    immutable: true,
    index: true,
  },
  requestId: {
    type: String,
    trim: true,
  },
  request: {
    method: {
      type: String,
      required: true,
      uppercase: true,
      enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
    endpoint: {
      type: String,
      required: true,
      trim: true,
    },
  },
  operation: {
    type: String,
    required: true,
    enum: ["create", "read", "update", "delete"],
    index: true,
  },
  resource: {
    type: String,
    trim: true,
  },
  resourceId: {
    type: String,
    trim: true,
  },
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  statusCode: {
    type: Number,
    min: 100,
    max: 599,
  },
  success: {
    type: Boolean,
    required: true,
  },
  durationMs: {
    type: Number,
    min: 0,
  },
  errorCode: {
    type: String,
    trim: true,
  },
});

export default mongoose.model("ApiLog", apiLogSchema);