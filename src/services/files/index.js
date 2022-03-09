import express from "express";
import multer from "multer";
import { saveCoversPictures, getArticles } from "../../lib/fs-tools.js";
import { getPDFReadableStream } from "../../lib/pdf-tools.js";
import { pipeline } from "stream";

const filesRouter = express.Router();

filesRouter.post(
  "/uploadCover",
  multer().single("cover"),
  async (req, res, next) => {
    // "avatar" does need to match exactly to the property name appended to the FormData object in the frontend, otherwise Multer is not going to be able to find the file in the request body
    try {
      console.log("FILE: ", req.file);
      await saveCoversPictures(req.file.originalname, req.file.buffer);
      res.send();
    } catch (error) {
      next(error);
    }
  }
);

filesRouter.get("/:articleId/downloadPDF", async (req, res, next) => {
  try {
    //1, get data from articles about concrete article using req.params.articleId
    const articles = await getArticles();

    const foundarticle = articles.find(
      (article) => article._id === req.params.articleId
    );

    console.log(foundarticle.title);
    console.log(foundarticle.content);
    //2, send that data to getPDFReadableStream(articleData)

    res.setHeader("Content-Disposition", "attachment; filename=article.pdf");

    console.log("THIS SHOULD BE MY DOWNLOAD articleId: ", req.params.articleId);

    const source = getPDFReadableStream(foundarticle);

    const destination = res;
    pipeline(source, destination, (err) => {
      console.log(err);
    });
  } catch (error) {
    next(error);
  }
});

export default filesRouter;
