const {GoogleGenerativeAI} = require("@google/generative-ai");
const {CohereClient} = require('cohere-ai');

const OpenAI = require('openai');

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY, //OPEN ROUTER
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);  //gemini 
const cohere = new CohereClient({token: process.env.COHERE_API_KEY}); //cohere
// const openrouter = new OpenRouter({apiKey: process.env.OPENROUTER_API_KEY});

// async function askAI(prompt)
// {
//     try{
//         const model = genAI.getGenerativeModel({
//             model: "gemini-3-flash-preview"
//         });

//         const result = model.generateContent(prompt);
//         const response = (await result).response;

//         return response.text();


//     }catch(error)
//     {
//         console.log("Gemini Error: ", error.message);
//         throw error;
        
//     }
// }

async function askAI(prompt) {
  try {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-oss-120b:free",
      messages: [
        {
          role: "user",
          content: prompt   // 👈 simple text (no need for array)
        }
      ],
      max_tokens: 1000
    });

    return completion?.choices?.[0]?.message?.content || "No response";

  } catch (error) {
    console.log("AI Error:", error.message);
    throw error;
  }
}


async function getEmbedding(text)
{
  try{
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const embedding = await openai.embeddings.create({
      model: "nvidia/llama-nemotron-embed-vl-1b-v2:free",
      input: [
        {
          content: [
            { type: "text", text: text},
          ]
        }
      ],
      encoding_format: "float"
    })

    return embedding.data[0].embedding;


  }catch(error)
  {
    console.log("Embedding Error:", error.message);
    throw error;
  }
}

// async function getEmbedding(text)
// {
//     const embed = await cohere.embed({
//         texts: [text],
//         model: "embed-v4.0",
//         input_type: "search_document", // Mandatory for v3 and v4 models
//         embedding_types: ["float"],
//     })
//     return embed.embeddings.float[0];
// }




module.exports = { askAI, getEmbedding };