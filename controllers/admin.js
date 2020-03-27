const express = require("express");
// const { check, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../model/user");

router.get("/", (req, res) => {
  // if (!req.session.auth) {
  //   req.session.message = "Unauthenticated"
  //   return res.redirect("/login")
  // }
  console.log("datsboard user", req.session)
  console.log("Dashboard query", req.query)
  const data = {
    query: req.query
    // user: req.session.user 
  }
  res.render("admin", { data })
})

router.post("/", (req, res) => {
  // if (!req.session.auth) {
  //   req.session.message = "Unauthenticated"
  //   return res.redirect("/login")
  // }

  User.findOneAndUpdate({ email: req.body.email, isDeleted: false }, { isAdmin: true }, { new: true }, (err, updUser) => {
    console.log('updUser', updUser)
    if (err) {
      const data = {
        query: req.query,
        message: "Error in reseponse"
      }
      return res.render("admin", { data })
    }
    const data = {
      query: req.query,
      message: "Success "
    }
    res.render("admin", { data })

    // console.log("UpdUser", updUser.church_info)
    // req.session.user = updUser;
    // return res.redirect("/dashboard");
    // if (err) return res.json({ status: false, message: 'Not updated', data: err })

    // return res.json({ status: true, message: 'Success updated', data: updUser })
  })


  // console.log("datsboard user", req.session)
  // console.log("Dashboard query", req.query)

})

module.exports = router