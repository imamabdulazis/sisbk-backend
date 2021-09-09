const express = require("express");
const bcrypt = require("bcryptjs");
const handlebars = require("handlebars");
const path = require("path");
const { v4: uuid } = require("uuid");
const config = require("../../utils/config");
const { readHTMLFile, smtpTransport } = require("../../utils/email");
const jwt = require("jsonwebtoken");
const { prisma } = require("../../utils/db");
const { uploadImageToStorage } = require("../../utils/uploader");
// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

exports.users_signup = async (req, res, next) => {
  try {
    let generatedToken = uuid();
    // const randomstring = Math.random().toString(36).slice(-8);
    const hashed = await bcrypt.hash(req.body.password, 10);
    const isEmail = await prisma.users.findFirst({
      where: {
        email: req.body.email,
      },
    });
    if (isEmail != null) {
      return res.status(409).json({
        status: 409,
        message: "Email sudah terdaftar",
      });
    } else {
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
};

exports.users_login = async (req, res, next) => {
  console.log("Request", req.body);
  try {
    console.log(req.body);
    const user = await prisma.users.findFirst({
      where: {
        email: req.body.email,
      },
    });
    if (!user)
      return res
        .status(401)
        .json({ status: 401, message: "Email belum terdaftar" });
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid)
      return res
        .status(401)
        .json({ status: 401, message: "Username atau password salah" });

    const token = jwt.sign(
      {
        email: user.email,
        userId: user.id,
      },
      "secret",
      {
        expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      }
    );

    return res.status(200).json({
      status: 200,
      message: "ok",
      token: token,
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: error,
    });
  }
};

exports.get_all_user = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        address: true,
        image_url: true,
        previlage: true,
        created_at: true,
      },
    });
    if (users) {
      return res.status(200).json({
        status: 200,
        message: "ok",
        data: users,
      });
    }
    return res.status(404).json({
      status: 404,
      message: "Data user tidak ditemukan",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: error,
    });
  }
};

exports.detail_user = async (req, res, next) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: req.params.userId,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        address: true,
        image_url: true,
        previlage: true,
        created_at: true,
      },
    });
    if (user) {
      return res.status(200).json({
        status: 200,
        message: "ok",
        data: user,
      });
    }
    return res.status(403).json({
      status: 403,
      message: "User tidak ditemukan",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: error,
    });
  }
};

exports.delete_user = async (req, res, next) => {
  try {
    const delUsers = await prisma.users.findUnique({
      where: {
        id: req.params.userId,
      },
    });

    if (delUsers) {
      await prisma.users.delete({
        where: {
          id: req.params.userId,
        },
      });
      return res.status(200).json({
        status: 200,
        message: "Berhasil hapus user",
      });
    }
    return res.status(403).json({
      status: 403,
      message: "User tidak ditemukan",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: error,
    });
  }
};

exports.update_password = async (req, res, next) => {
  try {
    const users = await prisma.users.findUnique({
      where: {
        id: req.params.userId,
      },
    });
    if (users) {
      return bcrypt.compare(
        req.body.password,
        users.password,
        async function (err, result) {
          //bug kadang err=null
          if (!result) {
            return res.status(401).json({
              status: 401,
              message: "Password lama tidak valid",
            });
          }
          if (req.body.password == req.body.new_password) {
            return res.status(409).json({
              status: 409,
              message: "Password baru tidak boleh sama!",
            });
          }
          if (result) {
            const hashed = await bcrypt.hash(req.body.new_password, 10);
            const user = await prisma.users.update({
              where: {
                id: users.id,
              },
              data: {
                password: hashed,
              },
            });
            if (user) {
              return res.status(200).json({
                status: 200,
                message: "Ganti password berhasil",
              });
            }
            res.status(403).json({
              status: 403,
              message: "Ganti password gagal, silahkan coba kembali",
            });
          }
        }
      );
    } else {
      return res.status(403).json({
        status: 403,
        message: "User tidak ditemukan.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: error,
    });
  }
};

exports.update_image_profile = async (req, res, next) => {
  let file = req.file;
  try {
    uploadImageToStorage(req.params.userId, file, "users")
      .then(async (success) => {
        const users = await prisma.users.update({
          where: {
            id: req.params.userId,
          },
          data: {
            image_url: success,
          },
        });
        if (users) {
          return res.status(200).json({
            status: 200,
            message: `Berhasil update foto profil`,
          });
        } else {
          return res.status(500).json({ status: 500, message: err });
        }
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({ status: 500, message: error });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: error,
    });
  }
};
