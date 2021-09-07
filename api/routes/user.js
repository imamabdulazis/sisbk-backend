const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
const path = require("path");
const handlebars = require("handlebars");
const { hash } = require("bcryptjs");
const config = require("../../utils/config");
// const { PrismaClient } = require(".prisma/client");
const { readHTMLFile, smtpTransport } = require("../../utils/email");
const prisma = require("../../utils/db");

// const prisma = new PrismaClient();

router.post("/signup", async (req, res, next) => {
  try {
    let generatedToken = uuid();
    // const randomstring = Math.random().toString(36).slice(-8);
    const hashed = await hash(req.body.password, 10);
    const isEmail = await prisma.users.findFirst({
      where: {
        email: req.body.email,
      },
    });
    if (isEmail != null) {
      // console.log(isEmail);
      return res.status(409).json({
        status: 409,
        message: "Email sudah terdaftar",
      });
    } else {
      console.log("HAHAHAHAHAH");
      const users = await prisma.users.create({
        data: {
          id: uuid(),
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,
          password: hashed,
          address: req.body.address,
          previlage: req.body.previlage,
          image_url: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/users/users.png?alt=media&token=${generatedToken}`,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      if (users) {
        const postsDirectory = path.join(process.cwd(), "/public/email.html");
        return readHTMLFile(postsDirectory, function (err, html) {
          var template = handlebars.compile(html);
          var replacements = {
            username: req.body.username,
          };
          var htmlToSend = template(replacements);
          var mailOptions = {
            from: "sistinfor21@gmail.com",
            to: req.body.email,
            subject: `Selamat Datang ${req.body.name}`,
            html: htmlToSend,
          };
          return smtpTransport.sendMail(
            mailOptions,
            function (error, response) {
              if (error) {
                return res.status(500).json({
                  status: 500,
                  message: error,
                });
              } else {
                return res.status(200).json({
                  status: 200,
                  message: `Berhasil daftar ${req.body.email}`,
                });
              }
            }
          );
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
/**
 * Get ALL
 */
router.get("/", (req, res) => {});

module.exports = router;
