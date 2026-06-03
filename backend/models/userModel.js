// backend/models/userModel.js
import pool from '../config/database.js';

export const createUserTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        nik VARCHAR(32),
        ttl VARCHAR(255),
        alamat TEXT,
        jenis_kelamin VARCHAR(50),
        phone VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);

    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS nik VARCHAR(32)");
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS ttl VARCHAR(255)");
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS alamat TEXT");
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS jenis_kelamin VARCHAR(50)");
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50)");

    const profilesQuery = `
      CREATE TABLE IF NOT EXISTS profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNIQUE NOT NULL,
        phone VARCHAR(50),
        birth_date VARCHAR(255),
        address TEXT,
        gender VARCHAR(50),
        nik VARCHAR(32),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await pool.query(profilesQuery);

    const settingsQuery = `
      CREATE TABLE IF NOT EXISTS user_settings (
        user_id INT PRIMARY KEY,
        theme VARCHAR(50) DEFAULT 'light',
        email_notifications BOOLEAN DEFAULT TRUE,
        push_notifications BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await pool.query(settingsQuery);
  } catch (error) {
    console.error('Error creating users table:', error);
  }
};

export const getUser = async (id) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.*, p.phone as profile_phone, p.birth_date, p.address, p.gender, p.nik as profile_nik
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = ?
    `, [id]);
    if (rows.length === 0) return null;
    const user = rows[0];
    return {
      ...user,
      nik: user.profile_nik || user.nik || '',
      phone: user.profile_phone || user.phone || '',
      ttl: user.birth_date || user.ttl || '',
      alamat: user.address || user.alamat || '',
      jenis_kelamin: user.gender || user.jenis_kelamin || ''
    };
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.*, p.phone as profile_phone, p.birth_date, p.address, p.gender, p.nik as profile_nik
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.email = ?
    `, [email]);
    if (rows.length === 0) return null;
    const user = rows[0];
    return {
      ...user,
      nik: user.profile_nik || user.nik || '',
      phone: user.profile_phone || user.phone || '',
      ttl: user.birth_date || user.ttl || '',
      alamat: user.address || user.alamat || '',
      jenis_kelamin: user.gender || user.jenis_kelamin || ''
    };
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

export const createUser = async (name, email, password, role = 'user') => {
  try {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
    );
    const userId = result.insertId;
    
    // Auto-create profile & settings records
    await pool.query('INSERT INTO profiles (user_id) VALUES (?)', [userId]);
    await pool.query('INSERT INTO user_settings (user_id) VALUES (?)', [userId]);
    
    return userId;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT u.id, u.name, u.email, u.role, u.created_at, 
             p.phone, p.birth_date, p.address, p.gender, p.nik
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
    `);
    return rows;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

export const updateUser = async (id, updates) => {
  try {
    const userFields = ['name', 'email', 'password', 'role', 'nik', 'ttl', 'alamat', 'jenis_kelamin', 'phone'];
    
    const userUpdates = {};
    const profileUpdates = {};

    for (const key of Object.keys(updates)) {
      if (userFields.includes(key)) {
        userUpdates[key] = updates[key];
      }
      
      let profileKey = null;
      if (key === 'phone' || key === 'noHp') profileKey = 'phone';
      if (key === 'ttl') profileKey = 'birth_date';
      if (key === 'alamat') profileKey = 'address';
      if (key === 'jenis_kelamin' || key === 'jenisKelamin') profileKey = 'gender';
      if (key === 'nik') profileKey = 'nik';

      if (profileKey) {
        profileUpdates[profileKey] = updates[key];
      }
    }

    if (Object.keys(userUpdates).length > 0) {
      const fields = Object.keys(userUpdates);
      const values = Object.values(userUpdates);
      values.push(id);
      const query = `UPDATE users SET ${fields.map((f) => `${f} = ?`).join(', ')} WHERE id = ?`;
      await pool.query(query, values);
    }

    if (Object.keys(profileUpdates).length > 0) {
      const fields = Object.keys(profileUpdates);
      const values = Object.values(profileUpdates);
      values.push(id);
      const query = `UPDATE profiles SET ${fields.map((f) => `${f} = ?`).join(', ')} WHERE user_id = ?`;
      await pool.query(query, values);
    }

    return true;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const getUserSettings = async (id) => {
  try {
    const [rows] = await pool.query('SELECT * FROM user_settings WHERE user_id = ?', [id]);
    if (rows.length === 0) {
      await pool.query('INSERT INTO user_settings (user_id) VALUES (?)', [id]);
      return { user_id: id, theme: 'light', email_notifications: 1, push_notifications: 1 };
    }
    return rows[0];
  } catch (error) {
    console.error('Error getting user settings:', error);
    throw error;
  }
};

export const updateUserSettings = async (id, updates) => {
  try {
    const fields = Object.keys(updates);
    if (fields.length === 0) return false;
    const values = Object.values(updates);
    values.push(id);
    const query = `UPDATE user_settings SET ${fields.map((f) => `${f} = ?`).join(', ')} WHERE user_id = ?`;
    const [result] = await pool.query(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};
