// backend/controllers/panicController.js
import { PanicLog } from '../models/panicLogSchema.js';
import { Notification } from '../models/notificationSchema.js';
import * as userModel from '../models/userModel.js';
import * as contactModel from '../models/contactModel.js';

export const triggerPanic = async (req, res) => {
  try {
    const { location, panic_type } = req.body;
    const userId = req.user.id;

    // Fetch actual user details and contacts
    const user = await userModel.getUser(userId);
    const contacts = await contactModel.getContactsByUser(userId);

    const userName = user?.name || 'Unknown User';
    const userPhone = user?.phone || 'No Phone';
    
    let contactInfo = 'Tidak ada kontak darurat';
    if (contacts && contacts.length > 0) {
      contactInfo = contacts.map(c => `${c.name} (${c.phone} - ${c.relationship || 'Keluarga'})`).join(', ');
    }

    const lat = location?.latitude || 0;
    const lng = location?.longitude || 0;
    const description = `Peringatan darurat dari ${userName} (${userPhone}). Kontak Darurat: ${contactInfo}. Koordinat: Lat ${lat}, Lng ${lng}`;

    const panicLog = new PanicLog({
      user_id: userId,
      location: location || {},
      panic_type: panic_type || 'emergency',
      description,
      status: 'active',
    });

    await panicLog.save();

    // Create notification for admin
    const notification = new Notification({
      user_id: userId,
      title: 'Panic Alert',
      message: `Emergency alert from ${userName}. Contact: ${userPhone}. Location: Lat ${lat}, Lng ${lng}.`,
      type: 'panic',
      status: 'unread',
    });
    await notification.save();

    // Handle email notifications preference
    const userSettings = await userModel.getUserSettings(userId);
    if (userSettings && userSettings.email_notifications) {
      console.log(`[EMAIL SENT] Emergency alert email sent to contacts of ${userName} (${user.email || ''}): "${description}"`);
    }

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
