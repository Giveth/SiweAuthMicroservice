import dotenv from "dotenv"
import * as path from 'path';
dotenv.config({
  path: path.resolve(__dirname, `../config/${process.env.NODE_ENV || ''}.env`),
})

import { initServer } from "./server";

initServer()
