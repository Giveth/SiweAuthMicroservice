import express, { Application, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { healthRouter } from "./routes/healthRouter";
const app: Application = express();


app.use(express.static("public"));

app.use(healthRouter);
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);


app.listen(3040, () => {
  console.log('The application is listening on port 3040!');
});
