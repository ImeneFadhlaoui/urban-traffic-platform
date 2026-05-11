const axios = require('axios');

const SERVICES = {
  auth:         process.env.AUTH_SERVICE_URL         || 'http://localhost:3001',
  vehicle:      process.env.VEHICLE_SERVICE_URL      || 'http://localhost:3002',
  traffic:      process.env.TRAFFIC_SERVICE_URL      || 'http://localhost:3003',
  incident:     process.env.INCIDENT_SERVICE_URL     || 'http://localhost:3004',
  notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005',
};

// Fonction helper — appelle un service interne en transmettant le cookie
const call = (baseURL) => async (method, path, data, cookie) => {
  try {
    const res = await axios({
      method,
      url: `${baseURL}${path}`,
      data,
      headers: cookie ? { Cookie: cookie } : {},
      withCredentials: true
    });
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    throw new Error(msg);
  }
};

module.exports = {
  auth:         call(SERVICES.auth),
  vehicle:      call(SERVICES.vehicle),
  traffic:      call(SERVICES.traffic),
  incident:     call(SERVICES.incident),
  notification: call(SERVICES.notification),
};