import { body } from "express-validator";

export const newArticleValidation = [
  body("title").exists().withMessage("Title is mandatory field!"),
  body("content")
    .custom((value) => value.length >= 3)
    .withMessage("Content is mandatory field!"),
  body("category").exists().withMessage("Category is mandatory field!"),
];
