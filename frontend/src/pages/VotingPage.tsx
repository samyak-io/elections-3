import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { candidateAPI, voteAPI, userAPI, Candidate } from '../services/api';

const VotingPage = () => {
  const { cohortType } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cohortCandidates, setCohortCandidates] = useState<Candidate[]>([]);
  const [presidentialCandidates, setPresidentialCandidates] = useState<Candidate[]>([]);
  const [selectedCohortCandidate, setSelectedCohortCandidate] = useState<string>('');
  const [selectedPresidentialCandidates, setSelectedPresidentialCandidates] = useState<string[]>([]);
  const [votingStatus, setVotingStatus] = useState({ hasVotedCohort: false, hasVotedPresidential: false });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusRes, cohortRes, presidentialRes] = await Promise.all([
          userAPI.getVotingStatus(),
          candidateAPI.getByElectionType('cohort'),
          candidateAPI.getByElectionType('presidential')
        ]);

        setVotingStatus(statusRes.data);
        setCohortCandidates(cohortRes.data.filter(c => c.cohortType === cohortType));
        setPresidentialCandidates(presidentialRes.data);
        setLoading(false);
      } catch (error) {
        setError('Error loading candidates. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [cohortType]);

  useEffect(() => {
    if (votingStatus.hasVotedCohort && votingStatus.hasVotedPresidential) {
      navigate('/thank-you');
    }
  }, [votingStatus, navigate]);

  const handlePresidentialToggle = (candidateId: string) => {
    setSelectedPresidentialCandidates(prev => {
      if (prev.includes(candidateId)) {
        return prev.filter(id => id !== candidateId);
      }
      if (prev.length >= 13) {
        return prev;
      }
      return [...prev, candidateId];
    });
  };

  const handleCohortVote = async () => {
    if (!selectedCohortCandidate) return;
    try {
      await voteAPI.submit(selectedCohortCandidate, 'cohort');
      setVotingStatus(prev => ({ ...prev, hasVotedCohort: true }));
    } catch (error) {
      setError('Error submitting cohort vote. Please try again.');
    }
  };

  const handlePresidentialVote = async () => {
    if (selectedPresidentialCandidates.length === 0) return;
    try {
      await Promise.all(
        selectedPresidentialCandidates.map(candidateId =>
          voteAPI.submit(candidateId, 'presidential')
        )
      );
      setVotingStatus(prev => ({ ...prev, hasVotedPresidential: true }));
    } catch (error) {
      setError('Error submitting presidential votes. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!votingStatus.hasVotedCohort && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Cohort Election ({cohortType})
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select one candidate from your cohort
            </Typography>
            {cohortCandidates.map(candidate => (
              <FormControlLabel
                key={candidate._id}
                control={
                  <Checkbox
                    checked={selectedCohortCandidate === candidate._id}
                    onChange={() => setSelectedCohortCandidate(candidate._id)}
                  />
                }
                label={candidate.name}
              />
            ))}
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={!selectedCohortCandidate}
              onClick={handleCohortVote}
            >
              Submit Cohort Vote
            </Button>
          </CardContent>
        </Card>
      )}

      {!votingStatus.hasVotedPresidential && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Presidential Election
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select up to 13 candidates
            </Typography>
            {presidentialCandidates.map(candidate => (
              <FormControlLabel
                key={candidate._id}
                control={
                  <Checkbox
                    checked={selectedPresidentialCandidates.includes(candidate._id)}
                    onChange={() => handlePresidentialToggle(candidate._id)}
                    disabled={
                      !selectedPresidentialCandidates.includes(candidate._id) &&
                      selectedPresidentialCandidates.length >= 13
                    }
                  />
                }
                label={candidate.name}
              />
            ))}
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={selectedPresidentialCandidates.length === 0}
              onClick={handlePresidentialVote}
            >
              Submit Presidential Votes ({selectedPresidentialCandidates.length}/13)
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default VotingPage; 