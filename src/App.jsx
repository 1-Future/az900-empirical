import { useState } from 'react'
import './index.css'
import { Home } from './pages/Home'
import { DemoPage } from './pages/DemoPage'
import { demos } from './data/demos'

export default function App() {
  const [route, setRoute] = useState(window.location.hash.slice(1) || '')

  window.onhashchange = () => setRoute(window.location.hash.slice(1))
  const navigate = (r) => { window.location.hash = r; setRoute(r) }

  const demo = demos.find(d => d.id === route)

  if (demo) {
    return <DemoPage demo={demo} onBack={() => navigate('')} />
  }

  return <Home demos={demos} onSelect={(id) => navigate(id)} />
}
