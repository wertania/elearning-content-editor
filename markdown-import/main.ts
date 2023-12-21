import { importFromDirectory } from "./src";
import { loadConfig } from "./src/config";
import { dataProvider, initializeDataProvider } from "./src/dataService";

(async function main() {
  const config = loadConfig();
  console.log(config);
  

  await initializeDataProvider(config.dataProvider);

  await dataProvider.login({
    username: config.user,
    password: config.password,
  });

  // await dataProvider.clear();

  await importFromDirectory(config.sourcePath, config.baseLanguage);
})();
