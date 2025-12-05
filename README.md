
# Run and deploy your Claridex app

Claridex is an AI‑powered assistant that helps you understand, compare, and reason about complex information with clear, structured outputs. It is deployed on Vercel for fast, reliable access and is developed locally using a modern Node.js toolchain.  

Live app: [**https://claridex-1f35.vercel.app/**](https://claridex-1f35.vercel.app/)  

---

## Run locally

**Prerequisites**

- Node.js (LTS recommended)  
- A valid API key for your chosen AI provider  

**1. Install dependencies**


**2. Configure environment variables**

Create a file named `.env.local` in the project root and add your API key:


> Even though the variable is named `GEMINI_API_KEY`, you can point it to any compatible backend or proxy you are using from your Kiro‑driven setup, as long as the app expects an OpenAI‑style or Gemini‑style endpoint.

**3. Start the development server**


Then open `http://localhost:3000` in your browser to use Claridex locally.

---

## Deploy on Vercel

Claridex is optimized for deployment on Vercel’s AI‑friendly hosting platform.

1. Push this repository to GitHub, GitLab, or Bitbucket.  
2. Import the project into Vercel and select the appropriate framework preset (for example, Next.js or a compatible React setup).  
3. In the Vercel project settings, add `GEMINI_API_KEY` under **Environment Variables**, set it to the same value you use locally, and redeploy.  

Your production deployment will be available at a Vercel URL such as:

https://claridex-1f35.vercel.app/

You can optionally attach a custom domain from the Vercel dashboard.
