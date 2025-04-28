import { useState } from 'react'
import './App.css'
import { SUPABASE } from './config'

function App() {
  const [pixelUrl, setPixelUrl] = useState('')
  const [isError, setIsError] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    recipient: ''
  })
  const disabled = formData.email.trim() === '' || formData.recipient.trim() === ''
  const generatePixel = async () => {
    const {email, recipient} = formData
    try {
      const response = await fetch (`${SUPABASE.URL}/functions/v1/create-pixel`, {
        method: 'POST',
        headers: {
          'content-Type': 'application/json',
          'Authorization': `${SUPABASE.AUTH}`
        },
        body: JSON.stringify({email_title: email, recipient: recipient})
      })
      const data = await response.json()
      if(response.ok){
        // setPixelUrl(data.pixelUrl)
        setPixelUrl(
          `<img src="${data.pixelUrl}" width="1" height="1" style="display:none; visibility:hidden;" alt="" />`
        );
       
      } else{
        console.error(data)
        setIsError(true)
      }
    } catch (error) {
      console.log(error)
      setIsError(true)
      
    }
   
  }

  const copyPixel = () => {
    navigator.clipboard.writeText(pixelUrl)
    alert('Pixel copied to clipboard!')
  }

  return (
   <div>
    <h1>Email Tracker</h1>
    <form>
      <input type="email" placeholder='Enter recipient email' value={formData.email} onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))} />
      <input type="text" placeholder='Enter email title' value={formData.recipient} onChange={(e) => setFormData(prev => ({...prev, recipient: e.target.value}))} />
    </form>
    <button disabled={disabled} onClick={generatePixel}>Generate Tracking Pixel</button>
  
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
