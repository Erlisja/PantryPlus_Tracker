// app/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import 'animate.css';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2'
    },
  },
  typography: {
    h3: {
      fontWeight: 600,
      textAlign: 'center'
    },
  },
});

// Messages to be displayed
const messages = [
  "Pantry inventory made easy!",
  "Track your pantry effortlessly!",
  "Discover new recipes!",
  "Get personalized suggestions!",
  "Start cooking today!"
];

export default function LoginPage() {
  const router = useRouter();
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    // Change message every 3 seconds
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    // Redirect to the pantry list page
    router.push('/pantry');
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="md"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          textAlign: 'center',
          bgcolor: 'black',
          color: 'white'
        }}
      >
        <Typography
          variant="h2"
          gutterBottom
          className="animate__animated animate__fadeInDown animate__slower" 
          paddingY={20}
        >
          Welcome to PantryPlus!
        </Typography>
        <Typography
          variant="h4"
          sx={{ marginBottom: 10 }}
          className="animate__animated animate__fadeInUp" 
        >
          {messages[currentMessage]}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleGetStarted}
          sx={{
            borderRadius: 20,
            padding: '10px 20px',
            fontSize: '1rem',
           
          }}
          className="animate__animated animate__headShake animate__infinite  "
        >
          Get Started
        </Button>
      </Container>
    </ThemeProvider>
  );
}
