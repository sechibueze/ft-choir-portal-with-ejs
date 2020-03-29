const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../model/user");
/*
* @route GET /signup
*@descrription render signup form
* @access public
*/
router.get('/', (req, res) => {
  const data = {
    message: req.session.message || ""
  }
  return res.render('signup', { data });
});


/*
* @route POST /signup
* @descrription process user signup request
* @access public
*/
const signupValidations = [
  check("firstname", "Please Enter your Firstname")
    .not()
    .isEmpty(),
  check("lastname", "Please Enter your Lastname")
    .not()
    .isEmpty(),
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Please enter a valid password").isLength({
    min: 6
  })
];
router.post("/", signupValidations, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const data = {
      error: "Please attend to the following errors",
      errors: errors.array()
    }
    return res.render('signup', { data });
  }

  const {
    firstname,
    lastname,
    email,
    password
  } = req.body;


  try {
    let user = await User.findOne({
      email
    });

    if (user) {
      const data = {
        message: "User Already Exists"
      }
      return res.render("signup", { data })

    }

    user = new User({
      firstname,
      lastname,
      email,
      password
    });

    // Password will be hashed before save() if it was not modified
    const user_ = await user.save();

    const data = {
      message: 'User signup successfully, please login',
    }
    return res.render("signup", { data });

  } catch (err) {
    const data = {
      message: 'Oop! server error',
    }
    return res.render("signup", { data });
  }
}
);

module.exports = router;