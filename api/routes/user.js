const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
const { hash } = require("bcryptjs");
const config = require("../../utils/config");
const { PrismaClient } = require(".prisma/client");

const prisma = new PrismaClient();

router.post("/signup", async(req, res, next) => {
  var randomstring = Math.random().toString(36).slice(-8);
  const hashed=await hash(randomstring,10),
  const isEmail=await prisma.users.findFirst({
    where:{
      email:req.body.email
    }
  })
  if(isEmail!=null){
    return res.status(409).json({
      status:409,
      message:'Email sudah terdaftar'
    })
  }else{
  const users=await prisma.users.create({
    data:{
      id:uuid(),
      password:hashed,
      address:req.body.address,
      email:req.body.email,
      image_url:`https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/users/users.png?alt=media&token=${generatedToken}`,
      created_at: new Date(),
      updated_at: new Date(),
    }
  })
}
});
/**
 * Get ALL
 */
router.get("/", (req, res) => {});

module.exports = router;
