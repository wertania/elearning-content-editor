import "dotenv/config";
import parseArgs from "minimist";

export interface Config {
  dataProvider: string;
  user: string;
  password: string;
  url: string;
  baseLanguage: string;
  sourcePath: string;
  targetFolder: string | null;
}

export function loadConfig(): Config {
  const {
    MDI_DATAPROVIDER,
    MDI_DATAPROVIDER_USER,
    MDI_DATAPROVIDER_PASSWORD,
    MDI_DATAPROVIDER_URL,
    MDI_BASE_LANGUAGE,
    MDI_SOURCE_PATH,
    MDI_TARGET_FOLDER,
  } = process.env;

  const parsed = parseArgs(process.argv, { string: ["password"] });

  const config = {
    dataProvider: parsed.dataProvider || MDI_DATAPROVIDER,
    user: MDI_DATAPROVIDER_USER || parsed.user,
    password: MDI_DATAPROVIDER_PASSWORD || parsed.password,
    url: MDI_DATAPROVIDER_URL || parsed.url,
    baseLanguage: MDI_BASE_LANGUAGE || parsed.baseLanguage,
    sourcePath: MDI_SOURCE_PATH || parsed._[2],
    targetFolder: MDI_TARGET_FOLDER || parsed.targetFolder || null,
  };

  if (Object.values(config).some((value) => typeof value === "undefined")) {
    throw new Error(
      "Missing configuration option(s). Please check your .env file or command line arguments.",
    );
  }

  return config;
}
