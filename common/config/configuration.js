require("dotenv").config();
const mongoURI =
  process.env.NODE_ENV === "dev"
    ? process.env.MONGO_URI_DEV ||
      "mongodb+srv://upskilling:1234@cluster0.q6drz.mongodb.net/booking?retryWrites=true&w=majority"
    : process.env.MONGO_URI_LOCAL ||
      "mongodb://localhost:27017/booking";

const config = {
  port: parseInt(process.env.PORT, 0) || 3000,
  mongoURI,
  gridfsBucketName: process.env.GRIDFS_BUCKET_NAME || "booking",
  hostname: process.env.HOSTNAME,
  jwt: {
    key: process.env.JWT_SECRET || "secret",
    expire: process.env.JWT_EXPIRE || "14d",
  },
  authType: {
    admin: process.env.AUTH_TYPE_ADMIN || "admin",
    portal: process.env.AUTH_TYPE_PORTAL || "portal",
  },
  baseUrl_V0: process.env.BASE_API_URL_V0 || "/api/v0",
  salt: process.env.BCRYPT_SALT_ROUNDS || 10,
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    fubsBucketName: process.env.BUCKET,
  },
  sendgrid: {
    apikey: process.env.SENDGRID_API_KEY,
  },
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT || ""),
  SMTP_USER_NAME: process.env.SMTP_USER_NAME,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_SENDER: process.env.SMTP_SENDER,
  SMTP_RECEIVER: process.env.SMTP_RECEIVER,
};

module.exports = config;
