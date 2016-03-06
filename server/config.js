const config = {
  mongoURL: 'mongodb://optc:optcpass@ds023478.mlab.com:23478/optc' || process.env.MONGO_URL,
  port: 8000 || process.env.PORT
};

export default config;
