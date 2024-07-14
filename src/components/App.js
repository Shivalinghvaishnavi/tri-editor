import React, { useState, useEffect } from "react";
import "./App.css";

const defaultHtmlCode = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tri-Editor</title>
</head>
<body>
    <div id="container">
        <h1 id="title">Welcome to Tri-Editor</h1>
        <p id="description">This is a simple online code editor to try out HTML, CSS, and JavaScript. Edit the code in the text areas to see changes reflected in real-time!</p>
        <button id="changeButton">Change Content</button>
    </div>
</body>
</html>
`;

const defaultCssCode = `
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 20px;
}

#container {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: center;
}

#title {
    color: #007bff;
}

#description {
    color: #555;
}

#changeButton {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

#changeButton:hover {
    background-color: #0056b3;
}
`;

const defaultJsCode = `
document.getElementById('title').addEventListener('click', () => {
    alert('Hello! You clicked the title.');
});

document.getElementById('changeButton').addEventListener('click', () => {
    const container = document.getElementById('container');
    container.style.backgroundColor = '#dff0d8';
    document.getElementById('description').textContent = 'The content has been updated by JavaScript.';
});
`;

function App() {
  const [htmlCode, setHtmlCode] = useState(
    localStorage.getItem("htmlCode") || defaultHtmlCode
  );
  const [cssCode, setCssCode] = useState(
    localStorage.getItem("cssCode") || defaultCssCode
  );
  const [jsCode, setJsCode] = useState(
    localStorage.getItem("jsCode") || defaultJsCode
  );
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const outputFrame = document.getElementById("outputFrame");
    const outputContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${cssCode}</style>
      </head>
      <body>
          ${htmlCode}
          <script>
            try {
              ${jsCode}
            } catch (error) {
              window.parent.postMessage({ type: 'error', message: error.message }, '*');
            }
          <\/script>
      </body>
      </html>
    `;
    outputFrame.srcdoc = outputContent;
    localStorage.setItem("htmlCode", htmlCode);
    localStorage.setItem("cssCode", cssCode);
    localStorage.setItem("jsCode", jsCode);
  }, [htmlCode, cssCode, jsCode]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === "error") {
        setError(event.data.message);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const clearCode = () => {
    setHtmlCode("");
    setCssCode("");
    setJsCode("");
  };

  return (
    <div className={`container ${theme}`}>
      <Header toggleTheme={toggleTheme} theme={theme} clearCode={clearCode} />
      <Editor
        htmlCode={htmlCode}
        cssCode={cssCode}
        jsCode={jsCode}
        setHtmlCode={setHtmlCode}
        setCssCode={setCssCode}
        setJsCode={setJsCode}
      />
      <OutputFrame error={error} />
    </div>
  );
}

const Header = ({ toggleTheme, theme, clearCode }) => (
  <div className="header">
    <h1>Tri-Editor</h1>
    <div>
      <button onClick={toggleTheme}>
        Switch to {theme === "light" ? "Dark" : "Light"} Theme
      </button>
      <button onClick={clearCode}>Clear Code</button>
    </div>
  </div>
);

const Editor = ({
  htmlCode,
  cssCode,
  jsCode,
  setHtmlCode,
  setCssCode,
  setJsCode,
}) => (
  <div className="editor">
    <div className="editor-body">
      <div className="editor-container">
        <div className="editor-name">HTML</div>
        <textarea
          value={htmlCode}
          onChange={(e) => setHtmlCode(e.target.value)}
          placeholder="HTML code"
          className="code-input"
        ></textarea>
      </div>
      <div className="editor-container">
        <div className="editor-name">CSS</div>
        <textarea
          value={cssCode}
          onChange={(e) => setCssCode(e.target.value)}
          placeholder="CSS code"
          className="code-input"
        ></textarea>
      </div>
      <div className="editor-container">
        <div className="editor-name">JavaScript</div>
        <textarea
          value={jsCode}
          onChange={(e) => setJsCode(e.target.value)}
          placeholder="JavaScript code"
          className="code-input"
        ></textarea>
      </div>
    </div>
  </div>
);

const OutputFrame = ({ error }) => (
  <div className="output">
    <iframe id="outputFrame" title="Output"></iframe>
    {error && <div className="error">{error}</div>}
  </div>
);

export default App;
