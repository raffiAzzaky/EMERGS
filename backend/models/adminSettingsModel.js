// backend/models/adminSettingsModel.js
import pool from '../config/database.js';

export const createAdminSettingsTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS admin_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        system_mode VARCHAR(50) DEFAULT 'normal',
        notification_global BOOLEAN DEFAULT true,
        panic_threshold INT DEFAULT 5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);

    // Seed default settings if empty
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM admin_settings');
    if (rows[0].count === 0) {
      await pool.query('INSERT INTO admin_settings (system_mode) VALUES ("normal")');
    }
  } catch (error) {
    console.error('Error creating admin_settings table:', error);
  }
};

export const getSettings = async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM admin_settings LIMIT 1');
    return rows[0];
  } catch (error) {
    console.error('Error getting admin settings:', error);
    throw error;
  }
};

export const updateSettings = async (updates) => {
  try {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) return true;

    const query = `UPDATE admin_settings SET ${fields.map(f => `${f} = ?`).join(', ')} LIMIT 1`;
    const [result] = await pool.query(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating admin settings:', error);
    throw error;
  }
};
