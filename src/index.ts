import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { v1Router } from "./routes/v1";
const app: Application = express();


app.use(express.static("public"));

app.use(v1Router);
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
