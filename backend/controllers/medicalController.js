// backend/controllers/medicalController.js
import * as medicalModel from '../models/medicalModel.js';

export const getMedical = async (req, res) => {
  try {
    const record = await medicalModel.getMedicalRecord(req.user.id);

    if (!record) {
      return res.status(404).json({ success: false, message: 'Medical record not found' });
    }

    res.status(200).json({
      success: true,
      medical: record,
    });
  } catch (error) {
    console.error('Error getting medical record:', error);
    res.status(500).json({ success: false, message: 'Failed to get medical record' });
  }
};

export const createMedical = async (req, res) => {
  try {
    const { blood_type, allergies, disease_history } = req.body;

    const existing = await medicalModel.getMedicalRecord(req.user.id);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Medical record already exists. Use PUT to update.' });
    }

    const recordId = await medicalModel.createMedicalRecord(
      req.user.id,
      blood_type,
      allergies,
      disease_history
    );

    res.status(201).json({
      success: true,
      message: 'Medical record created successfully',
      medical: {
        id: recordId,
        user_id: req.user.id,
        blood_type,
        allergies,
        disease_history,
      },
    });
  } catch (error) {
    console.error('Error creating medical record:', error);
    res.status(500).json({ success: false, message: 'Failed to create medical record' });
  }
};

export const updateMedical = async (req, res) => {
  try {
    const { blood_type, allergies, disease_history } = req.body;

    const updates = {};
    if (blood_type !== undefined) updates.blood_type = blood_type;
    if (allergies !== undefined) updates.allergies = allergies;
    if (disease_history !== undefined) updates.disease_history = disease_history;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'At least one field is required' });
    }

    const success = await medicalModel.updateMedicalRecord(req.user.id, updates);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Medical record not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Medical record updated successfully',
    });
  } catch (error) {
    console.error('Error updating medical record:', error);
    res.status(500).json({ success: false, message: 'Failed to update medical record' });
  }
};

export const deleteMedical = async (req, res) => {
  try {
    await medicalModel.deleteMedicalRecord(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Medical record deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting medical record:', error);
    res.status(500).json({ success: false, message: 'Failed to delete medical record' });
  }
};
