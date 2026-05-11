const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notificationController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken);

router.post('/', requireRole('ADMIN'), ctrl.createNotification);

router.get('/', ctrl.getNotifications);
router.patch('/:id/read', ctrl.markAsRead);
router.patch('/read-all', requireRole('ADMIN'), ctrl.markAllAsRead);

module.exports = router;