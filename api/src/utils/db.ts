import config from '@utils/config';
import logger from '@utils/logger';
import pgp from 'pg-promise';
import fs from 'fs';

const pg = pgp();
const cn = `postgresql://${config.DB_USERNAME}:${config.DB_PASSWORD}@${config.DB_HOSTNAME}:${config.DB_PORT}/${config.DB_PROJNAME}`;
const db = pg(cn);

const createTables = async (): Promise<void> => {
  try {
    const schema = fs.readFileSync('../tables', 'utf8');
    await db.none(schema);

    logger.info('    Create tables success');
  } catch (err) {
    if (err.message !== 'Invalid query format') {
      logger.error('    CREATE TABLES FAILED: invalid query format for tables file');
    } else {
      logger.error(err);
    }
  }
};

// tests connection and prints out Postgres server version,
// if successful; or else rejects with connection error:
(async () => {
  let dbConnection;
  try {

    dbConnection = await db.connect();
    logger.info(`successfully connected to postgres database ${config.DB_PROJNAME}.
    server version: ${dbConnection.client.serverVersion}
    port: ${config.PORT} host: ${config.DB_HOSTNAME}.`);

    logger.info('\n    Creating tables...');
    await createTables();
  } catch (err) {
    logger.error(`error connecting to postgres database ${config.DB_PROJNAME} error: ${err}`)
  } finally {
    if (dbConnection) {
      dbConnection.done();
    }
  }
})();

export default db;

