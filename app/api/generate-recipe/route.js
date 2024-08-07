
import { generateRecipe, generateRecipeImage } from '@/app/openaiClient';

// Export a named function for the POST method
export async function POST(req) {
  const { ingredients } = await req.json(); // Use req.json() to parse the request body in Next.js

  try {
    const recipe = await generateRecipe(ingredients);
    const imageUrl = await generateRecipeImage(ingredients);

    return new Response(JSON.stringify({ recipe, imageUrl }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error generating recipe:', error);

    return new Response(JSON.stringify({ error: 'Failed to generate recipe' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
