const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
    try {
        const response = await axios.get(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
        );
        
        console.log("✅ AVAILABLE MODELS:");
        // Filter for models that support "generateContent"
        const models = response.data.models.filter(m => 
            m.supportedGenerationMethods.includes("generateContent")
        );
        
        models.forEach(model => {
            console.log(`- ${model.name.replace('models/', '')}`); // Prints just the name
        });

    } catch (error) {
        console.error("❌ Error fetching models:", error.response ? error.response.data : error.message);
    }
}

listModels();