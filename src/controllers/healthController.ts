import { Body, Controller, Post, Route, Response, SuccessResponse, Get, Security } from "tsoa";

interface HealthResponse {
  message:string;
}

@Route("health")
export  class HealthController {
  @Get("/")
  public async getMessage(): Promise<HealthResponse> {
    return {
      message: "I am alive",
    };
  }
}
