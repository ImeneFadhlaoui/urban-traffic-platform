const api = require('../services/api');


const resolvers = {

  Query: {

    // ─── AUTH ──────────────────────────────────────────────────
    me: async (_, __, { cookie }) => {
      const data = await api.auth('get', '/api/auth/me', null, cookie);
      return data;
    },

    // ─── VÉHICULES ─────────────────────────────────────────────
    vehicles: async (_, __, { cookie }) => {
      const data = await api.vehicle('get', '/api/vehicles', null, cookie);
      return data.vehicles;
    },

    vehicle: async (_, { id }, { cookie }) => {
      return await api.vehicle('get', `/api/vehicles/${id}`, null, cookie);
    },

    vehicleHistory: async (_, { id }, { cookie }) => {
      return await api.vehicle('get', `/api/vehicles/${id}/history`, null, cookie);
    },

    // ─── TRAFIC ────────────────────────────────────────────────
    zones: async (_, __, { cookie }) => {
      const data = await api.traffic('get', '/api/traffic', null, cookie);
      return data.zones;
    },

    zone: async (_, { id }, { cookie }) => {
      return await api.traffic('get', `/api/traffic/${id}`, null, cookie);
    },

    congestedZones: async (_, __, { cookie }) => {
      const data = await api.traffic('get', '/api/traffic/congested', null, cookie);
      return data.zones;
    },

    // ─── INCIDENTS ─────────────────────────────────────────────
    incidents: async (_, { status, type }, { cookie }) => {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (type) params.append('type', type);
      const query = params.toString() ? `?${params}` : '';
      const data = await api.incident('get', `/api/incidents${query}`, null, cookie);
      return data.incidents;
    },

    incident: async (_, { id }, { cookie }) => {
      return await api.incident('get', `/api/incidents/${id}`, null, cookie);
    },

    incidentStats: async (_, __, { cookie }) => {
      return await api.incident('get', '/api/incidents/stats', null, cookie);
    },

    // ─── NOTIFICATIONS ─────────────────────────────────────────
    notifications: async (_, __, { cookie }) => {
      const data = await api.notification('get', '/api/notifications', null, cookie);
      return data.notifications;
    },
  },

  Mutation: {

    // ─── AUTH ──────────────────────────────────────────────────
    register: async (_, args) => {
      return await api.auth('post', '/api/auth/register', args);
    },

    login: async (_, args, { res }) => {
      const axiosRes = await require('axios').post(
        `${process.env.AUTH_SERVICE_URL || 'http://localhost:3001'}/api/auth/login`,
        args
      );
      // Récupère le cookie du service Auth et le repose sur la réponse Gateway
      const setCookie = axiosRes.headers['set-cookie'];
      if (setCookie) res.setHeader('Set-Cookie', setCookie);
      return axiosRes.data;
    },

    logout: async (_, __, { res, cookie }) => {
      await api.auth('post', '/api/auth/logout', null, cookie);
      res.clearCookie('token');
      return { message: 'Déconnexion réussie' };
    },

    // ─── VÉHICULES ─────────────────────────────────────────────
    addVehicle: async (_, args, { cookie }) => {
      return await api.vehicle('post', '/api/vehicles', args, cookie);
    },

    recordPosition: async (_, { vehicleId, ...args }, { cookie }) => {
      const data = await api.vehicle('post', `/api/vehicles/${vehicleId}/position`, args, cookie);
      return data.position;
    },

    simulatePositions: async (_, { vehicleId }, { cookie }) => {
      return await api.vehicle('post', `/api/vehicles/${vehicleId}/simulate`, {}, cookie);
    },

    // ─── TRAFIC ────────────────────────────────────────────────
    createZone: async (_, args, { cookie }) => {
      const data = await api.traffic('post', '/api/traffic', args, cookie);
      return data.zone;
    },

    updateDensity: async (_, { zoneId, vehicleCount }, { cookie }) => {
      return await api.traffic('put', `/api/traffic/${zoneId}/density`, { vehicleCount }, cookie);
    },

    simulateDensity: async (_, __, { cookie }) => {
      return await api.traffic('post', '/api/traffic/simulate', {}, cookie);
    },

    // ─── INCIDENTS ─────────────────────────────────────────────
    createIncident: async (_, args, { cookie }) => {
      const data = await api.incident('post', '/api/incidents', args, cookie);
      return data.incident;
    },

    updateIncidentStatus: async (_, { id, status }, { cookie }) => {
      const data = await api.incident('patch', `/api/incidents/${id}/status`, { status }, cookie);
      return data.incident;
    },

    // ─── NOTIFICATIONS ─────────────────────────────────────────
    markNotificationRead: async (_, { id }, { cookie }) => {
      const data = await api.notification('patch', `/api/notifications/${id}/read`, {}, cookie);
      return data.notification;
    },
  },
};

module.exports = resolvers;