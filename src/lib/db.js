import postgres from 'postgres';

const createSqlInstance = () => {
  const urlString = process.env.POSTGRES_URL;
  if (!urlString) return postgres({ ssl: 'require', max: 10 });

  try {
    const url = new URL(urlString);
    return postgres({
      host: url.hostname,
      port: url.port ? parseInt(url.port) : 5432,
      database: url.pathname.substring(1),
      username: url.username,
      password: url.password,
      ssl: 'require',
      max: 10,
      idle_timeout: 20,
      connect_timeout: 30,
    });
  } catch (e) {
    return postgres(urlString, {
      ssl: 'require',
      max: 10,
      idle_timeout: 20,
      connect_timeout: 30,
    });
  }
};

const sql = createSqlInstance();

export default sql;
