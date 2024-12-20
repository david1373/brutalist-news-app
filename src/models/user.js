import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Invalid email format'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['admin', 'editor', 'viewer'],
    default: 'viewer'
  },
  apiKey: {
    type: String,
    unique: true,
    sparse: true
  },
  lastLogin: Date,
  active: {
    type: Boolean,
    default: true
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods = {
  comparePassword: async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  },
  generateToken: function() {
    return jwt.sign(
      { 
        id: this._id,
        role: this.role,
        email: this.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }
};

export const User = mongoose.model('User', userSchema);