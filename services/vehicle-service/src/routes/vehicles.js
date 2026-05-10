const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const ctrl = require('../controllers/vehicleController');
const { verifyToken, requireRole } = require('../middleware/auth');

// Toutes les routes nécessitent d'être connecté
router.use(verifyToken);

const vehicleRules = [
  body('plate').notEmpty().withMessage('Plaque requise'),
  body('type').isIn(['CAR', 'TRUCK', 'BUS', 'MOTORCYCLE']).withMessage('Type invalide'),
  body('brand').notEmpty().withMessage('Marque requise'),
  body('model').notEmpty().withMessage('Modèle requis')
];

// Seul un ADMIN peut ajouter un véhicule
router.post('/', requireRole('ADMIN'), vehicleRules, ctrl.addVehicle);

// Tout le monde peut consulter
router.get('/', ctrl.getVehicles);
router.get('/:id', ctrl.getVehicle);
router.get('/:id/history', ctrl.getHistory);

// Enregistrer/simuler une position
router.post('/:id/position', ctrl.recordPosition);
router.post('/:id/simulate', ctrl.simulatePositions);

module.exports = router;