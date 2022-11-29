import express, { json } from "express";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import wordsRouter from "./routes/wordsRouter";

const app = express();
const port = 3000;

app.use(morgan("dev"));
app.use(compression());
app.use(helmet());
app.use(json());
app.use(cors());

app.use("/test", (_req, res) => {
  res.send("test");
});

app.use("/words", wordsRouter);

app.use((_req, res) => {
  res.sendStatus(404);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running at https://localhost:${port}`);
});
