const express = require("express");
const router = express.Router();

router.post("/", (req, res, next) => {});

router.get("/", (req, res, next) => {});

router.put("/:groupId", (req, res, next) => {});

router.delete("/:groupId", (req, res, next) => {});

router.put("/image/:groupId", (req, res, next) => {});

module.exports = router;
