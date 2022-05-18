import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import { v1Router } from './routes/v1';
import { AppDataSource } from './dataSource';
import { DataSource } from 'typeorm';
import bodyParser from 'body-parser';
import { errorHandler } from './middlewares/errorHandler';
import { adminJsRootPath, getAdminBroRouter } from './routes/v1/adminbroRouter';
import { logger } from './utils/logger';

// tslint:disable:no-var-requires
const cors = require('cors');
const whitelistHostnames: string[] = (
  process.env.HOSTNAME_WHITELIST as string
).split(',');

export let dbConnection: DataSource;
export const initDbConnection = async () => {
  try {
    dbConnection = await AppDataSource.initialize();
  } catch (e) {
    console.log('initDbConnection error', e);
    throw e;
  }
};

export const initServer = async () => {
  const app: Application = express();
  const corsOptions = {
    origin(origin: string, callback: any) {
      if (!origin) {
        // allow requests with no origin (like mobile apps, Curl, ...)
        return callback(null, true);
      }

      // removing http:// , https://, and :port
      const formattedOrigin = origin
        .replace('https://', '')
        .replace('http://', '')
        .split(':')[0];

      for (const allowedOrigin of whitelistHostnames) {
        // passing all subdomains of whitelist hosts, for instance x.vercel.app, x.giveth.io,...
        if (
          formattedOrigin === allowedOrigin ||
          formattedOrigin.endsWith(`.${allowedOrigin}`)
        ) {
          return callback(null, true);
        }
      }

      logger.error('CORS error', { whitelistHostnames, origin });
      callback(new Error('Not allowed by CORS'));
    },
  };
  app.use(cors(corsOptions));

  app.use(express.static('public'));
  app.use(bodyParser.json());
  app.use(adminJsRootPath, await getAdminBroRouter());
  app.use(v1Router);
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: {
        url: '/swagger.json',
      },
    }),
  );
  app.use(errorHandler);
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`The application is listening on port ${port}`);
  });
};
