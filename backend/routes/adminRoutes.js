import express from 'express';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllPanicLogs,
  getDashboardStats,
} from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/dashboard/stats', authMiddleware, requireAdmin, getDashboardStats);

router.get('/users', authMiddleware, requireAdmin, getAllUsers);

router.post(
  '/users',
  authMiddleware,
  requireAdmin,
  [
    body('name').trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  handleValidationErrors,
  createUser
);

router.put(
  '/users/:id',
  authMiddleware,
  requireAdmin,
  [
    body('name').optional().trim().notEmpty(),
    body('email').optional().isEmail(),
    body('role').optional().isIn(['user', 'admin']),
  ],
  handleValidationErrors,
  updateUser
);

router.delete('/users/:id', authMiddleware, requireAdmin, deleteUser);

router.get('/panic', authMiddleware, requireAdmin, getAllPanicLogs);

import { getAllMedicalRecords, getAllNotifications, getSettings, updateSettings } from '../controllers/adminController.js';
router.get('/medical', authMiddleware, requireAdmin, getAllMedicalRecords);

router.get('/notifications', authMiddleware, requireAdmin, getAllNotifications);

router.get('/config', authMiddleware, requireAdmin, getSettings);
router.put('/config', authMiddleware, requireAdmin, updateSettings);

export default router;
