// const { PrismaClient } = require(".prisma/client");
const { v4: uuid } = require("uuid");
const config = require("../../utils/config");
const { prisma } = require("../../utils/db");
const { uploadImageToStorage } = require("../../utils/uploader");

// const prisma = new PrismaClient();

exports.materi_post = async (req, res) => {
  let generatedToken = uuid();
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
          thumbnail:
            req.body.thumbnail != null
              ? req.body.thumbnail
              : `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/thumbnail%2Fvideo_place.jpeg?alt=media&token=${generatedToken}`,
          title: req.body.title,
          type: req.body.type,
          url: req.body.url,
          file: req.body.file,
          view: 0,
          like: 0,
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
    const materi = await prisma.materi.findMany({
      select: {
        id: true,
        title: true,
        users: {
          select: {
            id: true,
            name: true,
          },
        },
        thumbnail: true,
        url: true,
        type: true,
        view: true,
        like: true,
        file: true,
        description: true,
        created_at: true,
        updated_at: true,
      },
    });
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

exports.materi_update = async (req, res, next) => {
  try {
    const findMateri = await prisma.materi.findUnique({
      where: {
        id: req.params.materiId,
      },
    });
    const updateMateri = await prisma.materi.update({
      where: {
        id: req.params.materiId,
      },
      data: {
        description: req.body.description,
        thumbnail:
          req.body.thumbnail != null
            ? req.body.thumbnail
            : findMateri.thumbnail,
        file: req.body.file != null ? req.body.file : findMateri.file,
        title: req.body.title,
        type: req.body.type,
        url: req.body.url,
        updated_at: new Date(),
      },
    });

    if (updateMateri) {
      return res.status(200).json({
        status: 200,
        message: "ok",
        data: findMateri,
      });
    } else {
      return res.status(403).json({
        status: 403,
        message: "Gagal update materi",
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
      select: {
        id: true,
        title: true,
        users: {
          select: {
            id: true,
            name: true,
            image_url: true,
            previlage: true,
          },
        },
        thumbnail: true,
        url: true,
        type: true,
        file: true,
        description: true,
        created_at: true,
        updated_at: true,
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

exports.materi_update_image = (req, res, next) => {
  let file = req.file;
  try {
    uploadImageToStorage(req.params.materiId, file, "materi")
      .then(async (success) => {
        const findMateri = await prisma.materi.update({
          where: {
            id: req.params.materiId,
          },
          data: {
            thumbnail: success,
          },
        });
        if (findMateri) {
          return res.status(200).json({
            status: 200,
            message: `Berhasil update foto materi`,
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

exports.materi_add_views = async (req, res, next) => {
  try {
    const findMateri = await prisma.materi.findUnique({
      where: {
        id: req.params.materiId,
      },
    });
    if (findMateri) {
      const updateMateri = await prisma.materi.update({
        where: {
          id: findMateri.id,
        },
        data: {
          view: findMateri.view + 1,
        },
      });
      if (updateMateri) {
        return res.status(200).json({
          status: 200,
          message: "Berhasil update jumlah views",
        });
      } else {
        return res.status(403).json({
          status: 403,
          message: "Materi tidak ditemukan",
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

exports.materi_add_likes = async (req, res, next) => {
  try {
    const findMateri = await prisma.materi.findUnique({
      where: {
        id: req.params.materiId,
      },
    });
    if (findMateri) {
      const updateMateri = await prisma.materi.update({
        where: {
          id: findMateri.id,
        },
        data: {
          like: findMateri.like + 1,
        },
      });
      if (updateMateri) {
        return res.status(200).json({
          status: 200,
          message: "Berhasil update jumlah likes",
        });
      } else {
        return res.status(403).json({
          status: 403,
          message: "Materi tidak ditemukan",
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
