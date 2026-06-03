// backend/controllers/notificationController.js
import { Notification } from '../models/notificationSchema.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user.id })
      .sort({ timestamp: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to get notifications' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Notification.findByIdAndUpdate(
      id,
      { status: 'read' },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({
      success: true,
      notification: result,
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, message: 'Failed to mark notification as read' });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Notification.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ success: false, message: 'Failed to delete notification' });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user_id: req.user.id, status: 'unread' },
      { $set: { status: 'read' } }
    );
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ success: false, message: 'Failed to mark all as read' });
  }
};
