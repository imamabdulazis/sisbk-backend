const { PrismaClient } = require(".prisma/client");
const express = require("express");
const router = express.Router();

const { v4: uuid } = require("uuid");
const config = require("../../utils/config");
const check_auth = require("../middleware/check_auth");
const ContactController = require("../controllers/contactController");

const prisma = new PrismaClient();

router.post("/", check_auth, ContactController.createContact);

router.get("/", check_auth, ContactController.get_all_contact);

router.get("/:contactId", check_auth, ContactController.detailContact);

router.delete("/:contactId", check_auth, ContactController.deleteContact);

router.put("/:contactId", check_auth,ContactController.contactUpdate);

module.exports = router;
