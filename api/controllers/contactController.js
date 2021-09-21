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

exports.createContact = async (req, res, next) => {
  try {
    let generatedToken = uuid();
    const isContact = await prisma.contact_teacher.findFirst({
      where: {
        name: req.body.name,
      },
    });

    if (isContact) {
      return res.status(409).json({
        status: 409,
        message: `Nama ${req.body.name} sudah terdaftar`,
      });
    } else {
      const contact = await prisma.contact_teacher.create({
        data: {
          id: uuid(),
          name: req.body.name,
          author_id: req.body.author_id,
          email: req.body.email,
          address: req.body.address,
          edu_title: req.body.edu_title,
          image_url:
            req.body.image_url != null
              ? req.body.image_url
              : `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/users%2Fusers.png?alt=media&token=${generatedToken}`,
          job_desc: req.body.job_desc,
          phone: req.body.phone,
        },
      });
      if (contact) {
        return res.status(200).json({
          status: 200,
          message: "Berhasil tambah kontak guru",
          data: contact,
        });
      } else {
        return res.status(403).json({
          status: 403,
          message: "Gagal menambah kontak guru",
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

exports.detailContact = async (req, res, next) => {
  try {
    const contact = await prisma.contact_teacher.findUnique({
      where: {
        id: req.params.contactId,
      },
    });
    if (contact) {
      return res.status(200).json({
        status: 200,
        message: "ok",
        data: contact,
      });
    } else {
      return res.status(403).json({
        status: 403,
        message: "Kontak tidak ditemukan",
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

exports.contactUpdate = async (req, res, next) => {
  try {
    const findContact = await prisma.contact_teacher.findUnique({
      where: {
        id: req.params.contactId,
      },
    });
    if (findContact) {
      const updateContact = await prisma.contact_teacher.update({
        where: {
          id: findContact.id,
        },
        data: {
          name: req.body.name,
          author_id: req.body.author_id,
          email: req.body.email,
          address: req.body.address,
          edu_title: req.body.edu_title,
          job_desc: req.body.job_desc,
          phone: req.body.phone,
          image_url:
            req.body.image_url != null
              ? req.body.image_url
              : findContact.image_url,
        },
      });
      if (updateContact) {
        return res.status(200).json({
          status: 200,
          message: "Berhasil update kontak",
        });
      } else {
        return res.status(403).json({
          status: 403,
          message: "Gagal update kontak",
        });
      }
    } else {
      return res.status(403).json({
        status: 403,
        message: "Kontak tidak ditemukan",
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

exports.deleteContact = async (req, res, next) => {
  try {
    const delCont = await prisma.contact_teacher.delete({
      where: {
        id: req.params.contactId,
      },
    });
    if (delCont) {
      return res.status(200).json({
        status: 200,
        message: "Berhasil hapus kontak guru",
      });
    } else {
      return res.status(403).json({
        status: 403,
        message: "Gagal hapus kontak guru",
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

exports.get_all_contact = async (req, res, next) => {
  try {
    const contacts = await prisma.contact_teacher.findMany({});
    if (contacts) {
      return res.status(200).json({
        status: 200,
        message: "Ok",
        data: contacts,
      });
    } else {
      return res.status(409).json({
        status: 409,
        message: "Gagal mendapatkan data kontak guru",
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
