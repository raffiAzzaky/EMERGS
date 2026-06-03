// backend/models/panicLogSchema.js
import pool from '../config/database.js';

export const createPanicLogsTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS panic_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        panic_type VARCHAR(50) DEFAULT 'emergency',
        status VARCHAR(50) DEFAULT 'active',
        description TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await pool.query(query);
  } catch (error) {
    console.error('Error creating panic_logs table:', error);
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
    if (this.filter.timestamp && this.filter.timestamp.$gte) {
      conditions.push('timestamp >= ?');
      values.push(this.filter.timestamp.$gte);
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
      location: {
        latitude: r.latitude ? Number(r.latitude) : null,
        longitude: r.longitude ? Number(r.longitude) : null
      },
      panic_type: r.panic_type,
      status: r.status,
      description: r.description,
      timestamp: r.timestamp
    }));
  }

  // Allow awaiting the query directly
  then(onfulfilled, onrejected) {
    return this.exec().then(onfulfilled, onrejected);
  }
}

class PanicLogInstance {
  constructor(data) {
    this.user_id = data.user_id;
    this.latitude = data.location?.latitude || null;
    this.longitude = data.location?.longitude || null;
    this.panic_type = data.panic_type || 'emergency';
    this.status = data.status || 'active';
    this.description = data.description || '';
  }

  async save() {
    const query = `
      INSERT INTO panic_logs (user_id, latitude, longitude, panic_type, status, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      this.user_id,
      this.latitude,
      this.longitude,
      this.panic_type,
      this.status,
      this.description
    ]);
    this.id = result.insertId;
    this._id = result.insertId;
    this.timestamp = new Date();
    return this;
  }
}

export function PanicLog(data) {
  return new PanicLogInstance(data);
}

Object.assign(PanicLog, {
  find(filter = {}) {
    return new MongoQueryMock('panic_logs', filter);
  },

  async findByIdAndUpdate(id, updateObj, options = {}) {
    const fields = [];
    const values = [];
    if (updateObj.status !== undefined) {
      fields.push('status = ?');
      values.push(updateObj.status);
    }
    if (fields.length === 0) return null;
    values.push(id);
    await pool.query(`UPDATE panic_logs SET ${fields.join(', ')} WHERE id = ?`, values);
    const [rows] = await pool.query('SELECT * FROM panic_logs WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      _id: r.id,
      id: r.id,
      user_id: r.user_id,
      location: {
        latitude: r.latitude ? Number(r.latitude) : null,
        longitude: r.longitude ? Number(r.longitude) : null
      },
      panic_type: r.panic_type,
      status: r.status,
      description: r.description,
      timestamp: r.timestamp
    };
  }
});

export default PanicLog;
