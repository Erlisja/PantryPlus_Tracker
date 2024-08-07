import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, Typography, Box, TextField, Button } from '@mui/material';

export default function RecipeGenerator() {
  const router = useRouter();
  const [ingredients, setIngredients] = useState([]);
  const [error, setError] = useState('');

  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) {
      setError('Please enter some ingredients.');
      return;
    }
  
    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to generate recipe');
      }
  
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        // Navigate to the recipe page with the generated recipe and image URL
        router.push(`/recipe?recipe=${encodeURIComponent(data.recipe)}&image=${encodeURIComponent(data.imageUrl)}`);
        setError('');
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
      setError('An error occurred while generating the recipe.');
    }
  };

  return (
    <Box style={{ padding: '20px' }}>
      <TextField
        label="Ingredients (comma-separated)"
        variant="outlined"
        fullWidth
        onChange={(e) => setIngredients(e.target.value.split(',').map(ing => ing.trim()))}
        helperText="Enter ingredients separated by commas."
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleGenerateRecipe}>
        Generate Recipe
      </Button>
      {error && <Typography color="error" style={{ marginTop: '10px' }}>{error}</Typography>}
    </Box>
  );
}
