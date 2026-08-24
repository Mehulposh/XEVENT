const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email',
      ],
    },

    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },

    role: {
      type: String,
      enum: ['Admin', 'Organizer', 'Participant'],
      default: 'Participant',
    },

    picture: {
      type: String,
      default: '',
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    organizerRequestStatus: {
      type: String,
      enum: ['none', 'pending', 'approved', 'rejected'],
      default: 'none',
    },

    registeredEvents: [
      {
        event: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Event',
        },

        registeredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    createdEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
  },
  {
    timestamps: true,
  }
);


// ---------------------------------------------
// Hash password before saving
// ---------------------------------------------

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );
});


// ---------------------------------------------
// Compare password
// ---------------------------------------------

userSchema.methods.comparePassword = async function (
  enteredPassword
) {
  return bcrypt.compare(
    enteredPassword,
    this.password
  );
};


// ---------------------------------------------
// Remove password from JSON response
// ---------------------------------------------

userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;

  return user;
};


// IMPORTANT:
// Model name must be "User"
// because your Event schema uses ref: 'User'
// ---------------------------------------------

module.exports =
  mongoose.models.user ||
  mongoose.model('user', userSchema);