// backend/controllers/userController.js
import * as userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import * as contactModel from '../models/contactModel.js';
import * as medicalModel from '../models/medicalModel.js';
import pool from '../config/database.js';

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

export const getOnboardingStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.getUser(userId);
    const contacts = await contactModel.getContactsByUser(userId);
    const medical = await medicalModel.getMedicalRecord(userId);

    const hasName = !!user?.name;
    const hasTtl = !!user?.ttl;
    const hasAlamat = !!user?.alamat;
    const hasPhone = !!user?.phone;
    const hasContact = contacts && contacts.length > 0;
    const hasBloodType = !!medical?.blood_type;
    const hasAllergies = !!medical?.allergies;
    const hasDiseaseHistory = !!medical?.disease_history;

    const completed = hasName && hasTtl && hasAlamat && hasPhone && hasContact && hasBloodType && hasAllergies && hasDiseaseHistory;

    res.status(200).json({
      success: true,
      completed: !!completed,
      details: {
        hasName,
        hasTtl,
        hasAlamat,
        hasPhone,
        hasContact,
        hasBloodType,
        hasAllergies,
        hasDiseaseHistory,
      }
    });
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    res.status(500).json({ success: false, message: 'Failed to check onboarding status' });
  }
};

export const saveOnboarding = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      name, 
      ttl, 
      alamat, 
      phone, 
      blood_type, 
      allergies, 
      disease_history, 
      contact_name, 
      contact_phone, 
      contact_relationship 
    } = req.body;

    if (!name || !ttl || !alamat || !phone || !blood_type || !allergies || !disease_history || !contact_name || !contact_phone) {
      return res.status(400).json({ success: false, message: 'Semua data wajib harus diisi' });
    }

    // 1. Update user profile
    await userModel.updateUser(userId, {
      name,
      ttl,
      alamat,
      phone
    });

    // 2. Save emergency contact
    const contacts = await contactModel.getContactsByUser(userId);
    if (contacts.length === 0) {
      await contactModel.createContact(userId, contact_name, contact_phone, contact_relationship || 'Keluarga', 'Darurat');
    } else {
      await contactModel.updateContact(contacts[0].id, userId, {
        name: contact_name,
        phone: contact_phone,
        relationship: contact_relationship || 'Keluarga',
        priority: 'Darurat'
      });
    }

    // 3. Save medical record
    const medical = await medicalModel.getMedicalRecord(userId);
    if (!medical) {
      await medicalModel.createMedicalRecord(userId, blood_type, allergies, disease_history);
    } else {
      await medicalModel.updateMedicalRecord(userId, {
        blood_type,
        allergies,
        disease_history
      });
    }

    // 4. Also synchronize the initial allergy in the allergies table
    await pool.query('DELETE FROM allergies WHERE user_id = ?', [userId]);
    const allergyItems = allergies.split(',').map(item => item.trim()).filter(item => item.length > 0);
    for (const item of allergyItems) {
      await pool.query('INSERT INTO allergies (user_id, allergy_name) VALUES (?, ?)', [userId, item]);
    }

    res.status(200).json({
      success: true,
      message: 'Onboarding data saved successfully'
    });
  } catch (error) {
    console.error('Error saving onboarding:', error);
    res.status(500).json({ success: false, message: 'Failed to save onboarding data' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Password lama dan password baru wajib diisi' });
    }

    const user = await userModel.getUser(req.user.id);
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Password lama salah' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.updateUser(req.user.id, { password: hashedPassword });

    res.status(200).json({ success: true, message: 'Password berhasil diubah' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ success: false, message: 'Gagal mengubah password' });
  }
};
