import { Application } from "../entities/application";

export interface ControllerInputParams {
  body: any
  query:any
  headers ?: any
  application ?:Application
}
