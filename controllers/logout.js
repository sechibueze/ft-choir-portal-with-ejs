
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  // req.session = null;
  req.session.destroy();
  // console.log("Logout just destroyed session::see", req.session)
  return res.redirect("/");
});


module.exports = router;