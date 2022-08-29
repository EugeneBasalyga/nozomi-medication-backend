const {Pool} = require('pg');
const express = require('express');
const cors = require('cors');

const config = require('./config/config');
const errorMiddleware = require('../../shared/middleware/errorMiddleware');

const AuthController = require('./modules/auth/auth.controller');

const MedicationRepository = require('./modules/medications/medications.repository');
const MedicationService = require('./modules/medications/medications.service');
const MedicationController = require('./modules/medications/medications.controller');

const UserRepository = require('./modules/user/user.repository');
const UserService = require('./modules/user/user.service');

const SessionRepository = require('./modules/session/session.repository');
const SessionService = require('./modules/session/session.service');
const SessionController = require('./modules/session/session.controller');

const expressApp = express();

const createDatabaseClient = () => {
  const pool = new Pool({
    connectionString: config.db.connectionString,
    max: 20,
  });

  return pool;
};

const startServer = (app) => {
  const dbClient = createDatabaseClient();

  app.use(cors());
  app.use(express.json());

  const repository = {
    medication: new MedicationRepository(dbClient),
    session: new SessionRepository(dbClient),
    user: new UserRepository(dbClient),
  };

  const service = {
    medication: new MedicationService(repository),
    session: new SessionService(repository),
    user: new UserService(repository),
  };

  const rootRouter = express.Router();

  rootRouter.use('/medications', new MedicationController(service).getRouter());
  rootRouter.use('/session', new SessionController(service).getRouter());
  rootRouter.use('/auth', new AuthController(service).getRouter());

  app.use(rootRouter);
  app.use(errorMiddleware);

  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on port ${config.port}`);
  });
};

startServer(expressApp);
