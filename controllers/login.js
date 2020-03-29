const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../model/user");

/*
* @route GET /login
* @descrription render login form
* @access public
*/
router.get('/', (req, res) => {
  const data = {
    message: req.session.message || "",
    error: ""
  }
  return res.render('login', { data });
});


/*
* @route POST /login
* @descrription handle user login request
* @access public
*/
const loginValidations = [
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Please enter a valid password").isLength({
    min: 6
  })
];
router.post("/", loginValidations, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const data = {
      message: "",
      error: "Please attend to the following errors",
      errors: errors.array()
    }
    return res.render('login', { data });
  }

  const { email, password } = req.body;
  console.log("Users Login:: passed validation", email);
  try {
    let user = await User.findOne({ email, isDeleted: false });
    if (!user) { //user = null
      const data = {
        error: "",
        message: "User does not exist"
      }
      return res.render('login', { data });
    }

    const isMatch = user.comparePassword(password);
    if (!isMatch) {
      const data = {
        error: "",
        message: "Incorrect Email or Password !"
      }
      return res.render('login', { data });
    }
    // User login details are correct
    req.session.auth = true;
    req.session.isAdmin = user.isAdmin;
    req.session.user = user;

    return res.redirect("/dashboard");
  } catch (e) {
    const data = {
      error: "",
      message: "Ooops! server error"
    }
    return res.render('login', { data });
  }
}
);

module.exports = router;