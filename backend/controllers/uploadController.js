const fs = require('fs');
const { PDFParse } = require('pdf-parse');
const path = require('path');
const { getEmbedding } = require('../services/aiService.js');
const { chunkText } = require('../utils/chunk.js');
// const DATA_PATH = path.join(__dirname, '../data/data.json');
const Document = require('../models/document.js')

// let document = [];

// if(fs.existsSync(DATA_PATH))
// {
//     document = JSON.parse(fs.readFileSync(DATA_PATH));
// }

async function uploadFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.userId || "defaultUser";

    const filePath = req.file.path;

    const dataBuffer = await fs.promises.readFile(filePath);
    const uint8Array = new Uint8Array(dataBuffer);

    const parser = new PDFParse(uint8Array);
    const result = await parser.getText();

    const chunks = chunkText(result.text);

    const docChunks = [];

    for (let chunk of chunks) {
      const embedding = await getEmbedding(chunk);
      docChunks.push({
        text: chunk,
        embedding: embedding,
        fileName: req.file.originalname
      });
    }

    // document.push({
    //     userId,
    //     // fileName: req.file.originalname,
    //     chunks: docChunks
    // });



    // fs.writeFileSync(DATA_PATH, JSON.stringify(document, null, 2));

    await Document.create({
      userId,
      chunks: docChunks

    })

    fs.unlinkSync(filePath);

    res.status(200).json({
      message: "file uploaded and parsed",
      preview: result.text?.substring(0, 300) || "No text found"
    });

  } catch (error) {
    console.log("FULL ERROR", error);
    res.status(500).json({ error: error.message });
  }
}

async function getUserDocument(req,res)
{
  try{
    const userId = req.userId;
    const userDocs = await Document.find({userId})

    const files = [...new Set(userDocs.flatMap(doc => doc.chunks.map(chunk => chunk.fileName)))];

    res.status(200).json({
      files,
      message: "All user documents"
    })
  }catch(e)
  {
    console.log(e);
    res.status(500).json({message: "Error fetching document"})
  }
}

async function getStoredChunks(userId) {
  const userDoc = await Document.find({userId})
  return userDoc.flatMap(doc=> doc.chunks);
}

module.exports = { uploadFile, getStoredChunks, getUserDocument};