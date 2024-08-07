
// import  {generateRecipe, generateRecipeImage } from '@/app/openaiClient';
// import { NextResponse } from 'next/server';

// export async function POST(request) {
//   try {
//     const { ingredients } = await request.json();

//     if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
//       return NextResponse.json({ error: 'Ingredients list cannot be empty' }, { status: 400 });
//     }

//     const recipe = await generateRecipe(ingredients);
//     // Generate recipe image
//     const imageUrl = await generateRecipeImage(ingredients);

//     console.log('Generated Recipe:', recipe); // Log the recipe for debugging

//     return NextResponse.json({ recipe });
//   } catch (error) {
//     console.error('Error generating recipe:', error);
//     return NextResponse.json({ error: 'An error occurred while generating the recipe' }, { status: 500 });
//   }
// }
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
