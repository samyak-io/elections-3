import { Box, Typography, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ThankYou = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 400,
          width: '100%',
        }}
      >
        <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Thank You for Voting!
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          Your votes have been successfully recorded. The results will be announced after the election period ends.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ThankYou; 