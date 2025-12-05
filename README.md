# Nafoods Distribution Hub

This is a Next.js application for managing logistics, including orders, deliveries, and inventory for Nafoods.

## How to Deploy and Host on Vercel (Step-by-Step Guide for Beginners)

Vercel is a platform that makes it incredibly easy to put your Next.js application on the internet for anyone to see. This guide will walk you through every single step.

---

### Step 1: Push Your Project to a Git Repository

Before you can host your website, the code needs to be stored online. We will use GitHub for this. GitHub is a website that stores your project's code in what's called a "repository" (or "repo").

1.  **Create a GitHub Account:**
    *   If you don't have one, go to [github.com](https://github.com) and sign up. It's free.

2.  **Create a New Repository on GitHub:**
    *   Go to your GitHub dashboard and click the **"New"** button (usually a green button on the left).
    *   You'll be on a "Create a new repository" page.
    *   For **"Repository name"**, type in `distri` (to match the URL you shared).
    *   Leave it as a **"Public"** repository.
    *   **IMPORTANT:** Do **NOT** check any of the boxes like "Add a README file", "Add .gitignore", or "Choose a license". Your project already has these files.
    *   Click the big green **"Create repository"** button.

3.  **Link and Push Your Code from Your Computer:**
    *   After creating the repository, GitHub will show you a page with some commands. We only need a few of them.
    *   Open a terminal or command prompt on your computer in your project's folder.
    *   Type the following commands one by one, pressing `Enter` after each one.
    
    *   First, initialize a local Git repository:
        ```bash
        git init
        ```
    *   Next, add all your files to be tracked:
        ```bash
        git add .
        ```
    *   Then, save your files as a "commit" (a snapshot of your code):
        ```bash
        git commit -m "Initial commit"
        ```
    *   Now, link your local project to the GitHub repository you created (replace the URL with your own from the GitHub page):
        ```bash
        git remote add origin https://github.com/thangcq0310/distri.git
        ```
    *   Finally, push your code to GitHub:
        ```bash
        git push -u origin main
        ```
        *(Note: Your main branch might be called `master`. If `main` doesn't work, try `master`.)*

    *   Great! Your code is now on GitHub.

---

### Step 2: Import Your Project into Vercel

Now we'll tell Vercel where to find your code.

1.  **Sign Up for Vercel:**
    *   Go to [vercel.com/signup](https://vercel.com/signup).
    *   The easiest way is to click **"Continue with GitHub"**. This will link your Vercel and GitHub accounts, which makes importing projects very simple.

2.  **Import Your Project:**
    *   Once logged in, you'll be on your Vercel Dashboard.
    *   Click the **"Add New..."** button and select **"Project"**.
    *   Vercel will show a list of your GitHub repositories. Find your `distri` repository and click the **"Import"** button next to it.

---

### Step 3: Configure Your Project in Vercel

This is the final configuration step. Vercel is smart and handles most of this for you. We just need to give it your API key.

1.  **Project Name:** Vercel will automatically use `distri`. You can leave this as is.
2.  **Framework Preset:** Vercel will automatically detect "Next.js". Don't change this.
3.  **Environment Variables (CRITICAL STEP):**
    *   Find and expand the **"Environment Variables"** section. This is where you'll put your secret API key so the AI features can work.
    *   You need to get a Gemini API key from Google. Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and click **"Create API key"**. Copy the long string of characters it gives you.
    *   Back on the Vercel page, add a new variable:
        *   **Name:** `GEMINI_API_KEY`
        *   **Value:** Paste the API key you just copied from Google AI Studio.
    *   Click the **"Add"** button.

---

### Step 4: Deploy and You're Live!

1.  **Deploy:**
    *   Simply click the blue **"Deploy"** button.

2.  **Wait for the Magic:**
    *   Vercel will now start building and deploying your application. You'll see a screen with logs and status updates. This usually takes a couple of minutes.
    *   Once it's done, you'll get a "Congratulations!" screen with a preview of your live website.

Vercel will give you a public URL (like `distri.vercel.app`). That's it! Your application is now live on the internet. Any time you `git push` new changes to your GitHub repository, Vercel will automatically redeploy the site with the updates.
## Tối ưu hóa Lộ trình
- Đã bắt đầu triển khai thuật toán Dijkstra cơ bản.