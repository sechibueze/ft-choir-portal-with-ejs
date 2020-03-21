const express = require("express");
// const cloudinary = require('cloudinary').v2;
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "ftc",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 250, height: 250, crop: "limit" }]
});
const parser = multer({ storage: storage });
const User = require('../model/user')
const router = express.Router();

router.post('/', parser.single("profileImg"), (req, res) => {
  // console.log('req file', req.file) // to see what is returned to you
  console.log('req body', req.body.id)
  const image = {};
  image.url = req.file.url;
  image.id = req.file.public_id;
  User.findOneAndUpdate({ id: req.body.id }, { profileImag: image.url }, { new: true }, (err, updUser) => {
    console.log('updUser', updUser)
    if (err) return res.json({ status: false, message: 'Not updated', data: err })

    return res.json({ status: true, message: 'Success updated' })
  })
});

module.exports = router;