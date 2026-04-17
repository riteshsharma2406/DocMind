const {GoogleGenerativeAI} = require("@google/generative-ai");
const {CohereClient} = require('cohere-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);  //gemini 
const cohere = new CohereClient({token: process.env.COHERE_API_KEY}); //cohere

async function askAI(prompt)
{
    try{
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview"
        });

        const result = model.generateContent(prompt);
        const response = (await result).response;

        return response.text();

    }catch(error)
    {
        console.log("Gemini Error: ", error.message);
        throw error;
        
    }
}

async function getEmbedding(text)
{
    const embed = await cohere.embed({
        texts: [text],
        model: "embed-v4.0",
        input_type: "search_document", // Mandatory for v3 and v4 models
        embedding_types: ["float"],
    })
    return embed.embeddings.float[0];
}

module.exports = { askAI, getEmbedding };