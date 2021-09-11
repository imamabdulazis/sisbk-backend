const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
// const { prisma } = require("../../utils/db");
const { PrismaClient } = require("@prisma/client");
const check_auth = require("../middleware/check_auth");
const e = require("express");
const prisma = new PrismaClient();

const MateriController = require("../controllers/materiController");

router.post("/", check_auth, MateriController.materi_post);

router.get("/", check_auth, MateriController.materi_get_all);

router.put("/:materiId", check_auth, async (req, res, next) => {
  try {
    const materi = await prisma.materi.update({
      where: {
        id: req.params.materiId,
      },
      data: {
        description: req.body.description,
        thumbnail: req.body.thumbnail,
        title: req.body.title,
        type: req.body.type,
        url: req.body.url,
        updated_at: new Date(),
      },
    });
    if (materi) {
      return res.status(200).json({
        status: 200,
        message: "ok",
        data: materi,
      });
    } else {
      return res.status(403).json({
        status: 403,
        message: "Gagal update materi",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: error,
    });
  }
});

router.delete("/:materiId", check_auth, MateriController.materi_delete);

router.put("/image/:materiId", (req, res, next) => {});

router.get("/:materiId", check_auth, MateriController.materi_detail);

module.exports = router;
