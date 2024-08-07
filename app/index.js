// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const { generateRecipe } = require('./openaiClient');

// const app = express();
// const port = 3000;

// app.use(cors());
// app.use(express.json());

// // Endpoint to generate a recipe
// app.post('/app/api/generate-recipe', async (req, res) => { // Fixed the endpoint path
//   console.log('Request received:', req.body);
//   const { pantryItems } = req.body;

//   try {
//     const recipe = await generateRecipe(pantryItems);
//     res.json({ recipe }); // Return the generated recipe
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to generate recipe' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
// server.js
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const { generateRecipe } = require('./openaiClient');

// const app = express();
// const port = 3000;

// app.use(cors());
// app.use(express.json());

// // Endpoint to generate a recipe
// app.post('/api/generate-recipe', async (req, res) => {
//   console.log('Request received:', req.body);
//   const { pantryItems } = req.body;

//   try {
//     const recipe = await generateRecipe(pantryItems);
//     res.json({ recipe });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to generate recipe' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
