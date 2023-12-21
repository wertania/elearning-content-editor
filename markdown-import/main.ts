import { importFromDirectory } from "./src";
import { dataProvider } from "./src/dataService";

(async function main() {
  await dataProvider.initialize();
  await dataProvider.login({
    username: "leon",
    password: "12345678",
  });

  // await dataProvider.clear();

  await importFromDirectory("./testfiles", "de");
})();
