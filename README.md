# Pantry Plus Tracker

Pantry Plus Tracker is a web application that helps you manage your pantry items and generate recipes based on the ingredients you have. Built with [Next.js](https://nextjs.org/) and leveraging the OpenAI API, it provides an intuitive interface for tracking food inventory and discovering new meal ideas.

## Features

- **Pantry Management**: Easily add, edit, and remove pantry items.
- **Recipe Generation**: Generate recipes using the ingredients you have at home.
- **Expiration Tracking**: Keep track of items that are about to expire.
- **Image Generation**: Generate realistic images of the recipes (powered by OpenAI's DALL-E API).

## Technologies Used

- **Next.js**: React framework for building fast, server-rendered applications.
- **OpenAI API**: For generating recipes and images based on the ingredients provided.
- **Material-UI**: For UI components and styling.
- **Node.js**: For server-side operations and API requests.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- An OpenAI API key. You can obtain one by signing up at [OpenAI](https://beta.openai.com/signup/).

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Erlisja/PantryPlus_Tracker.git
   cd PantryPlus_Tracker


First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.


### Usage
- Navigate to the pantry list to add or edit items.
- Use the "Generate Recipe" button to create a recipe using your pantry items.
- The app will display the recipe along with a generated image (if enabled).
### Deployment
The app is hosted on Vercel, which provides a seamless deployment process for Next.js applications. For more details on how to deploy a Next.js app, check out the Next.js deployment documentation.

## Learn More
To learn more about the tools and frameworks used in this project, take a look at the following resources:
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [OpenAI API Documentation](https://platform.openai.com/docs/overview) 

## Contributions
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
Copyright 2024 Erlisja Kore
