import express from 'express';
import { Candidate } from '../models/candidate.model';
import { Vote } from '../models/vote.model';
import { verifyToken, verifyAdmin } from '../middleware/auth.middleware';

const router = express.Router();

// Get all candidates with vote counts
router.get('/candidates', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const candidates = await Candidate.find();
    const voteCounts = await Vote.aggregate([
      {
        $group: {
          _id: '$candidateId',
          count: { $sum: 1 }
        }
      }
    ]);

    const candidatesWithVotes = candidates.map(candidate => {
      const voteCount = voteCounts.find(vc => vc._id.toString() === candidate._id.toString());
      return {
        ...candidate.toObject(),
        voteCount: voteCount ? voteCount.count : 0
      };
    });

    res.json(candidatesWithVotes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching candidates with vote counts' });
  }
});

// Get election statistics
router.get('/statistics', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const totalVotes = await Vote.countDocuments();
    const presidentialVotes = await Vote.countDocuments({ electionType: 'presidential' });
    const cohortVotes = await Vote.countDocuments({ electionType: 'cohort' });

    res.json({
      totalVotes,
      presidentialVotes,
      cohortVotes
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching election statistics' });
  }
});

export default router; 