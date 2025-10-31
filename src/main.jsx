import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Home.jsx'
import EndOfGame from './components/EndOfGame.jsx'
import { GameProvider } from './components/Context.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GameProvider>
      <EndOfGame />
    </GameProvider>
  </StrictMode>,
)
