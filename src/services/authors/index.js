import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

/* console.log(import.meta.url);
console.log(fileURLToPath(import.meta.url)); */
const currentFilePath = fileURLToPath(import.meta.url);

const parentFolderPath = dirname(currentFilePath);
/* console.log(parentFolderPath); */

const authorsJSONPath = join(parentFolderPath, "authors.json");
/* console.log(authorsJSONPath); */

const authorsRouter = express.Router();
//1
authorsRouter.post("/", (request, response) => {
  console.log(request.body);
  const newAuthor = { ...request.body, createdAt: new Date(), id: uniqid() };
  console.log(newAuthor);

  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

  authorsArray.push(newAuthor);

  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));

  response.status(201).send({ id: newAuthor.id });
});

//2
authorsRouter.get("/", (request, response) => {
  const fileContent = fs.readFileSync(authorsJSONPath);
  console.log(JSON.parse(fileContent));
  const authorsArray = JSON.parse(fileContent);
  response.send(authorsArray);
});

//3
authorsRouter.get("/:authorId", (request, response) => {
  console.log(request.params.authorId);
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

  const foundAuthor = authorsArray.find(
    (author) => author.id === request.params.authorId
  );

  response.send(foundAuthor);
});

//4
authorsRouter.put("/:authorId", (request, response) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

  const index = authorsArray.findIndex(
    (author) => author.id === request.params.authorId
  );
  const oldAuthor = authorsArray[index];
  const updatedAuthor = {
    ...oldAuthor,
    ...request.body,
    updatedAt: new Date(),
  };

  authorsArray[index] = updatedAuthor;

  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));

  response.send(updatedAuthor);
});

//5
authorsRouter.delete("/:authorId", (request, response) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const remainingAuthors = authorsArray.filter(
    (author) => author.id !== request.params.authorId
  );

  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors));

  response.status(204).send();
});

export default authorsRouter;
