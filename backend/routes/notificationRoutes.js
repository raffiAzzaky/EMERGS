// backend/routes/notificationRoutes.js
import express from 'express';
import { getNotifications, markAsRead, deleteNotification, markAllAsRead } from '../controllers/notificationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getNotifications);
router.put('/read-all', authMiddleware, markAllAsRead);
router.put('/:id/read', authMiddleware, markAsRead);
router.delete('/:id', authMiddleware, deleteNotification);

export default router;
