import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  cohortType: {
    type: String,
    required: true,
    enum: ['UG', 'Masters', 'PhD', 'Presidential']
  },
  electionType: {
    type: String,
    required: true,
    enum: ['cohort', 'presidential']
  }
}, {
  timestamps: true
});

export const Candidate = mongoose.model('Candidate', candidateSchema); 