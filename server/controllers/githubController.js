const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Use the model that worked: gemini-2.5-flash-lite
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

exports.getGithubData = async (req, res) => {
    const { username } = req.body;

    try {
        // 1. Fetch Data from GitHub
        const userRes = await axios.get(`https://api.github.com/users/${username}`);
        const reposRes = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=50`);
        
        const user = userRes.data;
        const repos = reposRes.data;
        
        // 2. Calculate Stats 
        const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
        const languages = repos.map(r => r.language).filter(Boolean);
        const favLang = languages.sort((a,b) =>
            languages.filter(v => v===a).length - languages.filter(v => v===b).length
        ).pop() || "None";

        // 3. Prepare the Prompt for AI
        const profileSummary = `
            Username: ${user.login}
            Bio: "${user.bio || 'No bio'}"
            Followers: ${user.followers}
            Total Stars: ${totalStars}
            Favorite Language: ${favLang}
            Public Repos: ${user.public_repos}
            Last Updated: ${new Date(user.updated_at).toDateString()}
        `;

        const prompt = `
            You are a savage technical recruiter who roasts developer portfolios. 
            Roast this GitHub profile based on the following stats:
            ${profileSummary}
            
            Be short, funny, and mean. Mention their specific language choice and low star count if applicable.
            Keep it under 100 words.
        `;


        const result = await model.generateContent(prompt);
        const roast = result.response.text();

        res.json({ 
            username: user.login,
            name: user.name || user.login,
            avatar: user.avatar_url,      
            total_stars: totalStars,      
            fav_language: favLang,        
            roast: roast                  
        });

    } catch (error) {
        console.error("Error details:", error.message);

        // 1. Check if the error is from GitHub (e.g., User Not Found)
         if (error.response && error.response.status === 404) {
             return res.status(404).json({ 
            error: "That user doesn't exist! Are you sure they are even a developer? 🕵️" 
            });
        }

        // 2. Check for secondary rate limits or other GitHub issues
        if (error.response && error.response.status === 403) {
            return res.status(403).json({ 
                error: "GitHub is ignoring me right now. Try again in a minute! ⏳" 
            });
        }

        // 3. Fallback for server or Gemini AI crashes
        res.status(500).json({ 
        error: "The AI is too tired to roast right now. Maybe their code is actually okay? 💤" 
         });
    }
};