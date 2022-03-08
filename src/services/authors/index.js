import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import { getAuthors, writeAuthors } from "../../lib/fs-tools.js";

/* 
OLD SYNC WAY:

const currentFilePath = fileURLToPath(import.meta.url);
const parentFolderPath = dirname(currentFilePath);
const authorsJSONPath = join(parentFolderPath, "authors.json");
*/

const authorsRouter = express.Router();
//1
authorsRouter.post("/", async (req, res, next) => {
  try {
    const authors = await getAuthors();

    const newAuthor = { ...req.body, createdAt: new Date(), id: uniqid() };

    authors.push(newAuthor);

    await writeAuthors(authors);

    res.status(201).send({ id: newAuthor.id });
  } catch (error) {}
});

//2
authorsRouter.get("/", async (req, res) => {
  const authors = await getAuthors();

  res.send(authors);
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
