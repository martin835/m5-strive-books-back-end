import express from "express";
import multer from "multer";
import { saveCoversPictures } from "../../lib/fs-tools.js";
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

filesRouter.get("/:articleId/downloadPDF", (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=article.pdf");

    const source = getPDFReadableStream("MY OWL EXAMPLE");

    const destination = res;

    pipeline(source, destination, (err) => {
      console.log(err);
    });
  } catch (error) {
    next(error);
  }
});

export default filesRouter;
