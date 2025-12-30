const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function checkModels() {
  try {
    // Note: The SDK doesn't have a direct "getQuota" function, 
    // so we test the most reliable models to see which one is active.
    const modelsToTest = [
      "gemini-1.5-flash",
      "gemini-2.0-flash",
      "gemini-2.5-flash-lite"
    ];

    console.log("--- 🔍 Checking AI Model Access ---");

    for (const modelName of modelsToTest) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        // Sending a tiny request to check if the quota is > 0
        await model.generateContent("hi");
        console.log(`✅ ${modelName}: Active and responding.`);
      } catch (error) {
        if (error.message.includes("429")) {
          console.log(`❌ ${modelName}: Quota EXCEEDED (429 Error).`);
        } else {
          console.log(`❓ ${modelName}: Error - ${error.message}`);
        }
      }
    }
  } catch (err) {
    console.error("General Error:", err.message);
  }
}

checkModels();