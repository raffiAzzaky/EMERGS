import * as userModel from '../models/userModel.js';
import { PanicLog } from '../models/panicLogSchema.js';
import pool from '../config/database.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ success: false, message: 'Failed to get users' });
  }
};

import bcrypt from 'bcrypt';

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existing = await userModel.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await userModel.createUser(name, email, hashedPassword, role || 'user');

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      userId,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Failed to create user' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    if (!name && !email && !role) {
      return res.status(400).json({ success: false, message: 'At least one field is required' });
    }

    const updates = {};
    if (name) updates.name = name;
    if (email) {
      const existing = await userModel.getUserByEmail(email);
      if (existing && existing.id !== parseInt(id)) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      updates.email = email;
    }
    if (role && ['user', 'admin'].includes(role)) updates.role = role;

    await userModel.updateUser(id, updates);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await userModel.deleteUser(id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

export const getAllPanicLogs = async (req, res) => {
  try {
    const { status, days } = req.query;

    let query = {};
    if (status) query.status = status;

    if (days) {
      const date = new Date();
      date.setDate(date.getDate() - parseInt(days));
      query.timestamp = { $gte: date };
    }

    const logs = await PanicLog.find(query).sort({ timestamp: -1 }).limit(100);

    res.status(200).json({
      success: true,
      panic_logs: logs,
    });
  } catch (error) {
    console.error('Error getting panic logs:', error);
    res.status(500).json({ success: false, message: 'Failed to get panic logs' });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    const totalUsers = users.length;

    const allPanics = await PanicLog.find();
    const totalPanics = allPanics.length;
    
    let respondedPanics = 0;
    let unhandledPanics = 0;
    allPanics.forEach(p => {
      if (p.status === 'responded' || p.status === 'resolved') respondedPanics++;
      if (p.status === 'active') unhandledPanics++;
    });

    const recentPanics = await PanicLog.find().sort({ timestamp: -1 }).limit(5);

    const [contactRows] = await pool.query('SELECT COUNT(*) as count FROM emergency_contacts');
    const totalContacts = contactRows[0].count;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalPanics,
        respondedPanics,
        unhandledPanics,
        recentPanics,
        totalContacts
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Failed to get dashboard stats' });
  }
};

import * as medicalModel from '../models/medicalModel.js';

export const getAllMedicalRecords = async (req, res) => {
  try {
    const records = await medicalModel.getAllMedicalRecords();
    res.status(200).json({
      success: true,
      medical_records: records,
    });
  } catch (error) {
    console.error('Error getting medical records:', error);
    res.status(500).json({ success: false, message: 'Failed to get medical records' });
  }
};

import { Notification } from '../models/notificationSchema.js';

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ timestamp: -1 });
    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error('Error getting all notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to get notifications' });
  }
};

import * as adminSettingsModel from '../models/adminSettingsModel.js';

export const getSettings = async (req, res) => {
  try {
    let settings = await adminSettingsModel.getSettings();
    if (!settings) {
      await adminSettingsModel.createAdminSettingsTable();
      settings = await adminSettingsModel.getSettings();
    }
    res.status(200).json({
      success: true,
      settings: {
        system_mode: settings.system_mode,
        notification_global: Boolean(settings.notification_global),
        panic_threshold: settings.panic_threshold,
      }
    });
  } catch (error) {
    console.error('Error getting admin settings:', error);
    res.status(500).json({ success: false, message: 'Failed to get admin settings' });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const allowedUpdates = ['system_mode', 'notification_global', 'panic_threshold'];
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });
    if (Object.keys(updates).length > 0) {
      await adminSettingsModel.updateSettings(updates);
    }
    const settings = await adminSettingsModel.getSettings();
    res.status(200).json({
      success: true,
      message: 'Admin settings updated successfully',
      settings: {
        system_mode: settings.system_mode,
        notification_global: Boolean(settings.notification_global),
        panic_threshold: settings.panic_threshold,
      }
    });
  } catch (error) {
    console.error('Error updating admin settings:', error);
    res.status(500).json({ success: false, message: 'Failed to update admin settings' });
  }
};
