// backend/models/notificationSchema.js
import pool from '../config/database.js';

export const createNotificationsTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL DEFAULT 'Notification',
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'unread',
        type VARCHAR(50) DEFAULT 'info',
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await pool.query(query);
  } catch (error) {
    console.error('Error creating notifications table:', error);
  }
};

class MongoQueryMock {
  constructor(tableName, filter = {}) {
    this.tableName = tableName;
    this.filter = filter;
    this.sortObj = null;
    this.limitVal = null;
  }

  sort(sortObj) {
    this.sortObj = sortObj;
    return this;
  }

  limit(limitVal) {
    this.limitVal = limitVal;
    return this;
  }

  async exec() {
    let sql = `SELECT * FROM ${this.tableName}`;
    const conditions = [];
    const values = [];

    // Parse filters
    if (this.filter.user_id !== undefined) {
      conditions.push('user_id = ?');
      values.push(this.filter.user_id);
    }
    if (this.filter.status !== undefined) {
      conditions.push('status = ?');
      values.push(this.filter.status);
    }
    if (this.filter.type !== undefined) {
      conditions.push('type = ?');
      values.push(this.filter.type);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    if (this.sortObj) {
      const field = Object.keys(this.sortObj)[0];
      const dir = this.sortObj[field] === -1 ? 'DESC' : 'ASC';
      sql += ` ORDER BY ${field} ${dir}`;
    } else {
      sql += ` ORDER BY timestamp DESC`;
    }

    if (this.limitVal !== null) {
      sql += ` LIMIT ${parseInt(this.limitVal)}`;
    }

    const [rows] = await pool.query(sql, values);
    return rows.map(r => ({
      _id: r.id,
      id: r.id,
      user_id: r.user_id,
      title: r.title,
      message: r.message,
      status: r.status,
      type: r.type,
      timestamp: r.timestamp
    }));
  }

  then(onfulfilled, onrejected) {
    return this.exec().then(onfulfilled, onrejected);
  }
}

class NotificationInstance {
  constructor(data) {
    this.user_id = data.user_id;
    this.title = data.title || 'Notification';
    this.message = data.message || '';
    this.type = data.type || 'info';
    this.status = data.status || 'unread';
  }

  async save() {
    const query = `
      INSERT INTO notifications (user_id, title, message, type, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      this.user_id,
      this.title,
      this.message,
      this.type,
      this.status
    ]);
    this.id = result.insertId;
    this._id = result.insertId;
    this.timestamp = new Date();
    return this;
  }
}

export function Notification(data) {
  return new NotificationInstance(data);
}

Object.assign(Notification, {
  find(filter = {}) {
    return new MongoQueryMock('notifications', filter);
  },

  async findByIdAndUpdate(id, updateObj, options = {}) {
    const fields = [];
    const values = [];
    
    // Support update object structure like { status: 'read' } or { $set: { status: 'read' } }
    const setObj = updateObj.$set || updateObj;
    if (setObj.status !== undefined) {
      fields.push('status = ?');
      values.push(setObj.status);
    }
    
    if (fields.length === 0) return null;
    values.push(id);
    await pool.query(`UPDATE notifications SET ${fields.join(', ')} WHERE id = ?`, values);
    const [rows] = await pool.query('SELECT * FROM notifications WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      _id: r.id,
      id: r.id,
      user_id: r.user_id,
      title: r.title,
      message: r.message,
      status: r.status,
      type: r.type,
      timestamp: r.timestamp
    };
  },

  async findByIdAndDelete(id) {
    const [rows] = await pool.query('SELECT * FROM notifications WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    await pool.query('DELETE FROM notifications WHERE id = ?', [id]);
    const r = rows[0];
    return {
      _id: r.id,
      id: r.id,
      user_id: r.user_id,
      title: r.title,
      message: r.message,
      status: r.status,
      type: r.type,
      timestamp: r.timestamp
    };
  },

  async updateMany(filter, updateObj) {
    let sql = 'UPDATE notifications SET';
    const fields = [];
    const values = [];

    const setObj = updateObj.$set || updateObj;
    if (setObj.status !== undefined) {
      fields.push('status = ?');
      values.push(setObj.status);
    }

    if (fields.length === 0) return { modifiedCount: 0 };
    sql += ' ' + fields.join(', ');

    const conditions = [];
    if (filter.user_id !== undefined) {
      conditions.push('user_id = ?');
      values.push(filter.user_id);
    }
    if (filter.status !== undefined) {
      conditions.push('status = ?');
      values.push(filter.status);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    const [result] = await pool.query(sql, values);
    return { modifiedCount: result.affectedRows };
  }
});

export default Notification;
