const express = require("express");
const router = express.Router();

router.post("/", (req, res, next) => {});

router.get("/", (req, res, next) => {});

router.put("/:quizId", (req, res, next) => {});

router.delete("/:quizId", (req, res, next) => {});

router.put("/image/:quizId", (req, res, next) => {});

module.exports = router;
