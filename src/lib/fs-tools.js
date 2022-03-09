import fs from "fs-extra"; // 3RD PARTY MODULE
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile, createReadStream } = fs;

const getJSONPath = (filename) =>
  join(join(dirname(fileURLToPath(import.meta.url)), "../data"), filename);

const articlesJSONPath = getJSONPath("articles.json");
const authorsJSONPath = getJSONPath("authors.json");

const coversPublicFolderPath = join(process.cwd(), "./public/img/covers");
const avatarsPublicFolderPath = join(process.cwd(), "./public/img/avatars");

export const getArticles = () => readJSON(articlesJSONPath);
export const writeArticles = (content) => writeJSON(articlesJSONPath, content);
export const getAuthors = () => readJSON(authorsJSONPath);
export const writeAuthors = (content) => writeJSON(authorsJSONPath, content);

export const saveCoversPictures = (filename, contentAsABuffer) =>
  writeFile(join(coversPublicFolderPath, filename), contentAsABuffer);

export const saveAvatarsPictures = (filename, contentAsABuffer) =>
  writeFile(join(avatarsPublicFolderPath, filename), contentAsABuffer);

export const getArticlesReadableStream = () =>
  createReadStream(articlesJSONPath);
