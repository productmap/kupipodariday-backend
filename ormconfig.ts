export default {
  type: 'postgres',
  host: '127.0.0.1',
  port: 5433,
  username: 'postgres',
  password: 'postgres',
  database: 'wishes',
  entities: ['src/**/*.entity.ts'],
  synchronize: false,
};
