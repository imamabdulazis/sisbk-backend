const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
const { prisma } = require("../../utils/db");

// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  try {
    const findUserId = await prisma.users.findUnique({
      where: {
        id: req.body.user_id,
      },
    });
    console.log(req.body.user_id);
    if (findUserId) {
      const findSameQuizTitle = await prisma.quiz_type.findFirst({
        where: {
          title: req.body.title,
        },
      });
      if (findSameQuizTitle) {
        return res.status(409).json({
          status: 409,
          message: "Nama Jenis Quiz tidak boleh sama dengan sebelumnya",
        });
      } else {
        const CreateQuizType = await prisma.quiz_type.create({
          data: {
            id: uuid(),
            user_id: req.body.user_id,
            title: req.body.title,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });
        if (CreateQuizType) {
          return res.status(200).json({
            status: 200,
            message: "Berhasil menambah Tipe Quiz",
          });
        } else {
          return res.status(200).json({
            status: 403,
            message: "Gagal membuat Tipe Quiz Baru",
          });
        }
      }
    } else {
      return res.status(401).json({
        status: 401,
        message: "User tidak ditemukan",
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

//get all
router.get("/", async (req, res) => {
  try {
    const findAllQuizType = await prisma.quiz_type.findMany({
      select: {
        id: true,
        created_at: true,
        title: true,
        updated_at: true,
        users: {
          select: {
            id: true,
            name: true,
            previlage: true,
          },
        },
      },
      orderBy: {
        updated_at: "desc",
      },
    });
    if (findAllQuizType) {
      return res.status(200).json({
        status: 200,
        message: "Ok",
        data: findAllQuizType,
      });
    } else {
      return res.status(403).json({
        status: 403,
        message: "Gagal mendapatkan data quiz",
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

//detail
router.get("/:quiz_type_id", async (req, res) => {
  try {
    const findDetailQuizType = await prisma.quiz_type.findUnique({
      where: {
        id: req.params.quiz_type_id,
      },
      select: {
        id: true,
        title: true,
        users: {
          select: {
            id: true,
            name: true,
            previlage: true,
          },
        },
        created_at: true,
        updated_at: true,
      },
    });
    if (findDetailQuizType) {
      return res.status(200).json({
        status: 200,
        message: "Ok",
        data: findDetailQuizType,
      });
    } else {
      return res.status(401).json({
        status: 401,
        message: "Jenis Quiz tidak ditemukan",
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

//delete
router.delete("/:quiz_type_id", async (req, res) => {
  try {
    const deleteQuizType = await prisma.quiz_type.delete({
      where: {
        id: req.params.quiz_type_id,
      },
    });
    if (deleteQuizType) {
      return res.status(200).json({
        status: 200,
        message: "Berhasil hapus Quiz Type",
      });
    } else {
      return res.status(403).json({
        status: 403,
        message: "Gagal hapus Quiz Type",
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

//update
router.put("/:quiz_type_id", async (req, res) => {
  try {
    const findQuizType = await prisma.quiz_type.findUnique({
      where: {
        id: req.params.quiz_type_id,
      },
    });
    if (findQuizType) {
      const updateQuizType = await prisma.quiz_type.updateMany({
        where: {
          id: req.params.quiz_type_id,
        },
        data: {
          title: req.body.title,
          updated_at: new Date(),
        },
      });
      if (updateQuizType) {
        return res.status(200).json({
          status: 200,
          message: "Berhasil update Jenis Quiz",
        });
      } else {
        return res.status(403).json({
          status: 403,
          message: "Gagal update Jenis Quiz",
        });
      }
    } else {
      return res.status(403).json({
        status: 403,
        message: "Jenis Quiz tidak ditemukan",
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
