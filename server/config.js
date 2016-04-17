const config = {
  mongoURL: process.env.NODE_ENV == 'test' ? process.env.TEST_MONGO_URL : process.env.MONGO_URL,
  port: 8000 || process.env.PORT
};

export default config;
