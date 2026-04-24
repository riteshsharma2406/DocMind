import React from "react";
import { useState } from "react";

const Home = () => {

  const token = localStorage.getItem("token"); 

  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUpload = async () => {

    if(!file)
    {
      alert('File Required');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });
      const data = await res.json();
      console.log(data);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (e) {
      console.log(e);
      alert("Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  const handleAsk = async () => {

    if(!question)
    {
      alert('Question required');
      return;
    }

    setAsking(true);
    try {
      const res = await fetch("http://localhost:3000/ask", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({question})
      });
      const data = await res.json();
      setAnswer(data.answer);
      setSources(data.source || []);
    } catch (e) {
      console.log(e);
      alert("Error fetching answer");
    } finally {
      setAsking(false);
    }
  };

  return (
    <>
      <div className="app-wrapper">
        <header className="header">
          <div className="logo-badge">
            <div className="logo-dot"></div>
            AI Document Intelligence
          </div>
          <h1 className="app-title">DocMind AI</h1>
          <p className="app-subtitle">
            Upload a PDF. Ask anything. Get instant answers.
          </p>
        </header>

        <div className="main-card">
          {/* Upload Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-icon purple">📄</div>
              <span className="card-title">Upload Document</span>
            </div>
            <div className="field-group">
              <div className="input-wrap">
                {/* <label className="input-label">User ID</label>
                <input
                  type="text"
                  placeholder="e.g. user_123"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                /> */}
              </div>
              <div className="input-wrap">
                <label className="input-label">PDF File</label>
                <div className="file-drop">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <div className="file-drop-icon">📂</div>
                  <div className="file-drop-text">
                    <span>Choose file</span> or drag & drop here
                  </div>
                  {file && <div className="file-name">✓ {file.name}</div>}
                </div>
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <div className="btn-spinner"></div> Uploading…
                </>
              ) : (
                <>↑ Upload PDF</>
              )}
            </button>
            {uploadSuccess && (
              <div className="success-toast">
                ✓ Document uploaded successfully!
              </div>
            )}
          </div>

          <div className="divider" />

          {/* Ask Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-icon teal">💬</div>
              <span className="card-title">Ask a Question</span>
            </div>
            <div className="field-group">
              <div className="input-wrap">
                <label className="input-label">Your Question</label>
                <input
                  type="text"
                  placeholder="What does the document say about…?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                />
              </div>
            </div>
            <button
              className="btn btn-secondary"
              onClick={handleAsk}
              disabled={asking}
            >
              {asking ? (
                <>
                  <div className="btn-spinner"></div> Thinking…
                </>
              ) : (
                <>⚡ Ask DocMind</>
              )}
            </button>
          </div>

          {/* Result Card */}
          {answer && (
            <div className="card answer-block">
              <div className="card-header">
                <div className="card-icon green">✨</div>
                <span className="card-title">Answer</span>
              </div>
              <div className="answer-text">{answer}</div>
              {sources.length > 0 && (
                <>
                  <div className="sources-label">Sources</div>
                  <ul className="sources-list">
                    {sources.map((source, key) => (
                      <li key={key}>
                        <div className="source-dot"></div>
                        {source}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
