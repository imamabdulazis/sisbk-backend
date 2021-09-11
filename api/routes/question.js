const express = require("express");
const router = express.Router();

router.post("/", (req, res, next) => {});

router.get("/", (req, res, next) => {});

router.put("/:questionId", (req, res, next) => {});

router.delete("/:questionId", (req, res, next) => {});

router.put("/image/:questionId", (req, res, next) => {});

module.exports = router;
