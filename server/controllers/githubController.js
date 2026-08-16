const axios = require('axios');
const Groq = require("groq-sdk");
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.getGithubData = async (req, res) => {
    const { username } = req.body;

    const config = {
        headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` }
    };

    try {
        // 1. Parallel Data Fetching
        const [userRes, reposRes] = await Promise.all([
            axios.get(`https://api.github.com/users/${username}`, config),
            axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, config)
        ]);

        const user = userRes.data;
        const repos = reposRes.data;

        // 2. Advanced Stat Calculation 
        const totalStars = repos.reduce((acc, r) => acc + r.stargazers_count, 0);
        const totalForks = repos.filter(r => r.fork).length;
        const ownRepos = repos.length - totalForks;
        
        // Calculate "Clout Ratio" (Desperation index)
        const following = user.following || 1; // Avoid divide by zero
        const ratio = (user.followers / following).toFixed(2);
        
        // Language Analysis
        const languages = repos.map(r => r.language).filter(Boolean);
        const favLang = languages.sort((a,b) =>
            languages.filter(v => v===a).length - languages.filter(v => v===b).length
        ).pop() || "None";

        // Activity Check (Is this account dead?)
        const lastUpdate = new Date(user.updated_at);
        const daysSinceUpdate = Math.floor((new Date() - lastUpdate) / (1000 * 60 * 60 * 24));
        const isDead = daysSinceUpdate > 180; // 6 months inactive

        // 3. Construct the "Savage Context"
        const profileStats = `
            - Username: ${user.login}
            - Bio: "${user.bio || 'Empty (Lazy)'}"
            - Followers: ${user.followers} (Following: ${user.following}) -> Ratio: ${ratio}
            - Total Stars: ${totalStars} across ${user.public_repos} repos
            - Forked Repos: ${totalForks} (Original work: ${ownRepos})
            - Main Language: ${favLang}
            - Last Active: ${daysSinceUpdate} days ago ${isDead ? "(Officially Dead)" : ""}
            - Company: "${user.company || 'Unemployed'}"
            - Location: "${user.location || 'Unknown'}"
        `;

        // 4. The "Good" System Prompt
        const systemPrompt = `
            You are a cynical, elite Senior DevOps Engineer at a FAANG company. 
            You judge developers based on their GitHub metrics. You are mean, funny, and technically sharp.
            
            Here are your rules for roasting:
            1. If they have high followers but low stars, call them an "influencer wannabe" who doesn't code.
            2. If they have many forks (${totalForks}), accuse them of just copying other people's work.
            3. If their ratio is below 0.5, mock them for following everyone to get followers back.
            4. Stereotype them heavily based on their main language (${favLang}).
            5. If they are inactive (${daysSinceUpdate} days), ask if they quit coding to become a manager.
            6. Keep it under 100 words. Brutal honesty. No hashtags.
        `;

        // 5. Call Groq (Llama 3.3)
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Roast this specific profile details:\n${profileStats}` }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.8, // Slightly higher for more creative insults
            max_tokens: 200,
        });

        const roast = chatCompletion.choices[0]?.message?.content || "This profile is so boring I can't even roast it.";

        // 6. Send JSON
        res.json({ 
            username: user.login,
            name: user.name || user.login,
            avatar: user.avatar_url,      
            total_stars: totalStars,      
            fav_language: favLang,
            followers: user.followers,
            following: user.following,
            roast: roast                  
        });

    } catch (error) {
        console.error("Roast Error:", error.message);
        
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: "User not found. Are you sure they exist?" });
        }
        if (error.error && error.error.code === 'rate_limit_exceeded') {
             return res.status(429).json({ error: "The roasting oven is overheated. Try again in a minute." });
        }
        res.status(500).json({ error: "Server crashed. Probably a skill issue." });
    }
};