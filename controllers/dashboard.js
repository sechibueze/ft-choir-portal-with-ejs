const express = require("express");

const fastcsv = require("fast-csv");
const fs = require("fs");
const path = require('path');
// const convertapi = require("convertapi");
const convertapi = require('convertapi')(process.env.CONVERTAPI_KEY);
const router = express.Router();
const User = require("../model/user");

// url: /dashboard
router.get("/", (req, res) => {
  if (!req.session.auth) {
    req.session.message = "Unauthenticated"
    return res.redirect("/login")
  }
  // console.log("datsboard user", req.session)
  console.log("Dashboard query", req.query)
  let data = {
    query: req.query,
    user: req.session.user
  }
  if (req.query.action === "users") {
    User.find({ isDeleted: false }, (err, docs) => {
      if (err) {
        return res.redirect("/dashboard")
      }
      console.log("Users List::docs", docs)
      data.users = docs;
      req.session.users = docs;
      // console.log("Users List::data", data)
      return res.render("dashboard", { data })
    })
  } else if (req.query.action === "report") {
    let reportData = req.session.users;

    const jsonData = JSON.parse(JSON.stringify(reportData));
    const path2file = "reports/master_" + Date.now() + "_report.csv";
    const ws = fs.createWriteStream(path2file);

    fastcsv
      .write(jsonData, { headers: true })
      .on("finish", function () {
        // console.log("function ", e);
        // data.result.message = 'Available for Download';
        console.log("Write to master lis successfully!", ws.path);
        // let filePath = path.resolve(ws.path).replace(/\\/g, '/');
        // console.log('file Path : ', filePath);

        convertapi.convert('xlsx', {
          File: ws.path
        }, 'csv').then(function (result) {
          console.log('url : ', result.file.url);
          data.download_url = result.file.url;
          console.log('data wifth link', data)
          return res.render('dashboard', { data });
        }).catch(e => {

          data.message = 'Failed to generate report';
          return res.render('admin', { data });
        });

      })
      .pipe(ws);

  }
  else {
    console.log("::data", data)
    return res.render("dashboard", { data })
  }
  // console.log("Users List", data.users)
  // return res.render("dashboard", { data })
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

          console.log("UpdUser", updUser)
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

          console.log("UpdUser", updUser.general)
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

          console.log("UpdUser", updUser.personal)
          req.session.user = updUser;
          return res.redirect("/dashboard");
        })
      break;
    case "nok":
      const {
        name,
        address,
        nok_phone,
        occupation,
        relation,
        email

      } = req.body;
      User.findOneAndUpdate(
        { _id: req.params.id, isDeleted: false },
        {
          nok: {
            name,
            address,
            nok_phone,
            occupation,
            relation,
            email

          }
        },
        { new: true }, (err, updUser) => {
          if (err) {
            return res.redirect("/dashboard")
          }

          console.log("UpdUser", updUser.nok)
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

          console.log("UpdUser", updUser.nok)
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

          console.log("UpdUser", updUser.church_info)
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