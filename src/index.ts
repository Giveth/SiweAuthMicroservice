import dotenv from "dotenv"
import * as path from 'path';
dotenv.config({
  path: path.resolve(__dirname, `../config/${process.env.NODE_ENV || ''}.env`),
})

import { initServer } from "./server";
import { AppDataSource } from "./data-source";

const initDbConnection = async () =>{
  try {
    await AppDataSource.initialize();
  } catch (e) {
    console.log('initDbConnection error', e)
    throw e
  }
}
initDbConnection().then(()=>{
  initServer()
}).catch(e => {
  throw e;
})
