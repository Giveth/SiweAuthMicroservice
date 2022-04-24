import { Route, Get } from "tsoa";

type HealthResponse = {
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
