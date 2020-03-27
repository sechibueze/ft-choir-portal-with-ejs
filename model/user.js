const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Token = require('./token');

const UserSchema = mongoose.Schema({
  unit_id: {
    type: String
  },
  title: {
    type: String,
    enum: ['Mr', 'Mrs', 'Dcn', 'Pst']
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profileImage: { type: String, default: 'https://res.cloudinary.com/sechibueze/image/upload/v1584686868/sample.jpg' },
  isVerified: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  isGroupAdmin: { type: Boolean, default: false },
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now()
  },
  general: {
    group: {
      type: String,
      default: ""
    },
    vocal_part: {
      type: String,
      default: "Alto",
      enum: ['Alto', 'Suprano', 'Tenor']
    },
    rehearsal_location: {
      type: String,
      default: "Iyana",
      enum: ['Iyana', 'Isashi', 'Canaanland']
    },
    gender: {
      type: String,
      default: "Male",
      enum: ['Male', 'Female']
    }
  },
  personal: {
    phone: {
      type: String,
      default: ""
    },
    whatsapp_phone: {
      type: String,
      default: ""
    },
    contact_address: {
      type: String,
      default: ""
    },
    pha: {
      type: String, default: ""
    },
    dob: {
      type: String, default: ""
    },
    wed_date: {
      type: String, default: ""
    },
    marital_status: {
      type: String,

      enum: ['Single', 'Engaged', 'Married']
    },
    work_status: {
      type: String,
      enum: ['Employed', 'Self employed', 'Unemployed']
    },
    profession: {
      type: String
    },
    employer_name: {
      type: String
    },
    employer_address: {
      type: String
    },
    state_origin: {
      type: String
    },
    nationality: {
      type: String,
      default: 'Nigeria'
    }
  },
  nok: {
    name: {
      type: String,
      default: ""
    },
    address: {
      type: String
    },
    nok_phone: {
      type: String
    },
    occupation: {
      type: String
    },
    relation: {
      type: String
    },
    email: {
      type: String
    }
  },
  choir_roles: {
    membership_status: {
      type: String,
      default: "Member",
      enum: ['Member', 'Ordained worker', 'Pastorate']
    },
    leadership_status: {
      type: String,
      enum: ['Choir master', 'Part head']
    },
    sub_group: {
      type: String,
      enum: ['Music team', 'Praise team', 'Legal team']
    }

  },
  church_info: {
    wsf_status: {
      type: String,
      default: "Member",
      enum: ['Home provider', 'Member', 'District coordinator']
    },
    new_birth_year: {
      type: String
    },
    holy_spirit_year: {
      type: String
    },
    lfc_joined_year: {
      type: String
    },
    ordination_year: {
      type: String
    },
    province: {
      type: String
    },
    district: {
      type: String
    },
    zone: {
      type: String
    }
  }

},
  { timestamps: true });

UserSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateJWT = function () {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  let payload = {
    id: this._id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
  });
};

UserSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

UserSchema.methods.generateVerificationToken = function () {
  let payload = {
    userId: this._id,
    token: crypto.randomBytes(20).toString('hex')
  };
  console.log('payload', payload)
  return new Token(payload);
};
module.exports = mongoose.model("user", UserSchema);