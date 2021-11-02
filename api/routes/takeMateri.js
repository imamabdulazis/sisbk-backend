const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
const { prisma } = require("../../utils/db");
// const { PrismaClient } = require("@prisma/client");
const check_auth = require("../middleware/check_auth");
// const prisma = new PrismaClient();

router.post("/", check_auth, async (req, res, next) => {
  try {
    const findTakeMateri = await prisma.take_materi.findFirst({
      where: {
        student_id: req.body.student_id,
      },
    });
    if (findTakeMateri) {
      const findMateriItems = await prisma.take_materi_items.findFirst({
        where: {
          materi_id: req.body.materi_id,
        },
      });
      if (findMateriItems)
        return res.status(403).json({
          status: 403,
          message: "Anda sudah mengikuti materi ini, silahkan coba materi lain",
        });
      const materiItems = await prisma.take_materi_items.create({
        data: {
          id: uuid(),
          take_materi_id: findTakeMateri.id,
          materi_id: req.body.materi_id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      if (materiItems) {
        return res.status(200).json({
          status: 200,
          message: "Berhasil gabung materi",
        });
      } else {
        return res.status(403).json({
          status: 403,
          message: "Gagal mengikuti materi, silahkan coba kembali",
        });
      }
    } else {
      const takeMateri = await prisma.take_materi.create({
        data: {
          id: uuid(),
          student_id: req.body.student_id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      if (takeMateri) {
        const findMateriItems = await prisma.take_materi_items.findFirst({
          where: {
            materi_id: req.body.materi_id,
          },
        });
        if (findMateriItems)
          return res.status(403).json({
            status: 403,
            message:
              "Anda sudah mengikuti materi ini, silahkan coba materi lain",
          });
        const materiItems = await prisma.take_materi_items.create({
          data: {
            id: uuid(),
            take_materi_id: takeMateri.id,
            materi_id: req.body.materi_id,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });
        if (materiItems) {
          return res.status(200).json({
            status: 200,
            message: "Berhasil gabung materi",
          });
        } else {
          return res.status(403).json({
            status: 403,
            message: "Gagal mengikuti materi, silahkan coba kembali",
          });
        }
      } else {
        return res.status(403).json({
          status: 403,
          message: "Gagal mengikuti materi, silahkan coba kembali",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: error,
    });
  }
});

router.delete("/:tkItemsId", check_auth, async (req, res, next) => {
  try {
    const findTakeMateri = await prisma.take_materi_items.findUnique({
      where: {
        id: req.params.tkItemsId,
      },
    });
    if (findTakeMateri) {
      const deltkmaterItems = await prisma.take_materi_items.delete({
        where: {
          id: req.params.tkItemsId,
        },
      });
      if (deltkmaterItems) {
        return res.status(200).json({
          status: 200,
          message: "Berhasil hapus materi ini",
        });
      } else {
        return res.status(403).json({
          status: 403,
          message: "Gagal menghapus materi, silahkan coba kembali",
        });
      }
    } else {
      return res.status(403).json({
        status: 403,
        message: "Gagal menghapus materi, silahkan coba kembali",
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

router.get("/", check_auth, async (req, res, next) => {
  try {
    const materiItems = await prisma.take_materi_items.findMany({});
    if (materiItems) {
      return res.status(200).json({
        status: 200,
        message: "Ok",
        data: materiItems,
      });
    } else {
      return res.status(403).json({
        status: 403,
        message: "Gagal mendapatkan materi",
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

router.get("/user/:userId", async (req, res, next) => {
  try {
    const idMateri = await prisma.take_materi.findFirst({
      where: {
        student_id: req.params.userId,
      },
    });
    const materiItems = await prisma.take_materi_items.findMany({
      where: {
        take_materi_id: idMateri.id,
      },
      select: {
        id: true,
        materi: {
          select: {
            id: true,
            title: true,
            users: {
              select: {
                id: true,
                name: true,
                image_url: true,
                previlage: true,
              },
            },
            thumbnail: true,
            url: true,
            type: true,
            view: true,
            like: true,
            file: true,
            description: true,
            created_at: true,
            updated_at: true,
          },
        },
        created_at: true,
        updated_at: true,
      },
    });
    if (materiItems) {
      return res.status(200).json({
        status: 200,
        message: "Ok",
        length: materiItems.length,
        data: materiItems,
      });
    } else {
      return res.status(403).json({
        status: 403,
        message: "Gagal mendapatkan materi",
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

module.exports = router;
