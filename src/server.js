import express from "express";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./services/authors/index.js";
import articlesRouter from "./services/articles/index.js";
import filesRouter from "./services/files/index.js";
import cors from "cors";
import {
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js";
import { join } from "path";

const publicFolderPath = join(process.cwd(), "./public");

const server = express();

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];
const port = process.env.PORT;

// *********************************** MIDDLEWARES ***********************************

server.use(express.static(publicFolderPath));
server.use(
  cors({
    origin: function (origin, next) {
      //cors is a global middleware - for each request
      console.log("ORIGIN: ", origin);
      // 0 \\ 0
      if (origin === undefined || whitelist.indexOf(origin) !== -1) {
        console.log("ORIGIN ALLOWED");
        next(null, true);
      } else {
        console.log("ORIGIN NOT ALLOWED");
        next(new Error("CORS ERROR!"));
      }
    },
  })
);
server.use(express.json());

// *********************************** ENDPOINTS *************************************
server.use("/authors", authorsRouter);
server.use("/articles", articlesRouter);
server.use("/files", filesRouter);

// ********************************** ERROR HANDLERS *********************************

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.table(listEndpoints(server));

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
