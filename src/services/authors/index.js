import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import { getArticles, getAuthors, writeAuthors } from "../../lib/fs-tools.js";

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
authorsRouter.get("/:authorId", async (req, res) => {
  const authors = await getAuthors();

  const foundAuthor = authors.find(
    (author) => author.id === req.params.authorId
  );

  res.send(foundAuthor);
});

//4
authorsRouter.put("/:authorId", async (req, res) => {
  const authors = await getAuthors();

  const index = authors.findIndex(
    (author) => author.id === req.params.authorId
  );
  const oldAuthor = authors[index];
  const updatedAuthor = {
    ...oldAuthor,
    ...req.body,
    updatedAt: new Date(),
  };

  authors[index] = updatedAuthor;

  await writeAuthors(authors);

  res.send(updatedAuthor);
});

//5
authorsRouter.delete("/:authorId", async (req, res) => {
  const authors = await getAuthors();
  const remainingAuthors = authors.filter(
    (author) => author.id !== req.params.authorId
  );

  await writeAuthors(remainingAuthors);

  res.status(204).send();
});

export default authorsRouter;
