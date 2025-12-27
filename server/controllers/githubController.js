const axios = require('axios');

exports.getGithubData = async (req, res) => {
    const { username } = req.body;
    
    console.log("Received username:", username); 

    try {
        const response = await axios.get(`https://api.github.com/users/${username}`);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: "User not found" });
    }
};