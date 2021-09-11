const express = require("express");
const Multer = require("multer");
const { v4: uuid } = require("uuid");
const { uploadImageToStorage } = require("../../utils/uploader");
const check_auth = require("../middleware/check_auth");
const router = express.Router();

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb
  },
});

router.post("/", multer.single("file"), check_auth, (req, res, next) => {
  let file = req.file;
  let genUuid = uuid();
  try {
    uploadImageToStorage(genUuid, file, req.body.folder)
      .then(async (success) => {
        return res.status(200).json({
          id: genUuid,
          folder: req.body.folder,
          url: success,
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({ status: 500, message: error });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: error,
    });
  }
});

module.exports = router;
