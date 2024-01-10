const cloudinary = require("cloudinary").v2;
var fs = require("fs");
// const AppError = require("./appError");
const config = require("../config/configuration");

cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret,
});

const uploadToCloudinary = async (fileString) => {
  try {
    const { uploader } = cloudinary;

    const res = await uploader.upload(fileString);

    fs.unlinkSync(fileString);

    return res;
  } catch (error) {
    throw new error();
  }
};

const deleteImage = async (publicId) => {
  try {
    const { uploader } = cloudinary;
    const res = await uploader.destroy(publicId);

    return res;
  } catch (error) {
    throw new error();
  }
};
module.exports = { uploadToCloudinary, deleteImage, cloudinary };
