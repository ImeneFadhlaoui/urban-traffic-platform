const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const ctrl = require('../controllers/incidentController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken);

const incidentRules = [
  body('title').notEmpty().withMessage('Titre requis'),
  body('type')
    .isIn(['ACCIDENT', 'TRAVAUX', 'ROUTE_FERMEE', 'EMBOUTEILLAGE'])
    .withMessage('Type invalide')
];

router.post('/', incidentRules, ctrl.createIncident);
router.get('/', ctrl.getIncidents);
router.get('/stats', ctrl.getStats);
router.get('/:id', ctrl.getIncident);

router.patch('/:id/status', requireRole('ADMIN'), ctrl.updateStatus);

module.exports = router;