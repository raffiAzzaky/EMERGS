// backend/routes/medicalRoutes.js
import express from 'express';
import {
  getMedical,
  createMedical,
  updateMedical,
  deleteMedical,
} from '../controllers/medicalController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getMedical);

router.post(
  '/',
  authMiddleware,
  [
    body('blood_type').optional().trim().isString(),
    body('allergies').optional().trim().isString(),
    body('disease_history').optional().trim().isString(),
  ],
  handleValidationErrors,
  createMedical
);

router.put(
  '/',
  authMiddleware,
  [
    body('blood_type').optional().trim().isString(),
    body('allergies').optional().trim().isString(),
    body('disease_history').optional().trim().isString(),
  ],
  handleValidationErrors,
  updateMedical
);

router.delete('/', authMiddleware, deleteMedical);

export default router;
