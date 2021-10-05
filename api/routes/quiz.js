const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
const check_auth = require("../middleware/check_auth");
const config = require("../../utils/config");
const { prisma } = require("../../utils/db");

// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

router.get("/", async (req, res, next) => {
  try {
    const allQuiz = await prisma.quiz_question.findMany({});
    if (allQuiz) {
      return res.status(200).json({
        status: 200,
        message: "Ok",
        data: allQuiz,
      });
    } else {
      return res.status(403).json({
        status: 403,
        message: "Quiz gagal di dapatkan",
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

router.post("/", async (req, res, next) => {
  try {
    const existQuestion = await prisma.quiz_question.findFirst({
      where: {
        question: req.body.question,
      },
    });
    if (existQuestion) {
      return res.status(403).json({
        status: 403,
        message: "Pertanyaan quiz tidak boleh sama",
      });
    } else {
      const createQuiz = await prisma.quiz_question.create({
        data: {
          id: uuid(),
          question: req.body.question,
          answer: req.body.answer,
          point: req.body.point,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      if (createQuiz) {
        return res.status(200).json({
          status: 200,
          message: "Berhasil membuat quiz",
        });
      } else {
        return res.status(403).json({
          status: 403,
          message: "Quiz gagal di dapatkan",
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

router.put("/:quizId", async (req, res, next) => {
  try {
    const findQuiz = await prisma.quiz_question.findUnique({
      where: {
        id: req.params.quizId,
      },
    });
    if (findQuiz) {
      const updateQuiz = await prisma.quiz_question.update({
        where: {
          id: findQuiz.id,
        },
        data: {
          question: req.body.question,
          answer: req.body.answer,
          point: req.body.point,
        },
      });
      if (updateQuiz) {
        return res.status(200).json({
          status: 200,
          message: "Berhasil update quiz",
        });
      } else {
        return res.status(403).json({
          status: 403,
          message: "Gagal update quiz",
        });
      }
    } else {
      return res.status(403).json({
        status: 403,
        message: "Quiz tidak ditemukan",
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

router.delete("/:quizId", async (req, res, next) => {
  try {
    const findQuiz = await prisma.quiz_question.findUnique({
      where: {
        id: req.params.quizId,
      },
    });
    if (findQuiz) {
      const deleteQuiz = await prisma.quiz_question.delete({
        where: {
          id: req.params.quizId,
        },
      });
      if (deleteQuiz) {
        return res.status(200).json({
          status: 200,
          message: "Berhasil hapus quiz",
        });
      } else {
        return res.status(403).json({
          status: 403,
          message: "Gagal hapus quiz",
        });
      }
    } else {
      return res.status(403).json({
        status: 403,
        message: "Quiz tidak ditemukan",
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
