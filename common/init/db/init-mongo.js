const mongoose = require("mongoose");
const configurations = require("../../config/configuration");
const logger = require("../../config/logger");

// establish connection to db
const connectMongoDB = async () => {
  try {
    await mongoose.connect(configurations.mongoURI, {
    });

    mongoose.connection.on("connected", () => {
      var db = mongoose.connections[0].db;
      bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: `${configurations.gridfsBucketName}`,
      });
    });

    logger.info("MongoDB connected");
  } catch (err) {
    logger.error(err.message);
    process.exit(1);
  }
};

module.exports = connectMongoDB;
