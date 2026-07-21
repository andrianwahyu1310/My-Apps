import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DATA_PATH = path.join(__dirname, "..", "data");

export const TOOLS_FILE = path.join(DATA_PATH, "tools.json");
export const ARTICLE_FILE = path.join(DATA_PATH, "article.json");
export const NEWS_FILE = path.join(DATA_PATH, "news.json");
export const QUIZ_PATH = path.join(DATA_PATH, "quizQuestions.json");
export const DATA_NEWS_PATH = ARTICLE_FILE;

export const BRAIN_TEASER_PATH = path.join(
    __dirname,
    "..",
    "data",
    "brainTeaser.json"
);