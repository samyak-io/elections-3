import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid as MuiGrid,
  Card,
  CardContent,
  Alert,
  CircularProgress
} from '@mui/material';
import { adminAPI, candidateAPI } from '../services/api';

interface CandidateWithVotes {
  _id: string;
  name: string;
  cohortType: string;
  electionType: string;
  voteCount: number;
}

interface Statistics {
  totalVotes: number;
  presidentialVotes: number;
  cohortVotes: number;
}

const AdminDashboard = () => {
  const [candidates, setCandidates] = useState<CandidateWithVotes[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    cohortType: '',
    electionType: ''
  });

  const fetchData = async () => {
    try {
      const [candidatesRes, statsRes] = await Promise.all([
        adminAPI.getCandidatesWithVotes(),
        adminAPI.getStatistics()
      ]);
      setCandidates(candidatesRes.data);
      setStatistics(statsRes.data);
      setLoading(false);
    } catch (error) {
      setError('Error loading dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCandidate = async () => {
    try {
      await candidateAPI.create(newCandidate);
      setOpenDialog(false);
      setNewCandidate({ name: '', cohortType: '', electionType: '' });
      fetchData();
    } catch (error) {
      setError('Error adding candidate');
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

      <MuiGrid container spacing={3} sx={{ mb: 4 }}>
        <MuiGrid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Votes</Typography>
              <Typography variant="h4">{statistics?.totalVotes || 0}</Typography>
            </CardContent>
          </Card>
        </MuiGrid>
        <MuiGrid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Presidential Votes</Typography>
              <Typography variant="h4">{statistics?.presidentialVotes || 0}</Typography>
            </CardContent>
          </Card>
        </MuiGrid>
        <MuiGrid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Cohort Votes</Typography>
              <Typography variant="h4">{statistics?.cohortVotes || 0}</Typography>
            </CardContent>
          </Card>
        </MuiGrid>
      </MuiGrid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Candidates</Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Add Candidate
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Cohort</TableCell>
              <TableCell>Election Type</TableCell>
              <TableCell align="right">Votes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow key={candidate._id}>
                <TableCell>{candidate.name}</TableCell>
                <TableCell>{candidate.cohortType}</TableCell>
                <TableCell>{candidate.electionType}</TableCell>
                <TableCell align="right">{candidate.voteCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Candidate</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={newCandidate.name}
            onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
          />
          <TextField
            select
            margin="dense"
            label="Cohort Type"
            fullWidth
            value={newCandidate.cohortType}
            onChange={(e) => setNewCandidate({ ...newCandidate, cohortType: e.target.value })}
          >
            <MenuItem value="UG">UG</MenuItem>
            <MenuItem value="Masters">Masters</MenuItem>
            <MenuItem value="PhD">PhD</MenuItem>
            <MenuItem value="Presidential">Presidential</MenuItem>
          </TextField>
          <TextField
            select
            margin="dense"
            label="Election Type"
            fullWidth
            value={newCandidate.electionType}
            onChange={(e) => setNewCandidate({ ...newCandidate, electionType: e.target.value })}
          >
            <MenuItem value="cohort">Cohort</MenuItem>
            <MenuItem value="presidential">Presidential</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddCandidate} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard; 