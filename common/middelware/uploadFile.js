const fs = require("fs");
const path = require("path");
const multer = require("multer");

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif"
  ) {
    return cb(null, true);
  }
  return cb(new Error("File extension is invalid"));
};

const imageToBase64 = (file) => {
  const bitmap = fs.readFileSync(
    path.join(__dirname, `../../../images/${file.filename}`)
  );
  return Buffer.from(bitmap).toString("base64");
};

const generateRandomIntegerInRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    let uniqueIdentifier = generateRandomIntegerInRange(100, 1000000);

    cb(
      null,
      `${uniqueIdentifier}_${new Date().toISOString()}_${file.originalname}`
    );
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter,
});

module.exports = {
  upload,
  imageToBase64,
};
