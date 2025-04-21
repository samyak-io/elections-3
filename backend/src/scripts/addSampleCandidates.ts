import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Candidate } from '../models/candidate.model';

dotenv.config();

async function addSampleCandidates() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Clear existing candidates
    await Candidate.deleteMany({});
    console.log('Cleared existing candidates');

    // Add presidential candidates
    const presidentialCandidates = [
      { name: 'John Doe', cohortType: 'Presidential', electionType: 'presidential' },
      { name: 'Jane Smith', cohortType: 'Presidential', electionType: 'presidential' },
      { name: 'Robert Johnson', cohortType: 'Presidential', electionType: 'presidential' }
    ];

    // Add UG candidates
    const ugCandidates = [
      { name: 'Alice Brown', cohortType: 'UG', electionType: 'cohort' },
      { name: 'Charlie Davis', cohortType: 'UG', electionType: 'cohort' },
      { name: 'Eve Wilson', cohortType: 'UG', electionType: 'cohort' }
    ];

    // Add Masters candidates
    const mastersCandidates = [
      { name: 'Frank Miller', cohortType: 'Masters', electionType: 'cohort' },
      { name: 'Grace Lee', cohortType: 'Masters', electionType: 'cohort' },
      { name: 'Henry Taylor', cohortType: 'Masters', electionType: 'cohort' }
    ];

    // Add PhD candidates
    const phdCandidates = [
      { name: 'Ivy Clark', cohortType: 'PhD', electionType: 'cohort' },
      { name: 'Jack White', cohortType: 'PhD', electionType: 'cohort' },
      { name: 'Kate Green', cohortType: 'PhD', electionType: 'cohort' }
    ];

    // Combine all candidates
    const allCandidates = [
      ...presidentialCandidates,
      ...ugCandidates,
      ...mastersCandidates,
      ...phdCandidates
    ];

    // Insert candidates
    await Candidate.insertMany(allCandidates);
    console.log(`Added ${allCandidates.length} sample candidates`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

    process.exit(0);
  } catch (error) {
    console.error('Error adding sample candidates:', error);
    process.exit(1);
  }
}

addSampleCandidates(); 