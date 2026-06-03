import express from 'express';
import { getProfile, updateProfile, getSettings, updateSettings } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/me', authMiddleware, getProfile);

router.put(
  '/me',
  authMiddleware,
  [
    body('name').optional().trim().notEmpty(),
    body('email').optional().isEmail(),
  ],
  handleValidationErrors,
  updateProfile
);

router.get('/settings', authMiddleware, getSettings);
router.put('/settings', authMiddleware, updateSettings);

export default router;
