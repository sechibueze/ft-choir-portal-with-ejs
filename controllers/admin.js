const express = require("express");
const router = express.Router();
const User = require("../model/user");

router.get("/", async (req, res) => {
  if (!(req.session.auth && req.session.isAdmin)) {
    req.session.message = "Unauthenticated"
    return res.redirect("/login")
  }
  let data = {
    query: req.query
  }

  if (req.query.action === "raw_delete_users") {
    await User.deleteMany({});
    return res.redirect("/signup");
  }

  return res.render("admin", { data });
})

router.post("/", (req, res) => {
  if (!(req.session.auth && req.session.isAdmin)) {
    req.session.message = "Unauthenticated"
    return res.redirect("/login")
  }

  User.findOneAndUpdate({ email: req.body.email, isDeleted: false }, { isAdmin: true }, { new: true }, (err, updUser) => {
    let data = {
      query: req.query,
      message: ""
    }
    if (err) {
      data.message = "Error in reseponse";
      return res.render("admin", { data })
    }

    if (!updUser) {
      data.message = "User not found";
      return res.render("admin", { data })
    }

    res.render("admin", { data })

  })



})

module.exports = router