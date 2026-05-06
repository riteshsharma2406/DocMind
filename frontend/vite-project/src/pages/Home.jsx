
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const Home = () => {
  const token = localStorage.getItem("token");

  const getUsernameFromToken = () => {
    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.username || decoded.name || decoded.sub || "User";
    } catch {
      return "User";
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const username = getUsernameFromToken();
  const avatarLetter = username.charAt(0).toUpperCase();

  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [documents, setDocuments] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleUpload = async () => {
    if (!file) { showToast("File is required", "error"); return; }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("https://docmind-backend-31ib.onrender.com/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      console.log(data);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      await fetchDocuments();
    } catch (e) {
      console.log(e);
      showToast("Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleAsk = async () => {
    if (!question) { showToast("Question required", "error"); return; }
    setAsking(true);
    try {
      const res = await fetch("https://docmind-backend-31ib.onrender.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || "Failed to fetch answer", "error"); return; }
      setAnswer(data.answer);
      setSources(data.source || []);
    } catch (e) {
      console.log(e);
      showToast("Error fetching answer", "error");
    } finally {
      setAsking(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://docmind-backend-31ib.onrender.com/document", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDocuments(data.files || []);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteDocument = async (docId) => {
    setDeletingId(docId);
    try {
      const res = await fetch(`https://docmind-backend-31ib.onrender.com/document/${docId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.message || "Delete Failed", "error"); return; }
      showToast("Document deleted", "success");
      await fetchDocuments();
    } catch (e) {
      console.log(e);
    } finally {
      setDeletingId(null);
    }
  };

  const toastIcons = { success: "✓", error: "✕", info: "ℹ" };

  // file extension helper
  const getExt = (name = "") => name.split(".").pop().toUpperCase().slice(0, 4);

  return (
    <>

      {/* ── Floating Profile ── */}
      <div className="profile-card">
        <div className="profile-avatar">{avatarLetter}</div>
        <div className="profile-info">
          <div className="profile-name">{username}</div>
          <div className="profile-status">
          </div>
        </div>
        <div className="profile-sep" />
        <button className="logout-btn" onClick={handleLogout}>
          Sign out <i className="logout-arrow">→</i>
        </button>
      </div>

      {/* ── Toast ── */}
      {toast.show && (
        <div className={`custom-toast ${toast.type}`}>
          <div className="toast-icon">{toastIcons[toast.type]}</div>
          {toast.message}
        </div>
      )}

      <div className="app-wrapper">
        <header className="header">
          <div className="logo-badge"><div className="logo-dot"></div>AI Document Intelligence</div>
          <h1 className="app-title">DocMind AI</h1>
          <p className="app-subtitle">Upload a PDF. Ask anything. Get instant answers.</p>
        </header>

        <div className="main-card">

          {/* ── Upload Card ── */}
          <div className="card">
            <div className="card-header">
              <div className="card-icon purple">📄</div>
              <span className="card-title">Upload Document</span>
            </div>
            <div className="field-group">
              <div className="input-wrap" />
              <div className="input-wrap">
                <label className="input-label">PDF File</label>
                <div className="file-drop">
                  <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
                  <div className="file-drop-icon">📂</div>
                  <div className="file-drop-text"><span>Choose file</span> or drag & drop here</div>
                  {file && <div className="file-name">✓ {file.name}</div>}
                </div>
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleUpload} disabled={uploading}>
              {uploading ? <><div className="btn-spinner" /> Uploading…</> : <>↑ Upload PDF</>}
            </button>
            {uploadSuccess && <div className="success-toast">✓ Document uploaded successfully!</div>}
          </div>

          <div className="divider" />

          {/* ── Documents List Card ── */}
         <div className="card">
            <div className="card-header">
              <div className="card-icon orange">🗂️</div>
              <span className="card-title">Your Documents</span>
              {documents.length > 0 && (
                <span className="card-count">{documents.length} file{documents.length !== 1 ? "s" : ""}</span>
              )}
            </div>

            {documents.length === 0 ? (
              <div className="doc-empty">
                <div className="doc-empty-icon">📭</div>
                <div className="doc-empty-text">No documents uploaded yet</div>
              </div>
            ) : (
              <div className="document-list">
                {documents.map((doc) => (
                  <div className="document-item" key={doc.id}>
                    <div className="doc-ext-badge">{getExt(doc.fileName)}</div>
                    <div className="doc-info">
                      <div className="doc-name">{doc.fileName}</div>
                      <div className="doc-meta">PDF Document</div>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteDocument(doc.id)}
                      disabled={deletingId === doc.id}
                    >
                      {deletingId === doc.id ? (
                        <div className="btn-spinner" style={{ width: 12, height: 12 }} />
                      ) : (
                        "✕ Delete"
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="divider" />
          </div>



          {/* ── Ask Card ── */}
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
            <button className="btn btn-secondary" onClick={handleAsk} disabled={asking}>
              {asking ? <><div className="btn-spinner" /> Thinking…</> : <>⚡ Ask DocMind</>}
            </button>
          </div>

          {/* ── Answer Card ── */}
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
                      <li key={key}><div className="source-dot" />{source}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}

          {/* ── MCQ CTA ── */}
          <div className="mcq-cta">
            <div className="mcq-cta-left">
              <div className="mcq-cta-icon">🧠</div>
              <div className="mcq-cta-text">
                <div className="mcq-cta-title">Test your knowledge</div>
                <div className="mcq-cta-sub">Auto-generate a quiz from your documents</div>
              </div>
            </div>
            <button className="btn-mcq" onClick={() => (window.location.href = "/mcq")}>
              Generate MCQ <span className="btn-mcq-arrow">→</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default Home;