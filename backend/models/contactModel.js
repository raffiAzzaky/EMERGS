// backend/models/contactModel.js
import pool from '../config/database.js';

export const createContactTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS emergency_contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        relationship VARCHAR(100),
        priority VARCHAR(50) DEFAULT 'Biasa',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await pool.query(query);

    await pool.query("ALTER TABLE emergency_contacts ADD COLUMN IF NOT EXISTS relationship VARCHAR(100)");
    await pool.query("ALTER TABLE emergency_contacts ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'Biasa'");
  } catch (error) {
    console.error('Error creating emergency_contacts table:', error);
  }
};

export const getContactsByUser = async (userId) => {
  try {
    const [rows] = await pool.query('SELECT * FROM emergency_contacts WHERE user_id = ?', [userId]);
    return rows;
  } catch (error) {
    console.error('Error getting contacts:', error);
    throw error;
  }
};

export const createContact = async (userId, name, phone, relationship = null, priority = 'Biasa') => {
  try {
    const [result] = await pool.query(
      'INSERT INTO emergency_contacts (user_id, name, phone, relationship, priority) VALUES (?, ?, ?, ?, ?)',
      [userId, name, phone, relationship, priority]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
};

export const updateContact = async (id, userId, updates) => {
  try {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    values.push(id);
    values.push(userId);

    const query = `UPDATE emergency_contacts SET ${fields.map(f => `${f} = ?`).join(', ')} WHERE id = ? AND user_id = ?`;
    const [result] = await pool.query(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
};

export const deleteContact = async (id, userId) => {
  try {
    const [result] = await pool.query('DELETE FROM emergency_contacts WHERE id = ? AND user_id = ?', [id, userId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
};
