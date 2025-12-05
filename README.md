# Nafoods Distribution Hub

This is a Next.js application for managing logistics, including orders, deliveries, and inventory for Nafoods.

## Deploying to Vercel

Vercel is the recommended hosting platform for Next.js applications. Follow these steps to deploy this project:

### Step 1: Push Your Code to a Git Repository

Push your project code to a new repository on a Git provider like GitHub, GitLab, or Bitbucket.

### Step 2: Import Project into Vercel

1.  **Sign up or Log in** to your [Vercel account](https://vercel.com/signup).
2.  From your Vercel Dashboard, click the **"Add New..."** button and select **"Project"**.
3.  **Import your Git repository**. Vercel will automatically detect that it's a Next.js project.

### Step 3: Configure Environment Variables

For the AI features to work, you need to add your Gemini API key as an environment variable in Vercel.

1.  In your Vercel project settings, navigate to the **Settings** tab and then to the **Environment Variables** section.
2.  Add a new environment variable:
    *   **Name:** `GEMINI_API_KEY`
    *   **Value:** `YOUR_GEMINI_API_KEY_HERE` (Paste your actual API key here)

### Step 4: Deploy

After configuring the environment variables, trigger a deployment from the "Deployments" tab in Vercel. Vercel will build and deploy your application, and you will receive a public URL for your live site.

That's it! Your application will be live and running on Vercel's global infrastructure.
