import dotenv from "dotenv";

const inBrowser = typeof window !== "undefined";

if (!inBrowser) {
  dotenv.config({
    override: true,
  });
}

const getEnv = (key: string) => (inBrowser ? "" : process.env[key] ?? "");

export const POCKETBASE_URL = getEnv("POCKETBASE_URL");
export const POCKETBASE_USERNAME = getEnv("POCKETBASE_USERNAME");
export const POCKETBASE_PASSWORD = getEnv("POCKETBASE_PASSWORD");
export const BASELANG = getEnv("BASELANG");
export const LOGO_PATH = getEnv("LOGO_PATH");
export const COMPANY_NAME = getEnv("COMPANY_NAME");
export const PAGE_TITLE = getEnv("PAGE_TITLE");
export const PAGE_DESCRIPTION = getEnv("PAGE_DESCRIPTION");
