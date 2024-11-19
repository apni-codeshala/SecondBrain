import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

import connect from "./config/db.config";
import apiRoutes from "./routes/index";

const app = express();
dotenv.config();

const allowedOrigins = ["https://secondbrain-kappa.vercel.app"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return;
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is listening at PORT: ${PORT}`);
  await connect();
});
