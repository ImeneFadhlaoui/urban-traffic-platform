const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const ctrl = require('../controllers/trafficController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken);

const zoneRules = [
  body('name').notEmpty().withMessage('Nom requis'),
  body('centerLat').isFloat().withMessage('Latitude invalide'),
  body('centerLng').isFloat().withMessage('Longitude invalide')
];

router.post('/', requireRole('ADMIN'), zoneRules, ctrl.createZone);
router.get('/', ctrl.getZones);
router.get('/congested', ctrl.getCongestedZones);
router.get('/:id', ctrl.getZone);
router.put('/:id/density', ctrl.updateDensity);
router.post('/simulate', ctrl.simulateDensity);

module.exports = router;