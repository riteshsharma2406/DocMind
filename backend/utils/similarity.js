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

module.exports = {cosineSimilarity};