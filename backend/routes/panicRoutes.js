// backend/routes/panicRoutes.js
import express from 'express';
import { triggerPanic, getPanicHistory, updatePanicStatus } from '../controllers/panicController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  [
    body('panic_type').optional().isIn(['emergency', 'medical', 'danger', 'other']),
    body('location').optional().isObject(),
  ],
  handleValidationErrors,
  triggerPanic
);

router.get('/history', authMiddleware, getPanicHistory);

router.put(
  '/:id',
  authMiddleware,
  requireAdmin,
  [body('status').isIn(['active', 'resolved', 'responded'])],
  handleValidationErrors,
  updatePanicStatus
);

export default router;
