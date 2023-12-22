import { importFromDirectory } from "./src";
import { loadConfig } from "./src/config";
import { dataProvider, initializeDataProvider } from "./src/dataService";

(async function main() {
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
})();
