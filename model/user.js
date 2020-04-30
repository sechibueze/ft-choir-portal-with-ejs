const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Token = require('./token');

const UserSchema = mongoose.Schema({
  unit_id: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    default: ""
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
      default: ""
    },
    rehearsal_location: {
      type: String,
      default: ""
    },
    gender: {
      type: String,
      default: ""
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
      ddefault: ""
    },
    work_status: {
      type: String,
      default: ""
    },
    profession: {
      type: String,
      default: ""
    },
    employer_name: {
      type: String,
      default: ""
    },
    employer_address: {
      type: String,
      default: ""
    },
    state_origin: {
      type: String,
      default: ""
    },
    nationality: {
      type: String,
      default: 'Nigeria'
    }
  },
  nok: {
    nok_name: {
      type: String,
      default: ""
    },
    nok_address: {
      type: String,
      default: ""
    },
    nok_phone: {
      type: String,
      default: ""
    },
    nok_occupation: {
      type: String,
      default: ""
    },
    nok_relation: {
      type: String,
      default: ""
    },
    nok_email: {
      type: String,
      default: ""
    }
  },
  choir_roles: {
    membership_status: {
      type: String,
      default: ""
    },
    leadership_status: {
      type: String,
      default: ""
    },
    sub_group: {
      type: String,
      default: ""
    }

  },
  church_info: {
    wsf_status: {
      type: String,
      default: ""
    },
    new_birth_year: {
      type: String,
      default: ""
    },
    holy_spirit_year: {
      type: String,
      default: ""
    },
    lfc_joined_year: {
      type: String,
      default: ""
    },
    ordination_year: {
      type: String,
      default: ""
    },
    province: {
      type: String,
      default: ""
    },
    district: {
      type: String,
      default: ""
    },
    zone: {
      type: String,
      default: ""
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