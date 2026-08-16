# 🔥 Roast My GitHub

An AI-powered application that analyzes GitHub profiles and generates a savage, humorous "roast" based on your coding stats, languages, and bio.

**🚀 Live Demo:** [CLICK HERE TO GET ROASTED](https://roast-my-github-sandy.vercel.app/)

![Project Screenshot](client/public/image.png)

## 🌟 Features
- **Real-time GitHub Data:** Fetches user stats, repositories, and activity using the GitHub API.
- **⚡ Ultra-Fast AI Analysis:** Powered by **Groq** (running **Meta Llama 3**) for instant, low-latency roasts.
- **Cyberpunk UI:** A fully responsive, dark-mode interface built with React.
- **Full Stack:** Secure backend proxy to handle API keys and logic.

## 🛠️ Tech Stack
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **AI Engine:** Groq SDK (Model: llama-3.3-70b-versatile)
- **Styling:** CSS3 (Custom Cyberpunk Theme)
- **Deployment:** Vercel (Frontend) & Render (Backend)

## ⚡ Getting Started Locally

If you want to run this project on your own machine:

1. **Clone the repository**
   ```bash
   git clone https://github.com/dhruv-dev25/roast-my-github-fv
   cd roast-my-github

2. **Setup Backend**
    ```bash
    cd server
    npm install
    # Create a .env file and add your GEMINI_API_KEY
    npm start

3. **Setup Frontend**
    ```bash
    cd client
    npm install
    npm run dev

## 🛡️ Security

- **API keys are secured server-side.**
- **No personal data is stored; requests are processed in real-time.**

# Made by Dhruv Gupta.