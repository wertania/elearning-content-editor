import { importFromDirectory } from "./src";
import { loadConfig } from "./src/config";
import { dataProvider, initializeDataProvider } from "./src/dataService";
import logger from "./src/logger";

(async function main() {
  try {
    logger.info("Starting import...");

    const config = loadConfig();

    await initializeDataProvider(config.dataProvider, { url: config.url });

    await dataProvider.login({
      username: config.user,
      password: config.password,
    });

    await importFromDirectory(
      config.sourcePath,
      config.baseLanguage,
      config.targetFolder || undefined,
    );
  } catch (error) {
    logger.error(error);
  }
})();
