// backend/controllers/contactController.js
import * as contactModel from '../models/contactModel.js';

export const getContacts = async (req, res) => {
  try {
    const contacts = await contactModel.getContactsByUser(req.user.id);
    res.status(200).json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.error('Error getting contacts:', error);
    res.status(500).json({ success: false, message: 'Failed to get contacts' });
  }
};

export const createContact = async (req, res) => {
  try {
    const { name, phone, relationship, priority } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required' });
    }

    const contactId = await contactModel.createContact(
      req.user.id,
      name,
      phone,
      relationship || null,
      priority || 'Biasa'
    );

    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      contact: { id: contactId, user_id: req.user.id, name, phone, relationship, priority: priority || 'Biasa' },
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ success: false, message: 'Failed to create contact' });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;

    if (!name && !phone) {
      return res.status(400).json({ success: false, message: 'At least one field is required' });
    }

    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;

    const success = await contactModel.updateContact(id, req.user.id, updates);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ success: false, message: 'Failed to update contact' });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const success = await contactModel.deleteContact(id, req.user.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ success: false, message: 'Failed to delete contact' });
  }
};
