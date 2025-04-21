import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { signInWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  // Redirect if already logged in
  if (currentUser) {
    navigate('/');
    return null;
  }

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      setError('Failed to sign in. Please make sure you are using an Ashoka University email address.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Welcome to Ashoka Elections
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Please sign in with your Ashoka University email address to continue
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignIn}
          size="large"
          sx={{ mt: 2 }}
        >
          Sign in with Google
        </Button>
      </Box>
    </Container>
  );
};

export default Login; 