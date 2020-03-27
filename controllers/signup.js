const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../model/user");

router.get('/', (req, res) => {
  const data = {
    title: "Signup",
    status: "",
    message: "",
    errors: "",
    payload: {}
  }
  return res.render('signup', { data });
});


// Signup Validation
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
      title: "Signup",
      status: false,
      message: "",
      error: "Please attend to the following errors",
      errors: errors.array(),
      payload: {}
    }
    console.log("error", data.errors)
    return res.render('signup', { data });
  }
  console.log('Passed signup validations')
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
        status: false,
        error: "User Already Exists"
      }
      return res.render("signup", { data })

    }

    user = new User({
      firstname,
      lastname,
      email,
      password
    });

    // Password will be hashed before save() if it wasnt modified
    const user_ = await user.save();
    // console.log('Saved use to DB', user_)
    const data = {
      status: true,
      message: 'User signup successfully, Login',
    }
    return res.render("signup", { data })
    // return res.json({
    //   status: true,
    //   message: 'User signup successfully',
    //   data: user_
    // })
    // sendEmail(user_, req, res);

  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: false,
      error: 'Could not signup'
    });;
  }
}
);

module.exports = router;