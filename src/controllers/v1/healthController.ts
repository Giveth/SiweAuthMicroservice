import { Route, Get, Tags } from "tsoa";

type HealthResponse = {
  message:string;
}

@Route("/v1/health")
@Tags('Health')
export  class HealthController {
  @Get("/")
  public async getMessage(): Promise<HealthResponse> {
    return {
      message: "I am alive",
    };
  }
}
