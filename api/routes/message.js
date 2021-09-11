const express = require("express");
const router = express.Router();

router.post("/", (req, res, next) => {});

router.get("/", (req, res, next) => {});

router.put("/:messageId", (req, res, next) => {});

router.delete("/:messageId", (req, res, next) => {});

router.put("/image/:messageId", (req, res, next) => {});

module.exports = router;
