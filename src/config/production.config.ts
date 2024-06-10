export default () => ({
  app: {
    port: parseInt(process.env.PORT) || 3005,
  },
  db: {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'kupipodariday',
  },
  auth: {
    secret: process.env.SECRET || '3c0573742887764d13908c3c32551e1d',
    expiresIn: '1d',
  },
});
