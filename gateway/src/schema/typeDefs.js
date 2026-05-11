const typeDefs = `#graphql

  # ─── TYPES ────────────────────────────────────────────────────

  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
  }

  type AuthPayload {
    message: String!
    user: User
  }

  type Vehicle {
    id: ID!
    plate: String!
    type: String!
    brand: String!
    model: String!
    status: String!
    currentLat: Float
    currentLng: Float
    createdAt: String
  }

  type GpsPosition {
    id: ID!
    vehicleId: ID!
    latitude: Float!
    longitude: Float!
    speed: Float
    recordedAt: String
  }

  type VehicleHistory {
    total: Int!
    positions: [GpsPosition!]!
  }

  type Zone {
    id: ID!
    name: String!
    centerLat: Float!
    centerLng: Float!
    radius: Int
    vehicleCount: Int!
    densityLevel: String!
    isActive: Boolean
  }

  type Incident {
    id: ID!
    title: String!
    description: String
    type: String!
    status: String!
    location: String
    latitude: Float
    longitude: Float
    reportedByName: String
    resolvedAt: String
    createdAt: String
  }

  type IncidentStats {
    total: Int!
    signale: Int!
    enCours: Int!
    resolu: Int!
  }

  type Notification {
    id: ID!
    title: String!
    message: String!
    type: String!
    isRead: Boolean!
    createdAt: String
  }

  type SimulateResult {
    message: String!
  }

  type DensityResult {
    message: String!
    alert: String
    zone: Zone
  }

  # ─── QUERIES (lecture) ────────────────────────────────────────

  type Query {
    # Auth
    me: User

    # Véhicules
    vehicles: [Vehicle!]!
    vehicle(id: ID!): Vehicle
    vehicleHistory(id: ID!): VehicleHistory

    # Trafic
    zones: [Zone!]!
    zone(id: ID!): Zone
    congestedZones: [Zone!]!

    # Incidents
    incidents(status: String, type: String): [Incident!]!
    incident(id: ID!): Incident
    incidentStats: IncidentStats

    # Notifications
    notifications: [Notification!]!
  }

  # ─── MUTATIONS (écriture) ─────────────────────────────────────

  type Mutation {
    # Auth
    register(username: String!, email: String!, password: String!, role: String): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    logout: AuthPayload!

    # Véhicules
    addVehicle(plate: String!, type: String!, brand: String!, model: String!): Vehicle!
    recordPosition(vehicleId: ID!, latitude: Float!, longitude: Float!, speed: Float): GpsPosition!
    simulatePositions(vehicleId: ID!): SimulateResult!

    # Trafic
    createZone(name: String!, centerLat: Float!, centerLng: Float!, radius: Int): Zone!
    updateDensity(zoneId: ID!, vehicleCount: Int!): DensityResult!
    simulateDensity: SimulateResult!

    # Incidents
    createIncident(title: String!, type: String!, description: String, location: String, latitude: Float, longitude: Float): Incident!
    updateIncidentStatus(id: ID!, status: String!): Incident!

    # Notifications
    markNotificationRead(id: ID!): Notification!
  }
`;

module.exports = typeDefs;