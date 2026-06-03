// backend/models/medicalModel.js
import pool from '../config/database.js';

export const createMedicalTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS medical_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        blood_type VARCHAR(10),
        allergies TEXT,
        disease_history TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_id (user_id)
      )
    `;
    await pool.query(query);
  } catch (error) {
    console.error('Error creating medical_records table:', error);
  }
};

export const getMedicalRecord = async (userId) => {
  try {
    const [rows] = await pool.query('SELECT * FROM medical_records WHERE user_id = ?', [userId]);
    return rows[0];
  } catch (error) {
    console.error('Error getting medical record:', error);
    throw error;
  }
};

export const createMedicalRecord = async (userId, bloodType, allergies, diseaseHistory) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO medical_records (user_id, blood_type, allergies, disease_history) VALUES (?, ?, ?, ?)',
      [userId, bloodType, allergies, diseaseHistory]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error creating medical record:', error);
    throw error;
  }
};

export const updateMedicalRecord = async (userId, updates) => {
  try {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    values.push(userId);

    const query = `UPDATE medical_records SET ${fields.map(f => `${f} = ?`).join(', ')} WHERE user_id = ?`;
    const [result] = await pool.query(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating medical record:', error);
    throw error;
  }
};

export const deleteMedicalRecord = async (userId) => {
  try {
    await pool.query('DELETE FROM medical_records WHERE user_id = ?', [userId]);
    return true;
  } catch (error) {
    console.error('Error deleting medical record:', error);
    throw error;
  }
};

export const getAllMedicalRecords = async () => {
  try {
    const query = `
      SELECT m.*, u.name 
      FROM medical_records m
      JOIN users u ON m.user_id = u.id
    `;
    const [rows] = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error getting all medical records:', error);
    throw error;
  }
};
