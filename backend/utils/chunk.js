function chunkText(text, chunkSize = 100)
{
  const chunks = [];

  for(let i=0; i<text.length; i+= chunkSize)
  {
    chunks.push(text.slice(i,i+chunkSize));
  }
  return chunks;
}

module.exports = {chunkText};