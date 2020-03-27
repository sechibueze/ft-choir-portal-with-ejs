const express = require("express");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const session = require('express-session')
const router = express.Router();
const User = require("../model/user");

router.get('/', (req, res) => {
  const data = {

    status: false,
    message: "" || req.session.message,
    errors: ""
  }
  return res.render('login', { data });
});


/**
 * @method - POST
 * @param - /login
 * @description - User login
 */
const loginValidations = [
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Please enter a valid password").isLength({
    min: 6
  })
];
router.post("/", loginValidations, async (req, res) => {
  const errors = validationResult(req);
  console.log("Login user", req.body)

  if (!errors.isEmpty()) {
    const data = {

      status: false,
      message: "",
      error: "Please attend to the following errors",
      errors: errors.array()
    }
    console.log("error", data.errors)
    return res.render('login', { data });
    // return res.status(400).json({
    //   status: false,
    //   message: errors.array()
    // });
  }

  const { email, password } = req.body;
  console.log("Users Login:: passed validation", email)
  try {
    let user = await User.findOne({ email, isDeleted: false });
    if (!user) {
      const data = {
        status: false,
        message: "",
        error: "User Not Exist"
      }
      console.log("User", user)
      return res.render('login', { data });
    }
    // return res.status(400).json({
    //   status: false,
    //   message: "User Not Exist"
    // });

    const isMatch = user.comparePassword(password);
    if (!isMatch) {
      const data = {
        status: false,
        message: "",
        error: "Incorrect Username or Password !"
      }
      // console.log("error", data.errors)
      return res.render('login', { data });
    }
    // return res.status(400).json({
    //   status: false,
    //   message: "Incorrect Username or Password !"
    // });

    // Make sure the user has been verified
    // if (!user.isVerified) return res.status(401).json({ status: false, message: 'Your account has not been verified.' });


    // store user in session
    req.session.auth = true;
    req.session.user = user;
    return res.redirect("/dashboard");
    // const payload = {
    //   user: {
    //     id: user.id,
    //     isAdmin: user.isAdmin
    //   }
    // };

    // jwt.sign(
    //   payload,
    //   process.env.JWT_SECRET,
    //   {
    //     expiresIn: 3600
    //   },
    //   (err, token) => {
    //     if (err) throw err;
    //     res.status(200).json({
    //       status: true,
    //       message: 'login - data complete ',
    //       user,
    //       token
    //     });
    //   }
    // );
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: false,
      message: "Server Error"
    });
  }
}
);

module.exports = router;