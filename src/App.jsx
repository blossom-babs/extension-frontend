import { useState } from 'react'
import './App.css'

function App() {
  const [pixelUrl, setPixelUrl] = useState('')

  const generatePixel = () => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2,5)
    const url = `https://your-backend-com/track?id=${id}`
    setPixelUrl(
      `<img src="${url}" width="1" height="1" style="display:none;" />`
    )
    chrome.storage.local.set(
      {[id]: {createdAt: Date.now(), opened:false}}
    )
  }

  const copyPixel = () => {
    navigator.clipboard.writeText(pixelUrl)
    alert('Pixel copied to clipboard!')
  }

  return (
   <div>
    <h1>Email Tracker</h1>
    <button onClick={generatePixel}>Generate Tracking Pixel</button>
  
  {pixelUrl && (
    <div>
      <p>Copy this pixel into your email:</p>
      <textarea value={pixelUrl} readOnly name="" id=""></textarea>
      <button onClick={copyPixel}>Copy</button>
    </div>
  )}

  <div>
    <a href="https://your-backend.com/dashboard" target='_blank' rel='noreferrer'>View Dashboard</a>
  </div>
   </div>
  )
}

export default App
