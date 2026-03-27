import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'

function App() {
  const [ count, setCount ] = useState(0)
  const [ code, setCode ] = useState(`function sum() {\n  return 1 + 1;\n}`)
  const [ review, setReview ] = useState(``)
  const [ isLoading, setIsLoading ] = useState(false)
  const [ error, setError ] = useState("")

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    setIsLoading(true);
    setError("");
    setReview("");
    
    try {
      const response = await axios.post('https://ai-learning-assistant-backend-mhq2.onrender.com/ai/get-review', { code })
      setReview(response.data)
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while connecting to the server.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">✨</span>
          <h1>AI Learning Assistant</h1>
        </div>
        <nav className="nav">
          <a href="#" className="nav-link active">Editor</a>
          <a href="#" className="nav-link">History</a>
          <a href="#" className="nav-link">Settings</a>
        </nav>
      </header>
      
      <main>
        <div className="left panel">
          <div className="panel-header">
            <span>Editor</span>
            <span className="lang-badge">JavaScript</span>
          </div>
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={20}
              className="editor"
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: 15,
                height: "100%",
                width: "100%",
                outline: "none",
              }}
            />
          </div>
          <button onClick={reviewCode} className={`review-btn ${isLoading ? 'loading' : ''}`}>
            {isLoading ? "Analyzing..." : "Analyze & Learn"}
          </button>
        </div>
        
        <div className="right panel">
          <div className="panel-header">
            <span>Review Insights</span>
          </div>
          {isLoading && (
            <div className="loader-container">
              <div className="pulse-loader"></div>
              <p>Studying your code concepts...</p>
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
          {!isLoading && !error && review && (
            <div className="review-content">
              <Markdown rehypePlugins={[ rehypeHighlight ]}>
                {review}
              </Markdown>
            </div>
          )}
          {!isLoading && !error && !review && (
            <div className="empty-state">
              <div className="empty-icon">💡</div>
              <p>Ready to level up? Enter your code and click "Analyze & Learn" for a personalized teaching session.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}



export default App
