import React, { useEffect, useState } from "react";

const MCQ = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [mcqs, setMcqs] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://docmind-backend-31ib.onrender.com/document", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setFiles(data.files || []);
      } catch (e) {
        console.log(e);
      }
    };
    fetchDocument();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleGenerateMCQ = async () => {
    if (!selectedFile) { showToast("Please select a file", "error"); return; }
    setLoading(true);
    setMcqs([]);
    setScore(null);
    setSelectedAnswer({});
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://docmind-backend-31ib.onrender.com/mcq", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fileName: selectedFile }),
      });
      const data = await res.json();

      if(!res.ok)
      {
        showToast(data.message || "Failed to Generate MCQ", "error")
      }

      setMcqs(JSON.parse(data.mcqs));
      showToast("Quiz generated! Good luck.", "success");
    } catch (e) {
      console.log(e);
      showToast("Failed to generate MCQ", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuiz = () => {
    let calculatedScore = 0;
    mcqs.forEach((mcq, idx) => {
      if (selectedAnswer[idx] === mcq.correctAnswer) calculatedScore++;
    });
    setScore(calculatedScore);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  

  const toastIcons = { success: "✓", error: "✕", info: "ℹ" };
  const answeredCount = Object.keys(selectedAnswer).length;
  const percentage = score !== null ? Math.round((score / mcqs.length) * 100) : null;
  const scoreColor = percentage >= 70 ? "#34d399" : percentage >= 40 ? "#fbbf24" : "#f87171";

  return (
    <>
      {/* ── Toast ── */}
      {toast.show && (
        <div className={`custom-toast ${toast.type}`}>
          <div className="toast-icon">{toastIcons[toast.type]}</div>
          {toast.message}
        </div>
      )}

      <div className="mcq-wrapper">
        <div className="mcq-header">
          <div className="logo-badge"><div className="logo-dot" /> Quiz Generator</div>
          <h1 className="mcq-title">MCQ Quiz</h1>
          <p className="mcq-subtitle">Select a document and generate an instant quiz</p>
        </div>

        {score !== null && (
          <div
            className="score-banner"
            style={{
              background: `rgba(${percentage >= 70 ? "52,211,153" : percentage >= 40 ? "251,191,36" : "248,113,113"},0.08)`,
              borderColor: `${scoreColor}44`,
            }}
          >
            <div className="score-circle" style={{ borderColor: scoreColor, color: scoreColor, background: `${scoreColor}15` }}>
              <span className="score-num">{score}</span>
              <span className="score-den">/{mcqs.length}</span>
            </div>
            <div className="score-text-group">
              <div className="score-title" style={{ color: scoreColor }}>
                {percentage >= 70 ? "Great work! 🎉" : percentage >= 40 ? "Not bad! 💪" : "Keep practicing 📖"}
              </div>
              <div className="score-sub">
                You scored {score} out of {mcqs.length} — {percentage}%
              </div>
            </div>
          </div>
        )}

        <div className="selector-card">
          <span className="selector-label">Choose Document</span>
          <div className="selector-row">
            <select
              className="file-select"
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
            >
              <option value="">Select a document…</option>
              {files.map((file) => (
                <option value={file.fileName} key={file.id}>{file.fileName}</option>
              ))}
            </select>
            <button className="btn-generate" onClick={handleGenerateMCQ} disabled={loading}>
              {loading ? <><div className="btn-spinner" /> Generating…</> : <>⚡ Generate Quiz</>}
            </button>
          </div>
        </div>

        {loading && [1, 2, 3].map((i) => (
          <div className="skeleton-card" key={i}>
            <div className="skel-line" style={{ width: "75%", marginBottom: "16px" }} />
            {[1, 2, 3, 4].map((j) => (
              <div className="skel-line" key={j} style={{ width: `${55 + j * 8}%`, height: "10px" }} />
            ))}
          </div>
        ))}

        {mcqs.length > 0 && score === null && (
          <div className="progress-bar-wrap" style={{ maxWidth: 640, width: "100%" }}>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${(answeredCount / mcqs.length) * 100}%` }} />
            </div>
            <span className="progress-label">{answeredCount}/{mcqs.length} answered</span>
          </div>
        )}

        {mcqs.length > 0 && (
          <div className="quiz-container">
            {mcqs.map((mcq, idx) => (
              <div key={idx} className="mcq-card" style={{ animationDelay: `${idx * 60}ms` }}>
                <div className="mcq-question">
                  <span className="q-num">Q{idx + 1}.</span>
                  {mcq.question}
                </div>
                <div className="options-grid">
                  {mcq.option.map((opt, i) => {
                    let cls = "option-btn";
                    if (score !== null) {
                      if (opt === mcq.correctAnswer) cls += " correct";
                      else if (selectedAnswer[idx] === opt) cls += " wrong";
                    } else if (selectedAnswer[idx] === opt) {
                      cls += " selected";
                    }
                    return (
                      <button
                        key={i}
                        type="button"
                        className={cls}
                        onClick={() => {
                          if (score !== null) return;
                          setSelectedAnswer((prev) => ({ ...prev, [idx]: opt }));
                        }}
                      >
                        <span className="option-dot">
                          {score !== null && opt === mcq.correctAnswer ? "✓" :
                           score !== null && selectedAnswer[idx] === opt ? "✕" :
                           selectedAnswer[idx] === opt ? "●" : ""}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Submit ── */}
        {mcqs.length > 0 && score === null && (
          <button className="btn-submit" onClick={handleSubmitQuiz}>
            Submit Quiz →
          </button>
        )}

      </div>
    </>
  );
};

export default MCQ;