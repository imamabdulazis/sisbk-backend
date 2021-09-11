const { v4: uuid } = require("uuid");
const { readHTMLFile, smtpTransport } = require("../../utils/email");
const { prisma } = require("../../utils/db");
const { uploadImageToStorage } = require("../../utils/uploader");

exports.materi_post = async (req, res) => {
  try {
    const isUser = await prisma.users.findUnique({
      where: {
        id: req.body.author_id,
      },
    });
    if (isUser) {
      const materi = await prisma.materi.create({
        data: {
          id: uuid(),
          author_id: req.body.author_id,
          description: req.body.description,
          thumbnail: req.body.thumbnail,
          title: req.body.title,
          type: req.body.type,
          url: req.body.url,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      if (materi) {
        return res.status(200).json({
          status: 200,
          message: "ok",
          data: materi,
        });
      } else {
        return res.status(403).json({
          status: 403,
          message: "Gagal tambah materi",
        });
      }
    } else {
      return res.status(403).json({
        status: 403,
        message: "User tidak ditemukan",
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

exports.materi_get_all = async (req, res, next) => {
  try {
    const materi = await prisma.materi.findMany({});
    if (materi) {
      return res.status(200).json({
        status: 200,
        message: "ok",
        length: materi.length,
        data: materi,
      });
    } else {
      return res.status(403).json({
        status: 403,
        message: "Gagal retrieve materi",
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

exports.materi_delete = async (req, res, next) => {
  try {
    const findMateri = await prisma.materi.findUnique({
      where: {
        id: req.params.materiId,
      },
    });
    if (findMateri) {
      const materi = await prisma.materi.delete({
        where: {
          id: req.params.materiId,
        },
      });
      if (materi) {
        return res.status(200).json({
          status: 200,
          message: "Berhasil hapus materi",
        });
      } else {
        return res.status(403).json({
          status: 403,
          message: "Gagal hapus materi",
        });
      }
    } else {
      return res.status(403).json({
        status: 403,
        message: "Materi tidak ditemukan",
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

exports.materi_detail = async (req, res, next) => {
  try {
    const materi = await prisma.materi.findUnique({
      where: {
        id: req.params.materiId,
      },
    });
    if (materi) {
      return res.status(200).json({
        status: 200,
        message: "oke",
        data: materi,
      });
    } else {
      return res.status(403).json({
        status: 403,
        message: "Materi tidak ditemukan",
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
