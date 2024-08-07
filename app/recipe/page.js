//page.js
'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Container, CssBaseline, Button, List, ListItem, ListItemText,Modal } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles'



// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#black',
    },
  },
  typography: {
    h3: {
      fontWeight: 600,
      textAlign: 'center', // Center the title
    },
    h5: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
});



export default function RecipePage() {
  const router = useRouter();
  const [recipe, setRecipe] = useState({
    title: '',
    ingredients: [],
    instructions: [],
  });

  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const recipeParam = queryParams.get('recipe');
    const imageParam = queryParams.get('image');

    if (recipeParam) {
      try {
        const recipeText = decodeURIComponent(recipeParam);
        const [title, ingredientsSection, instructionsSection] = recipeText.split('\n\n');

        const ingredients = ingredientsSection
          .replace('Ingredients:', '')
          .split('\n')
          .filter(line => line.trim() !== '');

        const instructions = instructionsSection
          .replace('Instructions:', '')
          .split('\n')
          .filter(line => line.trim() !== '');

        setRecipe({
          title,
          ingredients,
          instructions,
        });
      } catch (error) {
        console.error('Error parsing recipe:', error);
      }
    }
    if (imageParam) {
        setImageUrl(decodeURIComponent(imageParam));
      }
  }, []);


  return (

    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container style={{ padding: '20px' }}>
        <Button
        variant="contained"
        sx={{ color: '#0a3659', borderColor: '#0a3659',  borderRadius: '5px', padding: '10px 20px' }}
        onClick={() => router.push('/pantry')}
        style={{ marginBottom: '20px' }}
        >
          Back
        </Button>
        <Typography variant="h3" color="white" paddingY={5} gutterBottom>
          {recipe.title || 'Recipe Title'}
        </Typography>
         {imageUrl && (
          <Box
            mt={3}
            display="flex"
            justifyContent="center"
            sx={{ width: '100%', overflow: 'hidden', mb: 4, borderColor: 'white' }}
          >
            <img
              src={imageUrl}
              alt={recipe.title}
              style={{ width: '100%', height: 'auto', borderRadius: '15px', maxHeight: '300px', objectFit: 'cover' }}
            />
          </Box>
        )}
        <Box style={{ display: 'flex', gap: '20px' }}>
        <Card sx={{ flex: 1, padding: '20px', bgcolor: '#0a2649', color :'white', borderStyle:"double", borderRadius:"30px", borderColor:'white'}}>
            <Typography variant="h5"  gutterBottom>
              Ingredients
            </Typography>
            {recipe.ingredients.length > 0 ? (
              <ul style={{ paddingLeft: '20px' }}>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            ) : (
              <Typography>No ingredients found.</Typography>
            )}
          </Card>
          <Card sx={{ flex: 2, padding: '20px', bgcolor: '#0a2649', color :'white', borderStyle:"double", borderRadius:"30px", borderColor:'white'}}>
            <Typography variant="h5" color="secondary" gutterBottom >
              Instructions
            </Typography>
            {recipe.instructions.length > 0 ? (
              <List>
                {recipe.instructions.map((instruction, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={instruction} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No instructions found.</Typography>
            )}
          </Card>
        </Box>
        
      </Container>
    </ThemeProvider>
  );
}
