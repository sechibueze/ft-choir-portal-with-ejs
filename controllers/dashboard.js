const express = require("express");
const fastcsv = require("fast-csv");
const fs = require("fs");
const path = require('path');
const convertapi = require('convertapi')(process.env.CONVERTAPI_KEY);
const router = express.Router();
const User = require("../model/user");
const Notification = require("../model/notification");
const reportData = require("../helpers/reportData")

/*
* @route GET /dashboard
* @descrription render the user dashboard
* @access private
*/
router.get("/", (req, res) => {
  console.log("Admin status", req.session.isAdmin)
  if (!req.session.auth) {
    req.session.message = "Unauthenticated access";
    return res.redirect("/login")
  }

  console.log("Dashboard query", req.query)
  let data = {
    error: "",
    message: "",
    query: req.query,
    user: req.session.user
  }
  if (req.query.action === "users") {
    //@route - /dashboard?action=users&id=1233466466
    // @description - get all registered users
    User.find({ isDeleted: false }, (err, docs) => {
      if (err) {
        req.session.message = "Oops! Server error";
        return res.redirect("/dashboard")
      }
      console.log("Users List::docs.length", docs.length)
      data.users = docs;
      req.session.users = docs; // keep in session for reports
      return res.render("dashboard", { data })
    })
  } else if (req.query.action === "view_user") {
    //@route - /dashboard?action=Vie_users&id=1233466466
    // @description - get a registered user
    console.log("Requested user ID", req.query.id)
    const { id } = req.query;
    User.findOne({ _id: id, isDeleted: false }, (err, user) => {
      if (err) {
        req.session.message = "Oops! Server error";
        return res.redirect("/dashboard")
      }

      if (!user) {
        req.session.message = "User does not exist";
        return res.redirect("/dashboard");
      }
      console.log("Viewin user::email", user.email)
      data.member = user;
      return res.render("dashboard", { data })
    })
  } else if (req.query.action === "report") {
    // let reportData = req.session.users;
    // work on reportData
    const userList = req.session.users;
    // const jsonData = JSON.parse(JSON.stringify(reportData));
    const jsonData = JSON.parse(reportData(userList));
    // console.log("jsonData => ", jsonData)

    const path2file = "reports/master_" + Date.now() + "_report.csv";
    const ws = fs.createWriteStream(path2file);

    fastcsv
      .write(jsonData, { headers: true })
      .on("finish", function () {

        console.log("Write to master lis successfully!", ws.path);
        // convert the .csv to .xlsx
        convertapi.convert('xlsx', {
          File: ws.path
        }, 'csv').then(function (result) {
          console.log('url : ', result.file.url);
          data.download_url = result.file.url;
          return res.render('dashboard', { data });
        }).catch(e => {

          data.message = 'Failed to generate report';
          return res.render('dashboard', { data });
        });

      })
      .pipe(ws);

  } else if (req.query.action === "notifications") {

    Notification.find({ isDeleted: false }, (err, notes) => {
      if (err) {
        data.message = "Server err";
        return res.render("dashboard", { data })
      }
      data.notes = notes;
      return res.render("dashboard", { data })
    });

  } else if (req.query.action === "notify") {

    return res.render("dashboard", { data })
  } else {
    // No query strings
    // @route - /dashboard
    console.log("user", data.user.email)
    return res.render("dashboard", { data })
  }

})

router.post("/:section/:id", (req, res) => {
  if (!req.session.auth) {
    req.session.message = "Unauthenticated"
    return res.redirect("/login")
  }
  console.log("datsboard params", req.params)
  switch (req.params.section) {
    case "basic":
      const { firstname, lastname, title, unit_id } = req.body;
      User.findOneAndUpdate(
        { _id: req.params.id, isDeleted: false },
        { firstname, lastname, title, unit_id },
        { new: true }, (err, updUser) => {
          if (err) {
            return res.redirect("/dashboard")
          }


          req.session.user = updUser;
          return res.redirect("/dashboard");
        })
      break;

    case "general":
      const { group, vocal_part, rehearsal_location, gender } = req.body;
      User.findOneAndUpdate(
        { _id: req.params.id, isDeleted: false },
        { general: { group, vocal_part, rehearsal_location, gender } },
        { new: true }, (err, updUser) => {
          if (err) {
            return res.redirect("/dashboard")
          }

          req.session.user = updUser;
          return res.redirect("/dashboard");
        })
      break;

    case "personal":
      const {
        phone,
        whatsapp_phone,
        contact_address,
        pha,
        dob,
        wed_date,
        marital_status,
        work_status,
        profession,
        employer_name,
        employer_address,
        state_origin,
        nationality
      } = req.body;
      User.findOneAndUpdate(
        { _id: req.params.id, isDeleted: false },
        {
          personal: {
            phone,
            whatsapp_phone,
            contact_address,
            pha,
            dob,
            wed_date,
            marital_status,
            work_status,
            profession,
            employer_name,
            employer_address,
            state_origin,
            nationality
          }
        },
        { new: true }, (err, updUser) => {
          if (err) {
            return res.redirect("/dashboard")
          }
          req.session.user = updUser;
          return res.redirect("/dashboard");
        })
      break;
    case "nok":
      const {
        nok_name,
        nok_address,
        nok_phone,
        nok_occupation,
        nok_relation,
        nok_email

      } = req.body;
      User.findOneAndUpdate(
        { _id: req.params.id, isDeleted: false },
        {
          nok: {
            nok_name,
            nok_address,
            nok_phone,
            nok_occupation,
            nok_relation,
            nok_email

          }
        },
        { new: true }, (err, updUser) => {
          if (err) {
            return res.redirect("/dashboard")
          }
          req.session.user = updUser;
          return res.redirect("/dashboard");
        })
      break;
    case "choir_roles":
      const {
        membership_status,
        leadership_status,
        sub_group
      } = req.body;
      User.findOneAndUpdate(
        { _id: req.params.id, isDeleted: false },
        {
          choir_roles: {
            membership_status,
            leadership_status,
            sub_group
          }
        },
        { new: true }, (err, updUser) => {
          if (err) {
            return res.redirect("/dashboard")
          }
          req.session.user = updUser;
          return res.redirect("/dashboard");
        })
      break;
    case "church_info":
      const {
        wsf_status,
        new_birth_year,
        holy_spirit_year,
        lfc_joined_year,
        ordination_year,
        province,
        district,
        zone
      } = req.body;
      User.findOneAndUpdate(
        { _id: req.params.id, isDeleted: false },
        {
          church_info: {
            wsf_status,
            new_birth_year,
            holy_spirit_year,
            lfc_joined_year,
            ordination_year,
            province,
            district,
            zone
          }
        },
        { new: true }, (err, updUser) => {
          if (err) {
            return res.redirect("/dashboard")
          }
          req.session.user = updUser;
          return res.redirect("/dashboard");
        })
      break;
    default:
      return res.redirect("/dashboard");
      break;
  }
})


module.exports = router