import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './media.css'
import './event-media.css'
import './celebration-modal.css'

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
