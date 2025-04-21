import express from 'express';
import { Vote } from '../models/vote.model';
import { User } from '../models/user.model';
import { verifyToken } from '../middleware/auth.middleware';

const router = express.Router();

// Submit a vote
router.post('/', verifyToken, async (req: any, res) => {
  try {
    const { candidateId, electionType } = req.body;
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has already voted for this election type
    if ((electionType === 'presidential' && user.hasVotedPresidential) ||
        (electionType === 'cohort' && user.hasVotedCohort)) {
      return res.status(400).json({ message: 'You have already voted in this election' });
    }

    // Create the vote
    const vote = new Vote({
      candidateId,
      electionType
    });

    await vote.save();

    // Update user's voting status
    if (electionType === 'presidential') {
      user.hasVotedPresidential = true;
    } else {
      user.hasVotedCohort = true;
    }
    await user.save();

    res.status(201).json({ message: 'Vote recorded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error recording vote' });
  }
});

// Get vote counts (admin only)
router.get('/counts', verifyToken, async (req: any, res) => {
  try {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    if (!adminEmails.includes(req.user.email)) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const voteCounts = await Vote.aggregate([
      {
        $group: {
          _id: '$candidateId',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'candidates',
          localField: '_id',
          foreignField: '_id',
          as: 'candidate'
        }
      },
      {
        $unwind: '$candidate'
      },
      {
        $project: {
          candidateName: '$candidate.name',
          count: 1,
          electionType: '$candidate.electionType'
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json(voteCounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vote counts' });
  }
});

export default router; 