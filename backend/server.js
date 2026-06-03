// backend/server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createDatabaseIfMissing } from './config/database.js';
import { connectMongoDB } from './config/mongodb.js';
import { createUserTable } from './models/userModel.js';
import { createContactTable } from './models/contactModel.js';
import { createMedicalTable } from './models/medicalModel.js';
import { createAdminSettingsTable } from './models/adminSettingsModel.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import medicalRoutes from './routes/medicalRoutes.js';
import panicRoutes from './routes/panicRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Initialize MongoDB
connectMongoDB();

// Initialize MySQL Tables
const initializeTables = async () => {
  try {
    await createDatabaseIfMissing();
    await createUserTable();
    await createContactTable();
    await createMedicalTable();
    await createAdminSettingsTable();
    console.log('Database tables initialized');
  } catch (error) {
    console.error('Error initializing tables:', error.message);
  }
};

initializeTables();

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EMERGs server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/panic', panicRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`EMERGs server running on port ${PORT}`);
});
