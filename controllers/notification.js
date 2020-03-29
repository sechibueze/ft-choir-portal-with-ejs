const express = require("express");
const Notification = require("../model/notification");
const router = express.Router();


router.post("/", async (req, res) => {
  let data = {
    message: ""
  }
  try {
    const { message, source } = req.body;
    const notification = new Notification({ message, source });
    const _notification = await notification.save();
    console.log("Notification saved succes::", _notification)
    return res.redirect("/dashboard");
  } catch (error) {
    data.message = "Server:: error - could not send notification";
    return res.render("notify", { data });
  }
});

// /notify/:id
router.get("/:id", async (req, res) => {
  let data = {
    message: ""
  }
  try {
    const { id } = req.params;
    Notification.findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true }, (err, result) => {

      return res.redirect("/dashboard");
    })

  } catch (error) {
    data.message = "Server:: error - could not send notification";
    return res.render("notify", { data });
  }
});


module.exports = router;