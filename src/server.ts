import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import { v1Router } from './routes/v1';
import { AppDataSource } from "./dataSource";
import { DataSource } from 'typeorm';

export let dbConnection: DataSource
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

  app.use(express.static('public'));

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

  const port = process.env.PORT || 3040;
  app.listen(port, () => {
    console.log(`The application is listening on port ${port}`);
  });
};
