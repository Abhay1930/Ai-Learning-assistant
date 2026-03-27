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
      const response = await axios.post('http://localhost:3000/ai/get-review', { code })
      setReview(response.data)
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while connecting to the server.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={20}
              style={{
                fontFamily: '"Fira Code", "Fira Mono", monospace',
                fontSize: 16,
                border: "none",
                borderRadius: "12px",
                height: "100%",
                width: "100%",
                outline: "none",
              }}
            />
          </div>
          <div onClick={reviewCode} className={`review-btn ${isLoading ? 'loading' : ''}`}>
            {isLoading ? "Analyzing..." : "Review Code"}
          </div>
        </div>
        <div className="right">
          {isLoading && (
            <div className="loader-container">
              <div className="spinner"></div>
              <p>AI is reviewing your code...</p>
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
          {!isLoading && !error && review && (
            <Markdown rehypePlugins={[ rehypeHighlight ]}>
              {review}
            </Markdown>
          )}
          {!isLoading && !error && !review && (
            <div className="empty-state">
              <p>Enter your code on the left and click "Review Code" to get started.</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}



export default App
