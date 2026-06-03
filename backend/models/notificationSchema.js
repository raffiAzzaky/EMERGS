// backend/models/notificationSchema.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: Number,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      default: 'Notification'
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['unread', 'read'],
      default: 'unread',
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    type: {
      type: String,
      enum: ['info', 'order', 'warning', 'contact', 'panic', 'alert'],
      default: 'info',
    },
  },
  { collection: 'notifications' }
);

export const Notification = mongoose.model('Notification', notificationSchema);
