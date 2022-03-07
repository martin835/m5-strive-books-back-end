import express from "express";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import { validationResult } from "express-validator";
import { newArticleValidation } from "./validation.js";
import createHttpError from "http-errors";
import { getArticles, writeArticles } from "../../lib/fs-tools.js";
import multer from "multer";
import { saveCoversPictures } from "../../lib/fs-tools.js";

/* console.log(import.meta.url);
console.log(fileURLToPath(import.meta.url)); */
const currentFilePath = fileURLToPath(import.meta.url);

const parentFolderPath = dirname(currentFilePath);
/* console.log(parentFolderPath); */

const articlesJSONPath = join(parentFolderPath, "articles.json");
/* console.log(articlesJSONPath); */

const articlesRouter = express.Router();
//1
articlesRouter.post(
  "/",
  newArticleValidation,
  async (request, response, next) => {
    try {
      console.log(request.body);
      const errorsList = validationResult(request);
      if (errorsList.isEmpty()) {
        console.log(request.body);
        const newArticle = {
          ...request.body,
          createdAt: new Date(),
          _id: uniqid(),
          cover:
            "https://i.insider.com/54856397eab8ea594db17e23?width=1136&format=jpeg",
          readTime: {
            value: 1,
            unit: "minute",
          },
          author: {
            name: "Martin Konečný",
            avatar:
              "https://365psd.com/images/previews/880/punk-is-not-dead-vector-graphics-eps-58962.jpg",
          },
        };
        const articlesArray = await getArticles();
        articlesArray.push(newArticle);
        await writeArticles(articlesArray);
        /*       const articlesArray = JSON.parse(fs.readFileSync(articlesJSONPath));

      articlesArray.push(newArticle);

      fs.writeFileSync(articlesJSONPath, JSON.stringify(articlesArray));
    */
        response.status(201).send({ _id: newArticle._id });
      } else {
        next(
          createHttpError(400, "Some errors occurred in req body", {
            errorsList,
          })
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

//2
articlesRouter.get("/", async (request, response) => {
  /*   const fileContent = fs.readFileSync(articlesJSONPath);
  console.log(JSON.parse(fileContent));
  const articlesArray = JSON.parse(fileContent); */

  const articles = await getArticles();

  if (request.query && request.query.category) {
    const filteredArticles = articles.filter(
      (article) => article.category === request.query.category
    );
    response.send(filteredArticles);
  } else {
    response.send(articles);
  }

  /* response.send(articlesArray); */
});

//3
articlesRouter.get("/:articleId", async (request, response) => {
  console.log(request.params.articleId);
  const articlesArray = await getArticles();

  const foundarticle = articlesArray.find(
    (article) => article._id === request.params.articleId
  );

  response.send(foundarticle);
});

//4
articlesRouter.put("/:articleId", async (request, response) => {
  const articlesArray = await getArticles();

  const index = articlesArray.findIndex(
    (article) => article._id === request.params.articleId
  );
  const oldarticle = articlesArray[index];
  const updatedarticle = {
    ...oldarticle,
    ...request.body,
    updatedAt: new Date(),
  };

  articlesArray[index] = updatedarticle;

  await writeArticles(articlesArray);

  response.send(updatedarticle);
});

//5
articlesRouter.delete("/:articleId", async (request, response) => {
  const articlesArray = await getArticles();
  const remainingarticles = articlesArray.filter(
    (article) => article._id !== request.params.articleId
  );

  await writeArticles(remainingarticles);

  response.status(204).send();
});

//6

articlesRouter.patch(
  "/:articleId/cover",
  multer().single("cover"),
  async (req, res, next) => {
    /* req.file.originalname.slice(req.file.originalname.indexOf(".") */
    try {
      console.log("FILE: ", req.file);
      await saveCoversPictures(req.params.articleId + ".jpg", req.file.buffer);
      res.send({ message: "file uploaded" });
    } catch (error) {
      next(error);
    }

    const articlesArray = await getArticles();

    const index = articlesArray.findIndex(
      (article) => article._id === req.params.articleId
    );
    const oldarticle = articlesArray[index];

    const coversPublicFolderPath = join(process.cwd(), "./public/img/covers");

    const coverPath =
      "http://localhost:3001/img/covers/" + req.params.articleId + ".jpg";

    const updatedarticle = {
      ...oldarticle,
      cover: coverPath,
      updatedAt: new Date(),
    };

    articlesArray[index] = updatedarticle;

    await writeArticles(articlesArray);
  }
);

export default articlesRouter;
