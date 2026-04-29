const {askAI} = require('../services/aiService.js');
const {getStoredChunks} = require('./uploadController.js');

async function generateMCQ(req,res){
    try{
        const userId = req.userId;
        const {fileName} = req.body;
        
        const allChunks = getStoredChunks(userId);
        const storedChunks = allChunks.filter(chunk => chunk.fileName === fileName)
        
        if(!storedChunks.length)
        {
            res.status(400).json({message: "No Information found for selected file"})
        }

        const context = storedChunks.slice(0,8).map(chunk => chunk.text).join("\n\n");

        const prompt = `Generate 5 multiple choice question based only on the context below
        
        Return STRICTLY only valid JSON in the exact format
        [
            {
                "question": "string",
                "option": ["A", "B", "C", "D"],
                "correctAnswer": "string"
            }
        ]
            Rules:
            - "options" must contain FULL answer choices, not A/B/C/D
            - "correctAnswer" must exactly match one of the options
            - No Explanation
            - No markdown
            - No extra text
            - only valid JSON array

            Context: ${context}
        `

        const aiResponse = await askAI(prompt);
        res.status(200).json({
            message: "MCQ Generated",
            mcqs: aiResponse
        })
    }catch(e)
    {
        console.log(e);
        res.status(500).json({message: "MCQ Generation Failed"})
    }
}

module.exports = {generateMCQ};