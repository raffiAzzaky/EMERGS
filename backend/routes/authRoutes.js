// backend/routes/authRoutes.js
import express from 'express';
import { register, login } from '../controllers/authController.js';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  handleValidationErrors,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  handleValidationErrors,
  login
);

export default router;
