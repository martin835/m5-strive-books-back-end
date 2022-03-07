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
/* console.log(publicFolderPath); */

const server = express();
const port = 3001;
// *********************************** MIDDLEWARES ***********************************

server.use(express.static(publicFolderPath));
server.use(cors());
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
