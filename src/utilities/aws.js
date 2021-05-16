const config = require("config");
const AWS = require("aws-sdk");

const uploadFile = async (username, file) => {
  //   Create s3 connection
  const s3 = new AWS.S3({
    accessKeyId: config.get("AWS.ID"),
    secretAccessKey: config.get("AWS.SECRET"),
  });

  //   const { filename } = file;

  // Setting up S3 upload parameters
  const params = {
    Bucket: config.get("AWS.BUCKET"),
    Key: `${username}/${file.filename}`, // File name you want to save as in S3
    Body: file.file,
    ACL: "public-read",
  };

  // Uploading files to the bucket
  s3.upload(params, function (err, data) {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
    return data.Location;
  });
};

module.exports = {
  uploadFile,
};
