// backend/routes/medicalRoutes.js
import express from 'express';
import {
  getMedical,
  createMedical,
  updateMedical,
  deleteMedical,
  getAllergies,
  addAllergy,
  deleteAllergy,
  getMedications,
  addMedication,
  deleteMedication,
  getMedicalNotes,
  addMedicalNote,
  deleteMedicalNote,
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

// Allergies sub-routes
router.get('/allergies', authMiddleware, getAllergies);
router.post('/allergies', authMiddleware, addAllergy);
router.delete('/allergies/:id', authMiddleware, deleteAllergy);

// Medications sub-routes
router.get('/medications', authMiddleware, getMedications);
router.post('/medications', authMiddleware, addMedication);
router.delete('/medications/:id', authMiddleware, deleteMedication);

// Notes sub-routes
router.get('/notes', authMiddleware, getMedicalNotes);
router.post('/notes', authMiddleware, addMedicalNote);
router.delete('/notes/:id', authMiddleware, deleteMedicalNote);

export default router;
