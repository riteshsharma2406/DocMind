// to get the most relevant chunk from all the parsed storedChunks


const {cosineSimilarity} = require('./similarity.js');
const {getEmbedding} = require('../services/aiService.js')

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

module.exports = {getRelevantChunks};