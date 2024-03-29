import logger from "pino";
import dayjs from "dayjs";
import { cleanEnv, str, url, port } from "envalid";

// Returns sanitised environment Variables
const validateEnv = (): void => {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ["development", "production"],
    }),
    MONGO_URI: str(),
    PORT: port(),
    ACCESS_TOKEN_SECRET_KEY: str(),
    REFRESH_TOKEN_SECRET_KEY: str(),
    ORIGIN: url(),
    LOG_LEVEL: str(),
    ACCESS_TOKEN_EXPIRES_IN: str(),
    VERIFY_ACCOUNT_REDIRECT_URL: str(),
  });
};

const log = logger({
  transport: {
    target: "pino-pretty",
  },
  level: process.env.LOG_LEVEL,
  base: {
    pid: false,
  },
  timestamp: () => `, time: ${dayjs().format()}`,
});

const generateAlphanumeric = (charLength: number): string => {
  const options =
    "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const result = [];

  for (let i = 0; i < charLength; i++) {
    const randomIndex = Math.floor(Math.random() * options.length);
    const randomChar = options[randomIndex];
    result.push(randomChar);
  }

  return result.join("");
};

const createSlug = (title: string): string => {
  let slug = title.toLowerCase();

  // Remove special characters and spaces
  slug = slug.replace(/[^a-z0-9]+/g, "-");

  // Remove leading and trailing hyphens
  slug = slug.replace(/^-+|-+$/g, "");

  slug = `${slug}-${generateAlphanumeric(6)}`.toLowerCase();
  return slug;
};

export { log, generateAlphanumeric, validateEnv, createSlug };
