/**
 * This service enables Vitepress and Vite to access the same object of ENV variables.
 * Vitepress needs `process.env`, Vite needs `import.meta.env`.
 */

import process from 'process';
import dotenv from 'dotenv';
import path from 'path';

export default import.meta?.env ? import.meta.env : process.env;

/**
 * This function loads the default `.env` also used by the editor frontend.
 * Additionally, it loads `.env.vitepress` to apply overrides.
 */
export const loadVitepressEnv = () => {
  dotenv.config({
    path: path.resolve(__dirname, '../../../.env'),
  });

  dotenv.config({
    path: path.resolve(__dirname, '../../../.env.vitepress'),
    override: true,
  });
};
