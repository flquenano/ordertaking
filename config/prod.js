module.exports = {
  mongoURI: process.env.MONGO_URI,
  aws: {
    access_key_id: process.env.AWS_ACCESS_KEY_ID,
    bucket_name: process.env.AWS_BUCKET_NAME,
    region: process.env.AWS_REGION,
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY
  },
  jwt: {
    cookie_expires_in: process.env.JWT_COOKIE_EXPIRES_IN,
    expires_in: process.env.JWT_EXPIRES_IN,
    secret: process.env.JWT_SECRET
  }
};
