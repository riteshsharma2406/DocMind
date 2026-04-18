const express = require('express');
require('dotenv/config');
const { uploadFile } = require('./controllers/uploadController.js');
const {askQuestion} = require('./controllers/askController.js')
const { askAI } = require('./services/aiService.js');
const { upload } = require('./middleware/upload.js');

const app = express();

app.use(express.json());


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

app.post('/upload', upload.single("file"), uploadFile); //uploadController.js

app.post('/ask', askQuestion) //askController.js

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