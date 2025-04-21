import express from 'express';
import { Candidate } from '../models/candidate.model';
import { verifyToken, verifyAdmin } from '../middleware/auth.middleware';

const router = express.Router();

// Get all candidates
router.get('/', verifyToken, async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching candidates' });
  }
});

// Get candidates by election type
router.get('/:electionType', verifyToken, async (req, res) => {
  try {
    const candidates = await Candidate.find({ electionType: req.params.electionType });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching candidates' });
  }
});

// Add new candidate (admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, cohortType, electionType } = req.body;
    const candidate = new Candidate({ name, cohortType, electionType });
    await candidate.save();
    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ message: 'Error creating candidate' });
  }
});

export default router; 