import postgres from 'postgres';

const getPostgresConfig = () => {
  if (!process.env.POSTGRES_URL) return {};
  try {
    const url = new URL(process.env.POSTGRES_URL);
    return {
      host: url.hostname,
      port: parseInt(url.port),
      database: url.pathname.substring(1),
      username: url.username,
      password: url.password,
    };
  } catch (e) {
    return process.env.POSTGRES_URL;
  }
};

const sql = postgres(getPostgresConfig(), {
  ssl: 'require',
  max: 10,
  idle_timeout: 20,
  connect_timeout: 30,
});

export default sql;
