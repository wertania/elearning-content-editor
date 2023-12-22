# Markdown Import

To run the importer, either use a native TypeScript runner like `tsx` or `bun`, or first transpile to JavaScript and use `node` to execute.

The preferred way is to use `tsx` via an `npm` script:

```sh
npm run start -- [options] <sourcePath>
```

## Options

You can provide the options via command line arguments like this:

```sh
npm run start --
  --baseLanguage   The base language to use for the import
  --dataProvider   The data provider implementation to use
  --url            The URL to the data provider
  --user           The username to use for the data provider
  --password       The password to use for the data provider
  <sourcePath>     The path to the markdown files to import
```

Alternatively, you can provide the options via environment variables:

```sh
MDI_DATAPROVIDER=
MDI_DATAPROVIDER_USER=
MDI_DATAPROVIDER_PASSWORD=
MDI_DATAPROVIDER_URL=
MDI_BASE_LANGUAGE=
MDI_SOURCE_PATH=
```

Example:

```sh
npm run start -- --baseLanguage de --dataProvider pocketbase --user user --password password --url http://localhost:8080 ./testfiles
```
