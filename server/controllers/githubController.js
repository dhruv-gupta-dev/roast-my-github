const axios = require('axios');

exports.getGithubData = async (req, res) => {
    const { username } = req.body;
    
    console.log("Received username:", username); 

    try {
        // CALL 1: Get User Profile
        const response = await axios.get(`https://api.github.com/users/${username}`);
        const rawData = response.data;

        // CALL 2: Get User Repos
        const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        const repos = reposResponse.data;

        // We loop through every repo and add up the 'stargazers_count'
        const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);

        // This maps the languages and picks the one that shows up the most
        const languages = repos.map(r => r.language).filter(Boolean);
        const favoriteLanguage = languages.sort((a,b) =>
              languages.filter(v => v===a).length - languages.filter(v => v===b).length
        ).pop() || "None";

        const cleanProfile = {
            username: rawData.login,       
            name: rawData.name,
            bio: rawData.bio,
            DOC: new Date(rawData.created_at).toDateString(), 
            public_repos: rawData.public_repos,
            followers: rawData.followers,
            following: rawData.following,

            total_stars: totalStars, 
            fav_language: favoriteLanguage,
            // format the date
            last_pushed: repos.length > 0 ? new Date(repos[0].pushed_at).toDateString() : "Never",
            avatar: rawData.avatar_url,
        };

        console.log(cleanProfile); 
        res.json(cleanProfile);

    } catch (error) {
        console.error(error);
        res.status(404).json({ message: "User not found" });
    }
};