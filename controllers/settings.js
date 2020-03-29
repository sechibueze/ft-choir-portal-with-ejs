const express = require("express");
const router = express.Router();
const User = require("../model/user");
const Notification = require("../model/notification");

router.get("/", async (req, res) => {
  let data = {
    message: req.session.message || "Irreversible:: Be sure before you do this"
  }

  return res.render("settings", { data });
})

// /settings
router.post("/", async (req, res) => {
  const { table } = req.body;

  if (table === "user") {
    await User.deleteMany({})
    req.session.message = "User table deleted";

    res.redirect("/settings");
  } else if (table === "notification") {
    await Notification.deleteMany({});
    req.session.message = "Notification table deleted";

    return res.redirect("/settings");
  } else {

    req.session.message = "Be careful !!!";
    return res.redirect("/settings");
  }


});

// /settings/admin
router.post("/admin", (req, res) => {
  User.findOneAndUpdate({ email: req.body.email, isDeleted: false }, { isAdmin: true }, { new: true }, (err, updUser) => {

    if (err) {
      req.session.message = "Error in reseponse";
      return res.redirect("/settings");
    }

    if (updUser) {
      req.session.message = `${updUser.email} has been made admin`;
      return res.redirect("/settings");
    }

    req.session.message = "Error in reseponse";
    return res.redirect("/settings");
  })

});

module.exports = router