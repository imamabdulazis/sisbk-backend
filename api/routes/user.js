const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const handlebars = require("handlebars");
const path = require("path");
const { v4: uuid } = require("uuid");
const config = require("../../utils/config");
const { readHTMLFile, smtpTransport } = require("../../utils/email");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/check_auth");
const Multer = require("multer");

const UserController = require("../controllers/userController");

const { uploadImageToStorage } = require("../../utils/uploader");
// const { prisma } = require("../../utils/db");

// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

const multer = Multer({
  storage: Multer.memoryStorage(),
  // limits: {
  //     fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  // }
});

/**Controller */

router.post("/signup", UserController.users_signup);

router.post("/login", UserController.users_login);

router.get("/", checkAuth, UserController.get_all_user);

router.get("/:userId", checkAuth, UserController.detail_user);

router.delete("/:userId", checkAuth, UserController.delete_user);

router.put(
  "/image/:userId",
  multer.single("image_profile"),
  UserController.update_image_profile
);

router.put(
  "/update_password/:userId",
  checkAuth,
  UserController.update_password
);

router.put("/profile/:userId", checkAuth, UserController.update_profile);

module.exports = router;
