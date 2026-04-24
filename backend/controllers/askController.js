const { askAI } = require('../services/aiService');
const {getStoredChunks} = require('../controllers/uploadController.js');
const {getRelevantChunks} = require('../utils/relevant.js');
const { set } = require('../index.js');


async function askQuestion(req,res){

    try{
        const {question} = req.body;
        const userId = req.userId || "defaultUser";

        if(!question)
        {
            return res.status(400).json({error: "Question required"})
        }

        let storedChunks = getStoredChunks(userId);

        if(storedChunks.length === 0 )
        {
            return res.status(400).json({error: "No file uploaded"});
        }

        const relevantChunks = await getRelevantChunks(question,storedChunks);
        // console.log("Question: ", question);
        // console.log('Relevant chunks: ', relevantChunks);
        const context = relevantChunks.map(c=>c.text).join(" ");
        const source = [...new Set(relevantChunks.map(c => c.fileName))]

        if (!context) {
        return res.json({ answer: "No relevant information found" });
        }

        // const context = storedChunks.slice(0,3).join(" ");

        const answer = await askAI(`
        You are an AI study assistant.

        Answer only using the provided context
        if the answer is not in the context say "Not found in document".

        Context:
        ${context}

        Question:
        ${question}

        Answer clearly and directly:
        `);

        res.status(200).json({answer, source});

  }catch(error)
  {
        console.log(error);
        res.status(500).json({error: error.message});
  }

}

module.exports = {askQuestion}