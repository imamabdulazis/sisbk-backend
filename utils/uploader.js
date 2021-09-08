/**
 * Upload the image file to Google Storage
 * @param {File} file object that will be uploaded to Google Storage
 */

const { Storage } = require("@google-cloud/storage");
const config = require("../utils/config");
const { v4: uuid } = require("uuid");

const storage = new Storage({
  projectId: config.projectId,
  keyFilename: "./utils/account.json",
});

const uploadImageToStorage = (id, file, folder) => {
  const bucket = storage.bucket(config.storageBucket);
  return new Promise((resolve, reject) => {
    let generatedToken = uuid();
    if (!file) {
      reject("No image file");
    }
    // let newFileName = `${file.originalname}_${Date.now()}`;

    let fileUpload = bucket.file(`${folder}/` + id + `_${Date.now()}`);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      reject("Something is wrong! Unable to upload at the moment.");
      console.log(error);
    });

    const char = fileUpload.name?.split("/");

    blobStream.on("finish", () => {
      // const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
      const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${char[0]}%2F${char[1]}?alt=media&token=${generatedToken}`;
      resolve(url);
    });

    blobStream.end(file.buffer);
  });
};

module.exports = { uploadImageToStorage };
