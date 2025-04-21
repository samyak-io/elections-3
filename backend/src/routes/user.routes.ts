import express from 'express';
import { User } from '../models/user.model';
import { verifyToken } from '../middleware/auth.middleware';

const router = express.Router();

// Get user profile
router.get('/profile', verifyToken, async (req: any, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Check if user has voted
router.get('/voting-status', verifyToken, async (req: any, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      hasVotedPresidential: user.hasVotedPresidential,
      hasVotedCohort: user.hasVotedCohort
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching voting status' });
  }
});

export default router; 