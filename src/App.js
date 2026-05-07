import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import PlayerProfile from './pages/PlayerProfile'
import About from './pages/About'
import Compare from './pages/Compare'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player/:id" element={<PlayerProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App