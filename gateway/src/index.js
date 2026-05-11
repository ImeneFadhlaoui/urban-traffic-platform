const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./schema/resolvers');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));

const server = new ApolloServer({ typeDefs, resolvers });

const start = async () => {
  await server.start();

  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req, res }) => ({
      cookie: req.headers.cookie || '',  
      res                                
    })
  }));

  app.get('/health', (req, res) => res.json({ status: 'ok', service: 'gateway' }));

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Gateway GraphQL démarré sur http://localhost:${PORT}/graphql`);
  });
};

start();