import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  electionType: {
    type: String,
    required: true,
    enum: ['cohort', 'presidential']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index to ensure vote uniqueness per election type
voteSchema.index({ candidateId: 1, electionType: 1 }, { unique: true });

export const Vote = mongoose.model('Vote', voteSchema); 