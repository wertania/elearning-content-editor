import dotenv from "dotenv";

dotenv.config({
  override: true,
});

export const POCKETBASE_URL = process.env.POCKETBASE_URL ?? "";
export const POCKETBASE_USERNAME = process.env.POCKETBASE_USERNAME ?? "";
export const POCKETBASE_PASSWORD = process.env.POCKETBASE_PASSWORD ?? "";
export const BASELANG = process.env.BASELANG ?? "en";
export const LOGO_PATH = process.env.LOGO_PATH ?? "";
export const COMPANY_NAME = process.env.COMPANY_NAME ?? "";
export const PAGE_TITLE = process.env.PAGE_TITLE ?? "e-Learning Platform";
export const PAGE_DESCRIPTION = process.env.PAGE_DESCRIPTION ?? "";
