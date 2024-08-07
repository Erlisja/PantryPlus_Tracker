
// import fetch from 'node-fetch';

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// export async function generateRecipe(ingredients) {
//   if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
//     throw new Error('Ingredients list cannot be empty');
//   }

//   const prompt = `Generate a recipe using the following ingredients: ${ingredients.join(', ')}.`;
  
//   try {
//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
//       },
//       body: JSON.stringify({
//         model: 'gpt-3.5-turbo',
//         messages: [{ role: 'user', content: prompt }],
//         max_tokens: 4000,
//       }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(`API error: ${data.error.message}`);
//     }

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

// export async function generateRecipeImage(recipeTitle) {
//     // Create a more detailed and descriptive prompt
//     const prompt = `A realistic, high-quality photo of a delicious ${recipeTitle}. The image should look appetizing, with professional food styling and lighting.`;
  
//     try {
//       const response = await fetch('https://api.openai.com/v1/images/generations', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
//           prompt: prompt,
//           n: 1,
//           size: '512x512', // Adjust size for better quality
//         }),
//       });
  
//       const data = await response.json();
  
//       if (!response.ok) {
//         throw new Error(`Image API error: ${data.error.message}`);
//       }
  
//       if (data.data && data.data.length > 0) {
//         return data.data[0].url;
//       } else {
//         throw new Error('No image generated');
//       }
//     } catch (error) {
//       console.error('Error generating image:', error);
//       throw error;
//     }
//   }
  

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
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
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
  const prompt = `A delicious ${recipeTitle}. Professional food styling, high-quality lighting.`;

  // Retry mechanism for image generation
  const retryAsync = async (fn, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  try {
    const response = await retryAsync(() =>
      fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          prompt: prompt,
          n: 1,
          size: '256x256', // Smaller size for faster generation
        }),
      })
    );

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
