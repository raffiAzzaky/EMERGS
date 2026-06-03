// backend/controllers/panicController.js
import { PanicLog } from '../models/panicLogSchema.js';
import { Notification } from '../models/notificationSchema.js';

export const triggerPanic = async (req, res) => {
  try {
    const { location, panic_type, description } = req.body;

    const panicLog = new PanicLog({
      user_id: req.user.id,
      location: location || {},
      panic_type: panic_type || 'emergency',
      description: description || '',
      status: 'active',
    });

    await panicLog.save();

    // Create notification for admin
    const notification = new Notification({
      user_id: req.user.id,
      title: 'Panic Alert',
      message: `Emergency alert from ${req.user.email}`,
      type: 'panic',
      status: 'unread',
    });
    await notification.save();

    res.status(201).json({
      success: true,
      message: 'Panic alert triggered successfully',
      panic: panicLog,
    });
  } catch (error) {
    console.error('Error triggering panic:', error);
    res.status(500).json({ success: false, message: 'Failed to trigger panic alert' });
  }
};

export const getPanicHistory = async (req, res) => {
  try {
    const logs = await PanicLog.find({ user_id: req.user.id }).sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      panic_logs: logs,
    });
  } catch (error) {
    console.error('Error getting panic history:', error);
    res.status(500).json({ success: false, message: 'Failed to get panic history' });
  }
};

export const updatePanicStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'resolved', 'responded'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const result = await PanicLog.findByIdAndUpdate(id, { status }, { new: true });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Panic log not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Panic status updated',
      panic: result,
    });
  } catch (error) {
    console.error('Error updating panic status:', error);
    res.status(500).json({ success: false, message: 'Failed to update panic status' });
  }
};
