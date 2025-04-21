import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[a-zA-Z0-9._-]+@ashoka\.edu\.in$/, 'Please enter a valid Ashoka email address']
  },
  cohortType: {
    type: String,
    required: true,
    enum: ['UG', 'Masters', 'PhD']
  },
  hasVotedPresidential: {
    type: Boolean,
    default: false
  },
  hasVotedCohort: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const User = mongoose.model('User', userSchema); 