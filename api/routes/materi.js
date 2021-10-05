const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
// const { prisma } = require("../../utils/db");
// const { PrismaClient } = require("@prisma/client");
const check_auth = require("../middleware/check_auth");
// const prisma = new PrismaClient();
const Multer = require("multer");
const { uploadImageToStorage } = require("../../utils/uploader");
const MateriController = require("../controllers/materiController");

const multer = Multer({
  storage: Multer.memoryStorage(),
  // limits: {
  //   fileSize: 5 * 1024 * 1024, // no larger than 5mb
  // },
});

router.post("/", check_auth, MateriController.materi_post);

router.get("/", check_auth, MateriController.materi_get_all);

router.put("/:materiId", check_auth, MateriController.materi_update);

router.delete("/:materiId", check_auth, MateriController.materi_delete);

router.put(
  "/image/:materiId",
  multer.single("thumbnail"),
  check_auth,
  MateriController.materi_update_image
);

router.get("/:materiId", check_auth, MateriController.materi_detail);

router.post("/views/:materiId", MateriController.materi_add_views);

router.post("/likes/:materiId", MateriController.materi_add_likes);

module.exports = router;
