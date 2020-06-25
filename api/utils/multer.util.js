const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const crypto = require("crypto");

AWS.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

let storage;

const local_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/profile");
  },
  filename: (req, file, cb) => {
    const custom_filename = crypto.randomBytes(15).toString("hex");
    const file_extension = file.originalname.split(".")[1];
    cb(null, `${custom_filename}.${file_extension}`);
  }
});

const cloud_storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET_NAME,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  acl: "public-read",
  key: function (req, file, cb) {
    const custom_filename = crypto.randomBytes(15).toString("hex");
    const file_extension = file.originalname.split(".")[1];
    cb(null, `profile/${custom_filename}.${file_extension}`);
  }
});

if (process.env.NODE_ENV === "production") {
  storage = cloud_storage;
} else {
  storage = local_storage;
}

module.exports = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 2 }
});
