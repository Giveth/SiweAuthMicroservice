import dotenv from 'dotenv';
import * as path from 'path';
import { dbConnection, initDbConnection, initServer } from '../src/server';
import { AppDataSource } from '../src/dataSource';
import { SiweNonce } from '../src/entities/siweNonce';

dotenv.config({
  path: path.resolve(__dirname, `../config/${process.env.NODE_ENV || ''}.env`),
});

async function dropDatabaseAndCreateFreshOne() {
  // tslint:disable-next-line:no-console
  console.log('Dropping DB');
  try {
    await AppDataSource.synchronize(true);
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log('drop db error', e);
  }
}

async function runMigrations() {
  await dbConnection.runMigrations({
    transaction: 'all',
  });
  console.log('Migrations has been executed successfully');
}

const seedDb = async () => {
  const nonce = SiweNonce.create({ nonce: '342', expirationDate: new Date() });
  await nonce.save();
};

before(async () => {
  try {
    await initDbConnection();
    await dropDatabaseAndCreateFreshOne();
    await runMigrations();
    await seedDb();
    await initServer();
  } catch (e: any) {
    throw new Error(`Could not setup tests requirements \n${e.message}`);
  }
});
