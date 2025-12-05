# Nafoods Distribution Hub

This is a Next.js application for managing logistics, including orders, deliveries, and inventory for Nafoods.

## How to Deploy and Host on Vercel (Step-by-Step)

Vercel is the easiest and most recommended platform for hosting Next.js applications. Follow these steps carefully to get your application live on the web.

---

### Step 1: Push Your Project to a Git Repository

Before you can deploy, your project's code needs to live in an online Git repository.

1.  **Choose a Git Provider:** If you don't have one already, create an account on [GitHub](https://github.com/), [GitLab](https://gitlab.com/), or [Bitbucket](https://bitbucket.org/). GitHub is the most common.
2.  **Create a New Repository:** On your Git provider's website, create a new, empty repository. Do **not** initialize it with a README or .gitignore file, as your project already has these.
3.  **Link and Push Your Code:**
    *   Open a terminal or command prompt in your project's root directory.
    *   Initialize a local Git repository: `git init`
    *   Add all your files: `git add .`
    *   Make your first commit: `git commit -m "Initial commit"`
    *   Link it to the remote repository you created (replace the URL with your own):
        `git remote add origin https://github.com/your-username/your-repo-name.git`
    *   Push your code to the remote repository: `git push -u origin main` (or `master`)

---

### Step 2: Import Your Project into Vercel

Now you will connect Vercel to your Git repository.

1.  **Sign Up for Vercel:** Go to [vercel.com/signup](https://vercel.com/signup) and create an account. It's easiest to sign up using your GitHub (or other Git provider) account.
2.  **Import Your Project:**
    *   Once logged in, you will be on your Vercel Dashboard.
    *   Click the **"Add New..."** button and select **"Project"**.
    *   Vercel will ask to connect to your Git provider. Grant it access.
    *   Find the repository you just pushed your code to and click the **"Import"** button next to it.

---

### Step 3: Configure Your Project in Vercel

Vercel automatically detects that this is a Next.js project, so the build settings are usually correct by default. The most important step here is adding your environment variables.

1.  **Project Name:** You can keep the default name or change it.
2.  **Framework Preset:** Vercel should automatically select "Next.js". Leave this as is.
3.  **Environment Variables (CRITICAL):**
    *   Expand the "Environment Variables" section.
    *   You need to add your Gemini API key for the AI features to work.
    *   Add a new variable:
        *   **Name:** `GEMINI_API_KEY`
        *   **Value:** Paste your actual Gemini API key here. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
4.  **Deploy:** Click the **"Deploy"** button.

---

### Step 4: You're Live!

Vercel will now start building and deploying your application. You'll see a console output of the process. This may take a few minutes.

Once it's complete, you'll see a "Congratulations!" screen with a screenshot of your live application. Vercel will provide you with a public URL (e.g., `your-project-name.vercel.app`) where you can access your live site.

Your application is now deployed and hosted on Vercel's global infrastructure! Any future pushes to your Git repository's `main` branch will automatically trigger a new deployment.
