const express = require('express');
require('dotenv/config');
const fs = require('fs');
const { PDFParse } = require('pdf-parse');
const { askAI, getEmbedding } = require('./services/aiService.js');
const { upload } = require('./uploads/middleware/upload.js');

const app = express();

app.use(express.json());

// store all the chunks
let storedChunks = [];


// to create chunks from the parsed text
function chunkText(text, chunkSize = 100)
{
  const chunks = [];

  for(let i=0; i<text.length; i+= chunkSize)
  {
    chunks.push(text.slice(i,i+chunkSize));
  }
  return chunks;
}

// to get the most relevant chunk from all the parsed storedChunks
async function getRelevantChunks(question, chunks)
{
  const questionEmbedding = await getEmbedding(question);

  const scoredChunks = chunks.map(item =>{
    const score = cosineSimilarity(questionEmbedding, item.embedding);

    return {
      text: item.text,
      score: score
    }
  });

    // DEBUG: print scores
  // console.log("SCORES:");
  // scoredChunks.forEach(c => {
  //   console.log(c.score.toFixed(4), "=>", c.text.substring(0, 50));
  // });

  scoredChunks.sort((a,b)=> b.score - a.score);

  const top = scoredChunks.slice(0,2).map(item => item.text);

  // console.log("Top Chunks: ", top);

  return top;
}

// cosine similarity function to compare embedding of question and chunks
function cosineSimilarity(a,b)
{
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for(let i=0; i<a.length; i++)
  {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }
  return dotProduct/(Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB))
}


app.get('/', (req, res) => {
  res.send('server running');
});


app.get('/test-ai', async (req, res) => {
  try {
    const result = await askAI('Explain binary search in simple terms');
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/upload', upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;

    const dataBuffer = await fs.promises.readFile(filePath);
    const uint8Array = new Uint8Array(dataBuffer);
    
    const parser = new PDFParse(uint8Array);
	  const result = await parser.getText();

    const chunks = chunkText(result.text);

    storedChunks = [];

    for(let chunk of chunks)
    {
      const embedding = await getEmbedding(chunk);
      storedChunks.push({
        text: chunk,
        embedding: embedding
      });
    }
    

    // storedChunks = chunks;
    // console.log('stored chunks: ', storedChunks);

    // delete file after processing
    fs.unlinkSync(filePath);

    res.status(200).json({
      message: "file uploaded and parsed",
      preview: result.text?.substring(0, 300) || "No text found"
    });

  } catch (error) {
    console.log("FULL ERROR", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/ask', async (req,res)=>{
  try{
    const {question} = req.body;

    if(!question)
    {
      return res.status(400).json({error: "Question required"})
    }

    if(storedChunks.length === 0 )
    {
      return res.status(400).json({error: "No file uploaded"});
    }

    const relevantChunks = await getRelevantChunks(question,storedChunks);
    // console.log("Question: ", question);
    // console.log('Relevant chunks: ', relevantChunks);
    const context = relevantChunks.join(" ");

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

    res.status(200).json({answer});

  }catch(error)
  {
    console.log(error);
    res.status(500).json({error: error.message});
  }
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server is running");
});


// (async () => {
//   // const emb = await getEmbedding("binary search algorithm");
//   // console.log("Embedding:", emb);
//   const a = await getEmbedding("Linear Search");
//   const b = await getEmbedding("Fast searching Algorithm");
//   console.log(cosineSimilarity(a,b));
// })();



module.exports = app;