import cosmosdb from '../../src/services/data/providers/cosmosdb';

const vitepressDataProvider = cosmosdb;
vitepressDataProvider.initialize({
  authenticationType: 'connection-string',
});

export { vitepressDataProvider };
