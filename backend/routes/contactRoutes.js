// backend/routes/contactRoutes.js
import express from 'express';
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contactController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getContacts);

router.post(
  '/',
  authMiddleware,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
  ],
  handleValidationErrors,
  createContact
);

router.put(
  '/:id',
  authMiddleware,
  [
    body('name').optional().trim().notEmpty(),
    body('phone').optional().trim().notEmpty(),
  ],
  handleValidationErrors,
  updateContact
);

router.delete('/:id', authMiddleware, deleteContact);

export default router;
