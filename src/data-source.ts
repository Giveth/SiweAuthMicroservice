import "reflect-metadata";
import { DataSource } from "typeorm";
import { entities } from "./entities";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.TYPEORM_DATABASE_HOST,
  port: Number(process.env.TYPEORM_DATABASE_PORT),
  username: process.env.TYPEORM_DATABASE_USER,
  password: process.env.TYPEORM_DATABASE_PASSWORD,
  database: process.env.TYPEORM_DATABASE_NAME,
  synchronize: process.env.NODE_ENV === "development",
  logging: false,
  entities,
  migrations: ["migration/*.ts"],
  subscribers: []
});
