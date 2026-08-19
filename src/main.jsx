import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

const staticCapture =
  window.__STATIC_CAPTURE__ === true ||
  window.location.pathname.endsWith('/index1.html') ||
  window.location.pathname.endsWith('/index1')

if (staticCapture) {
  document.documentElement.classList.add('static-capture')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
