/**
 * This service enables Vitepress and Vite to access the same object of ENV variables.
 * Vitepress needs `process.env`, Vite needs `import.meta.env`.
 */

export default import.meta?.env ? import.meta.env : process.env;
