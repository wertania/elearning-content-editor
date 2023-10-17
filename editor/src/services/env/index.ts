/**
 * This service enables Vitepress and Vite to access the same object of ENV variables.
 * Vitepress needs `process.env`, Vite needs `import.meta.env`.
 */

import process from 'process';
import dotenv from 'dotenv';
import path from 'path';


let variables: any = {};

// try to fill them for vite
try {
  variables = {
    ENV_VITE_BASE_LANGUAGE: import.meta.env.VITE_BASE_LANGUAGE ||'en',
    ENV_VITE_AVAILABLE_LANGUAGES: import.meta.env.VITE_AVAILABLE_LANGUAGES,

    ENV_VITE_DOCUMENT_DATASOURCE: import.meta.env.VITE_DOCUMENT_DATASOURCE,
    
    ENV_VITE_AZURE_COSMOSDB_TENANT_ID: import.meta.env.VITE_AZURE_COSMOSDB_TENANT_ID,
    ENV_VITE_AZURE_COSMOSDB_CLIENT_ID: import.meta.env.VITE_AZURE_COSMOSDB_CLIENT_ID,
    ENV_VITE_AZURE_COSMOSDB_ENDPOINT: import.meta.env.VITE_AZURE_COSMOSDB_ENDPOINT,
    ENV_VITE_AZURE_COSMOSDB_DATABASE: import.meta.env.VITE_AZURE_COSMOSDB_DATABASE,
    ENV_VITE_AZURE_COSMOSDB_CONTAINER: import.meta.env.VITE_AZURE_COSMOSDB_CONTAINER,
    ENV_VITE_AZURE_COSMOSDB_CONTAINER_MEDIA: import.meta.env.VITE_AZURE_COSMOSDB_CONTAINER_MEDIA,
    ENV_VITE_AZURE_AUTHENTICATION_TYPE: import.meta.env.VITE_AZURE_AUTHENTICATION_TYPE,
    ENV_VITE_AZURE_COSMOSDB_CONNECTION_STRING: import.meta.env.VITE_AZURE_COSMOSDB_CONNECTION_STRING,
    
    ENV_VITE_LOCALDB_HOST: import.meta.env.VITE_LOCALDB_HOST,    
    
    ENV_VITE_OPENAI_KEY: import.meta.env.VITE_OPENAI_KEY,

    ENV_VITE_VIDEOCONVERTER_URL: import.meta.env.VITE_VIDEOCONVERTER_URL,

    ENV_VITE_POCKETBASE_URL: import.meta.env.VITE_POCKETBASE_URL,

    ENV_VITE_COMPANY_NAME: import.meta.env.VITE_COMPANY_NAME,
    ENV_VITE_LOGO_PATH: import.meta.env.VITE_LOGO_PATH,
    ENV_VITE_PAGE_TITLE: import.meta.env.VITE_PAGE_TITLE,
    ENV_VITE_PAGE_DESCRIPTION: import.meta.env.VITE_PAGE_DESCRIPTION,

    ENV_VITE_AZURE_BLOB_STORAGE_URL: import.meta.env.VITE_AZURE_BLOB_STORAGE_URL,
    ENV_VITE_AZURE_BLOB_STORAGE_CONTAINER_NAME: import.meta.env.VITE_AZURE_BLOB_STORAGE_CONTAINER_NAME,

    ENV_VITE_POCKETBASE_VP_USERNAME: import.meta.env.VITE_POCKETBASE_VP_USERNAME,
    ENV_VITE_POCKETBASE_VP_PASSWORD: import.meta.env.VITE_POCKETBASE_VP_PASSWORD,
  }
} catch (error) {
  console.log("skip", error);

  // else try to fill them for node
  try {

    dotenv.config({
        path: path.resolve(__dirname, '../../../.env'),
        override: true,
      });      
    variables = {
      ENV_VITE_BASE_LANGUAGE: process.env.VITE_BASE_LANGUAGE,
      ENV_VITE_DOCUMENT_DATASOURCE: process.env.VITE_DOCUMENT_DATASOURCE,
      ENV_VITE_AZURE_COSMOSDB_TENANT_ID:  process.env.VITE_AZURE_COSMOSDB_TENANT_ID,
      ENV_VITE_AZURE_COSMOSDB_CLIENT_ID: process.env.VITE_AZURE_COSMOSDB_CLIENT_ID,
      ENV_VITE_AZURE_COSMOSDB_ENDPOINT:  process.env.VITE_AZURE_COSMOSDB_ENDPOINT,
      ENV_VITE_AZURE_COSMOSDB_DATABASE: process.env.VITE_AZURE_COSMOSDB_DATABASE,
      ENV_VITE_AZURE_COSMOSDB_CONTAINER: process.env.VITE_AZURE_COSMOSDB_CONTAINER,
      ENV_VITE_AZURE_COSMOSDB_CONTAINER_MEDIA:  process.env.VITE_AZURE_COSMOSDB_CONTAINER_MEDIA,
      ENV_VITE_AZURE_AUTHENTICATION_TYPE:  process.env.VITE_AZURE_AUTHENTICATION_TYPE,
      ENV_VITE_AZURE_COSMOSDB_CONNECTION_STRING: process.env.VITE_AZURE_COSMOSDB_CONNECTION_STRING,
      ENV_VITE_LOCALDB_HOST: process.env.VITE_LOCALDB_HOST,
      ENV_VITE_AVAILABLE_LANGUAGES:  process.env.VITE_AVAILABLE_LANGUAGES,
      ENV_VITE_OPENAI_KEY:  process.env.VITE_OPENAI_KEY,
      ENV_VITE_VIDEOCONVERTER_URL:  process.env.VITE_VIDEOCONVERTER_URL,
      ENV_VITE_POCKETBASE_URL:  process.env.VITE_POCKETBASE_URL,
      ENV_VITE_COMPANY_NAME: process.env.VITE_COMPANY_NAME,
      ENV_VITE_LOGO_PATH:  process.env.VITE_LOGO_PATH,
      ENV_VITE_PAGE_TITLE:  process.env.VITE_PAGE_TITLE,
      ENV_VITE_PAGE_DESCRIPTION: process.env.VITE_PAGE_DESCRIPTION,
      ENV_VITE_AZURE_BLOB_STORAGE_URL: process.env.VITE_AZURE_BLOB_STORAGE_URL,
      ENV_VITE_AZURE_BLOB_STORAGE_CONTAINER_NAME:  process.env.VITE_AZURE_BLOB_STORAGE_CONTAINER_NAME,
      ENV_VITE_POCKETBASE_VP_USERNAME:  process.env.VITE_POCKETBASE_VP_USERNAME,
      ENV_VITE_POCKETBASE_VP_PASSWORD:  process.env.VITE_POCKETBASE_VP_PASSWORD,
    }
  } catch (error) {
    console.log("skip", error);
  }
}

// check some variables and set defaults or throw error

if (variables.ENV_VITE_AVAILABLE_LANGUAGES == null) {
  variables.ENV_VITE_AVAILABLE_LANGUAGES = [{"code":"en","name":"English"}];
}

// TO DO!

console.log('env', variables);

// std. export
export default variables;
