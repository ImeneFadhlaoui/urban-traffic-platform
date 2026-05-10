const { validationResult } = require('express-validator');
const Vehicle = require('../models/Vehicle');
const GpsPosition = require('../models/GpsPosition');
const { Op } = require('sequelize');

exports.addVehicle = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { plate, type, brand, model } = req.body;

    const existing = await Vehicle.findOne({ where: { plate } });
    if (existing) return res.status(409).json({ message: 'Plaque déjà enregistrée' });

    const vehicle = await Vehicle.create({
      plate: plate.toUpperCase(),
      type,
      brand,
      model,
      createdBy: req.user.id 
    });

    res.status(201).json({ message: 'Véhicule ajouté', vehicle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({ total: vehicles.length, vehicles });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id, {
      include: [{
        model: GpsPosition,
        as: 'positions',
        limit: 5,  
        order: [['recordedAt', 'DESC']]
      }]
    });
    if (!vehicle) return res.status(404).json({ message: 'Véhicule non trouvé' });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Simule la réception d'une position GPS en temps réel
exports.recordPosition = async (req, res) => {
  try {
    const { latitude, longitude, speed } = req.body;
    const vehicleId = req.params.id;

    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) return res.status(404).json({ message: 'Véhicule non trouvé' });

    // Enregistre dans l'historique
    const position = await GpsPosition.create({ vehicleId, latitude, longitude, speed });

    // Met à jour la position actuelle du véhicule
    await vehicle.update({ currentLat: latitude, currentLng: longitude });

    res.status(201).json({ message: 'Position enregistrée', position });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─── HISTORIQUE DES DÉPLACEMENTS ─────────────────────────────
exports.getHistory = async (req, res) => {
  try {
    const { from, to } = req.query;  // filtres optionnels par date

    const where = { vehicleId: req.params.id };

    // Si des dates sont fournies, filtre par période
    if (from && to) {
      where.recordedAt = { [Op.between]: [new Date(from), new Date(to)] };
    }

    const positions = await GpsPosition.findAll({
      where,
      order: [['recordedAt', 'DESC']],
      limit: 100  
    });

    res.json({ total: positions.length, positions });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─── SIMULER DES POSITIONS GPS ALÉATOIRES ────────────────────
// Utile pour les tests — génère 10 positions autour de Tunis
exports.simulatePositions = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Véhicule non trouvé' });

    // Centre de Tunis
    const baseLat = 36.8065;
    const baseLng = 10.1815;

    const positions = [];
    for (let i = 0; i < 10; i++) {
      // Petite variation aléatoire autour du centre
      const lat = baseLat + (Math.random() - 0.5) * 0.05;
      const lng = baseLng + (Math.random() - 0.5) * 0.05;
      const speed = Math.floor(Math.random() * 80) + 10; // 10-90 km/h

      const pos = await GpsPosition.create({
        vehicleId: vehicle.id,
        latitude: lat,
        longitude: lng,
        speed,
        recordedAt: new Date(Date.now() - i * 5 * 60000) // toutes les 5 min
      });
      positions.push(pos);
    }

    await vehicle.update({
      currentLat: positions[0].latitude,
      currentLng: positions[0].longitude
    });

    res.json({ message: '10 positions simulées', positions });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};