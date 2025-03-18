export const config = {
  port: process.env.PORT || 3000,
  dbUrl: process.env.DB_URL || 'mongodb://localhost:27017',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  jwtSecret: process.env.JWT_SECRET || 'default-secret-key'
};