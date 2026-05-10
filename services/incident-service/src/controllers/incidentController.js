const { validationResult } = require('express-validator');
const Incident = require('../models/Incident');

exports.createIncident = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { title, description, type, latitude, longitude, location } = req.body;

    const incident = await Incident.create({
      title,
      description,
      type,
      latitude,
      longitude,
      location,
      reportedBy: req.user.id,
      reportedByName: req.user.email
    });

    res.status(201).json({ message: 'Incident déclaré', incident });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getIncidents = async (req, res) => {
  try {
    const { status, type } = req.query;
    const where = {};

    if (status) where.status = status;
    if (type) where.type = type;

    const incidents = await Incident.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.json({ total: incidents.length, incidents });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getIncident = async (req, res) => {
  try {
    const incident = await Incident.findByPk(req.params.id);
    if (!incident) return res.status(404).json({ message: 'Incident non trouvé' });
    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['SIGNALÉ', 'EN_COURS', 'RÉSOLU'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    const incident = await Incident.findByPk(req.params.id);
    if (!incident) return res.status(404).json({ message: 'Incident non trouvé' });

    const updates = { status };

    if (status === 'RÉSOLU') updates.resolvedAt = new Date();

    await incident.update(updates);
    res.json({ message: 'Statut mis à jour', incident });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Incident.count();
    const signale = await Incident.count({ where: { status: 'SIGNALÉ' } });
    const enCours = await Incident.count({ where: { status: 'EN_COURS' } });
    const resolu = await Incident.count({ where: { status: 'RÉSOLU' } });

    res.json({ total, signale, enCours, resolu });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};