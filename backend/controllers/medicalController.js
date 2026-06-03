// backend/controllers/medicalController.js
import * as medicalModel from '../models/medicalModel.js';
import pool from '../config/database.js';

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

    // Sync to allergies table
    if (allergies) {
      await pool.query('DELETE FROM allergies WHERE user_id = ?', [req.user.id]);
      const allergyItems = allergies.split(',').map(item => item.trim()).filter(item => item.length > 0);
      for (const item of allergyItems) {
        await pool.query('INSERT INTO allergies (user_id, allergy_name) VALUES (?, ?)', [req.user.id, item]);
      }
    }

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

    // Sync to allergies table
    if (allergies !== undefined) {
      await pool.query('DELETE FROM allergies WHERE user_id = ?', [req.user.id]);
      const allergyItems = allergies.split(',').map(item => item.trim()).filter(item => item.length > 0);
      for (const item of allergyItems) {
        await pool.query('INSERT INTO allergies (user_id, allergy_name) VALUES (?, ?)', [req.user.id, item]);
      }
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

export const getAllergies = async (req, res) => {
  try {
    const list = await medicalModel.getAllergies(req.user.id);
    res.json({ success: true, allergies: list });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to get allergies' });
  }
};

export const addAllergy = async (req, res) => {
  try {
    const { name, severity, notes } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
    const id = await medicalModel.addAllergy(req.user.id, name, severity || 'Mild', notes || '');
    
    // Sync back to medical_records
    const list = await medicalModel.getAllergies(req.user.id);
    const combined = list.map(a => a.allergy_name).join(', ');
    await medicalModel.updateMedicalRecord(req.user.id, { allergies: combined });

    res.json({ success: true, message: 'Allergy added', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to add allergy' });
  }
};

export const deleteAllergy = async (req, res) => {
  try {
    const { id } = req.params;
    await medicalModel.deleteAllergy(id, req.user.id);
    
    // Sync back to medical_records
    const list = await medicalModel.getAllergies(req.user.id);
    const combined = list.map(a => a.allergy_name).join(', ');
    await medicalModel.updateMedicalRecord(req.user.id, { allergies: combined });

    res.json({ success: true, message: 'Allergy deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to delete allergy' });
  }
};

export const getMedications = async (req, res) => {
  try {
    const list = await medicalModel.getMedications(req.user.id);
    res.json({ success: true, medications: list });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to get medications' });
  }
};

export const addMedication = async (req, res) => {
  try {
    const { name, dosage, frequency, notes } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
    const id = await medicalModel.addMedication(req.user.id, name, dosage || '', frequency || '', notes || '');
    res.json({ success: true, message: 'Medication added', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to add medication' });
  }
};

export const deleteMedication = async (req, res) => {
  try {
    const { id } = req.params;
    await medicalModel.deleteMedication(id, req.user.id);
    res.json({ success: true, message: 'Medication deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to delete medication' });
  }
};

export const getMedicalNotes = async (req, res) => {
  try {
    const list = await medicalModel.getMedicalNotes(req.user.id);
    res.json({ success: true, notes: list });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to get medical notes' });
  }
};

export const addMedicalNote = async (req, res) => {
  try {
    const { note } = req.body;
    if (!note) return res.status(400).json({ success: false, message: 'Note is required' });
    const id = await medicalModel.addMedicalNote(req.user.id, note);
    res.json({ success: true, message: 'Note added', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to add note' });
  }
};

export const deleteMedicalNote = async (req, res) => {
  try {
    const { id } = req.params;
    await medicalModel.deleteMedicalNote(id, req.user.id);
    res.json({ success: true, message: 'Note deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to delete note' });
  }
};
