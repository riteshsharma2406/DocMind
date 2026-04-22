import { useState } from 'react'
import './App.css'


function App() {

  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);


  // console.log("userId:", userId);
  // console.log("file:", file);
  // console.log(question)


  // handle upload 
  const handleUpload = async () => {
    if(!file || !userId)
    {
      alert("File and userId required");
      return;
    }

    const formData = new FormData();
    formData.append("file",file);
    formData.append("userId", userId);

    try{
      const res = await fetch('http://localhost:3000/upload',{
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      console.log(data);

      alert("Upload Successful")
    }catch(e)
    {
      console.log(e)
      alert("Upload Failed")
    }
  }


  //handle ask
  const handleAsk = async ()=>{
    if(!question || !userId)
    {
      alert("Question and UserId required");
      return;
    }

    try{
      const res = await fetch('http://localhost:3000/ask',{
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({question,userId})
      });

      const data = await res.json();

      console.log(data);

      setAnswer(data.answer);
      setSources(data.source || []);
      
    }catch(e)
    {
      console.log(e);
      alert("Error fetching answer")
    }
  }

  return (
    <>
      <div>
        <h1>DocMind AI</h1>

        <h2>Upload PDF</h2>

        <input type="text" name="" id="" 
          placeholder='enter user id'
          value={userId}
          onChange={(e)=>setUserId(e.target.value)}
        />

        <input type="file" name="" id="" 
          onChange={(e)=>setFile(e.target.files[0])}
        />

        <button onClick={handleUpload}>Upload</button>

        <h2>Ask Question</h2>

        <input type="text" name="" id=""
          placeholder='Ask your question'
          value={question}
          onChange={(e)=>setQuestion(e.target.value)}
        />

        <button onClick={handleAsk}>Ask</button>

        <h2>Result</h2>

        {answer && (
          <div>
            <h3>Answer:</h3>
            <p>{answer}</p>

            <h3>Source:</h3>
            <ul>
              {sources.map((source,key)=>{
                return <li key={key}>{source}</li>
              })}
            </ul>
          </div>
        )}

      </div>
    </>
  )
  
}

export default App
