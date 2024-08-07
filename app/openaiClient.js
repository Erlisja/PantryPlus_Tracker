// import fetch from 'node-fetch';

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// // Function to generate a recipe text
// async function generateRecipe(ingredients) {
//   if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
//     throw new Error('Ingredients list cannot be empty');
//   }

//   const prompt = `Generate a recipe using the following ingredients: ${ingredients.join(', ')}.`;

//   try {
//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: 'gpt-3.5-turbo',
//         messages: [{ role: 'user', content: prompt }],
//         max_tokens: 4000,
//       }),
//     });

//     const responseText = await response.text();

//     if (!response.ok) {
//       throw new Error(`API error: ${responseText}`);
//     }

//     const data = JSON.parse(responseText);

//     if (data.choices && data.choices.length > 0) {
//       return data.choices[0].message.content.trim();
//     } else {
//       throw new Error('No choices found in response');
//     }
//   } catch (error) {
//     console.error('Error generating recipe:', error);
//     throw error;
//   }
// }

// // Function to generate an image based on the ingredients
// async function generateRecipeImage(ingredients) {
//   const prompt = `A delicious dish prepared with ${ingredients.join(', ')}. Show the final presentation of the dish.`;

//   try {
//     const response = await fetch('https://api.openai.com/v1/images/generations', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         prompt,
//         n: 1,
//         size: '512x512',
//       }),
//     });

//     const responseText = await response.text();

//     if (!response.ok) {
//       throw new Error(`API error: ${responseText}`);
//     }

//     const data = JSON.parse(responseText);

//     if (data.data && data.data.length > 0) {
//       return data.data[0].url;
//     } else {
//       throw new Error('No image found in response');
//     }
//   } catch (error) {
//     console.error('Error generating image:', error);
//     throw error;
//   }
// }

// export { generateRecipe, generateRecipeImage };
import fetch from 'node-fetch';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function generateRecipe(ingredients) {
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    throw new Error('Ingredients list cannot be empty');
  }

  const prompt = `Generate a recipe using the following ingredients: ${ingredients.join(', ')}.`;
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`API error: ${data.error.message}`);
    }

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content.trim();
    } else {
      throw new Error('No choices found in response');
    }
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw error;
  }
}

export async function generateRecipeImage(recipeTitle) {
    // Create a more detailed and descriptive prompt
    const prompt = `A realistic, high-quality photo of a delicious ${recipeTitle}. The image should look appetizing, with professional food styling and lighting.`;
  
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: prompt,
          n: 1,
          size: '512x512', // Adjust size for better quality
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(`Image API error: ${data.error.message}`);
      }
  
      if (data.data && data.data.length > 0) {
        return data.data[0].url;
      } else {
        throw new Error('No image generated');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }
  