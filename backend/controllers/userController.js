// backend/controllers/userController.js
import * as userModel from '../models/userModel.js';

export const getProfile = async (req, res) => {
  try {
    const user = await userModel.getUser(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      nik: user.nik || '',
      ttl: user.ttl || '',
      alamat: user.alamat || '',
      jenisKelamin: user.jenis_kelamin || '',
      noHp: user.phone || '',
      createdAt: user.created_at,
    };

    res.status(200).json({
      success: true,
      user: profile,
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ success: false, message: 'Failed to get profile' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, nik, ttl, alamat, jenisKelamin, noHp } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (email) {
      const existingUser = await userModel.getUserByEmail(email);
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      updates.email = email;
    }
    if (nik !== undefined) updates.nik = nik;
    if (ttl !== undefined) updates.ttl = ttl;
    if (alamat !== undefined) updates.alamat = alamat;
    if (jenisKelamin !== undefined) updates.jenis_kelamin = jenisKelamin;
    if (noHp !== undefined) updates.phone = noHp;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'At least one field is required' });
    }

    const success = await userModel.updateUser(req.user.id, updates);
    if (!success) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updatedUser = await userModel.getUser(req.user.id);
    const profile = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      nik: updatedUser.nik || '',
      ttl: updatedUser.ttl || '',
      alamat: updatedUser.alamat || '',
      jenisKelamin: updatedUser.jenis_kelamin || '',
      noHp: updatedUser.phone || '',
      createdAt: updatedUser.created_at,
    };

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: profile,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

export const getSettings = async (req, res) => {
  try {
    const settings = await userModel.getUserSettings(req.user.id);
    res.status(200).json({ success: true, settings });
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({ success: false, message: 'Failed to get settings' });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { theme, email_notifications, push_notifications } = req.body;
    const updates = {};
    if (theme !== undefined) updates.theme = theme;
    if (email_notifications !== undefined) updates.email_notifications = email_notifications ? 1 : 0;
    if (push_notifications !== undefined) updates.push_notifications = push_notifications ? 1 : 0;

    // ensure it exists
    await userModel.getUserSettings(req.user.id);

    const success = await userModel.updateUserSettings(req.user.id, updates);
    const settings = await userModel.getUserSettings(req.user.id);

    res.status(200).json({ success: true, message: 'Settings updated', settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
};
