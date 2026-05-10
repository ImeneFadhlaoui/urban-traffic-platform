const { validationResult } = require('express-validator');
const Zone = require('../models/Zone');

const getDensityLevel = (count) => {
  if (count < 10) return 'FAIBLE';
  if (count <= 30) return 'MOYEN';
  return 'ÉLEVÉ';
};

exports.createZone = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, centerLat, centerLng, radius } = req.body;
    const zone = await Zone.create({ name, centerLat, centerLng, radius });
    res.status(201).json({ message: 'Zone créée', zone });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getZones = async (req, res) => {
  try {
    const zones = await Zone.findAll({ where: { isActive: true } });
    res.json({ total: zones.length, zones });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getZone = async (req, res) => {
  try {
    const zone = await Zone.findByPk(req.params.id);
    if (!zone) return res.status(404).json({ message: 'Zone non trouvée' });
    res.json(zone);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.updateDensity = async (req, res) => {
  try {
    const { vehicleCount } = req.body;
    const zone = await Zone.findByPk(req.params.id);
    if (!zone) return res.status(404).json({ message: 'Zone non trouvée' });

    const densityLevel = getDensityLevel(vehicleCount);
    await zone.update({ vehicleCount, densityLevel });

    res.json({
      message: 'Densité mise à jour',
      zone,
      alert: densityLevel === 'ÉLEVÉ' ? '⚠️ Zone congestionnée !' : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getCongestedZones = async (req, res) => {
  try {
    const zones = await Zone.findAll({
      where: { densityLevel: 'ÉLEVÉ', isActive: true }
    });
    res.json({
      message: `${zones.length} zone(s) congestionnée(s)`,
      zones
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─── SIMULER LA DENSITÉ ───────────────────────────────────────
// Pour les tests — génère des données aléatoires sur toutes les zones
exports.simulateDensity = async (req, res) => {
  try {
    const zones = await Zone.findAll({ where: { isActive: true } });
    const updated = [];

    for (const zone of zones) {
      const vehicleCount = Math.floor(Math.random() * 50);
      const densityLevel = getDensityLevel(vehicleCount);
      await zone.update({ vehicleCount, densityLevel });
      updated.push({ name: zone.name, vehicleCount, densityLevel });
    }

    res.json({ message: 'Simulation terminée', zones: updated });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};