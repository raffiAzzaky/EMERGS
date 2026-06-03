// backend/models/panicLogSchema.js
import mongoose from 'mongoose';

const panicLogSchema = new mongoose.Schema(
  {
    user_id: {
      type: Number,
      required: true,
      index: true,
    },
    location: {
      latitude: Number,
      longitude: Number,
    },
    panic_type: {
      type: String,
      enum: ['emergency', 'medical', 'danger', 'other'],
      default: 'emergency',
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'responded'],
      default: 'active',
    },
    description: String,
  },
  { collection: 'panic_logs' }
);

export const PanicLog = mongoose.model('PanicLog', panicLogSchema);
