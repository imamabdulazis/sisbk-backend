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
    const allQuiz = await prisma.quiz.findMany({
      select: {
        id: true,
        question: true,
        quiz_type: {
          select: {
            id: true,
            title: true,
          },
        },
        correct_answer: true,
        incorrect_answers: true,
        updated_at: true,
        created_at: true,
      },
    });
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

///GET BY QUIZ TYPE
router.get("/:quiz_type_id", async (req, res, next) => {
  try {
    const allQuiz = await prisma.quiz.findMany({
      where: {
        quiz_type_id: req.params.quiz_type_id,
      },
      select: {
        id: true,
        question: true,
        quiz_type: {
          select: {
            id: true,
            title: true,
          },
        },
        correct_answer: true,
        incorrect_answers: true,
        updated_at: true,
        created_at: true,
      },
    });
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
    const existQuestion = await prisma.quiz.findFirst({
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
      const createQuiz = await prisma.quiz.create({
        data: {
          id: uuid(),
          question: req.body.question,
          quiz_type_id: req.body.quiz_type_id,
          correct_answer: req.body.correct_answer,
          incorrect_answers: req.body.incorrect_answers,
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
          message: "Quiz gagal di buat",
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
    const findQuiz = await prisma.quiz.findUnique({
      where: {
        id: req.params.quizId,
      },
    });
    if (findQuiz) {
      const updateQuiz = await prisma.quiz.update({
        where: {
          id: findQuiz.id,
        },
        data: {
          question: req.body.question,
          correct_answer: req.body.correct_answer,
          incorrect_answers: req.body.incorrect_answers,
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
    const findQuiz = await prisma.quiz.findUnique({
      where: {
        id: req.params.quizId,
      },
    });
    if (findQuiz) {
      const deleteQuiz = await prisma.quiz.delete({
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
