module.exports = {
  PORT: 5000,
  JWTSECRET: process.env.NODE_ENV === 'production' ? process.env.JWTSECRET : 'secret key string',
  MONGOURL:
    process.env.NODE_ENV === 'production'
      ? process.env.MONGOURL
      : 'mongodb+srv://admin:12345@cluster0.kub27im.mongodb.net/shop',

  BASEURL: process.env.NODE_ENV === 'production' ? process.env.BASEURL : 'http://localhost:5000',
};
