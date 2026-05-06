const express = require('express');
require('dotenv/config');
const cors = require('cors')
const { uploadFile, getUserDocument, deleteDocument } = require('./controllers/uploadController.js');
const {askQuestion} = require('./controllers/askController.js')
const { askAI } = require('./services/aiService.js');
const { upload } = require('./middleware/upload.js');
const { signup, login } = require('./controllers/authController.js');
const {generateMCQ} = require('./controllers/mcqController.js')
const authMiddleWare = require('./middleware/authMiddleWare.js')
const {connectDB} = require('./config/db.js')

const app = express();

app.use(express.json());
app.use(cors());


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

app.post('/upload',authMiddleWare,  upload.single("file"), uploadFile); //uploadController.js

app.post('/ask',authMiddleWare, askQuestion) //askController.js

app.post('/mcq', authMiddleWare, generateMCQ) //mcqController.js

app.post('/signup', signup); //authController.js

app.post('/login', login); //authController.js

app.get('/document', authMiddleWare, getUserDocument) //uploadController.js

app.delete('/document/:id', authMiddleWare, deleteDocument) //uploadController.js


connectDB();
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