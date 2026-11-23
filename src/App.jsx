import { IdiomaProvider } from './context/Idioma.jsx'
import useReveal from './hooks/useReveal.js'
import useCursor from './hooks/useCursor.js'
import useSmoothWheel from './hooks/useSmoothWheel.js'
import Hero from './components/Hero.jsx'
import Marcas from './components/Marcas.jsx'
import Projetos from './components/Projetos.jsx'
import Sobre from './components/Sobre.jsx'
import Processo from './components/Processo.jsx'
import Valores from './components/Valores.jsx'
import Servicos from './components/Servicos.jsx'
import Contato from './components/Contato.jsx'
import Rodape from './components/Rodape.jsx'
import Dock from './components/Dock.jsx'
import Displacement from './components/Displacement.jsx'
import EmBreve from './cases/EmBreve.jsx'

function Pagina() {
  useReveal()
  useCursor()
  useSmoothWheel()
  return (
    <>
      <main>
        <Hero />
        <Marcas />
        <Projetos />
        <Processo />
        <Valores />
        <Sobre />
        <Servicos />
        <Contato />
      </main>
      <Rodape />
      <Dock />
      <Displacement />
    </>
  )
}

/* Rotas internas: /em-breve tem página própria; o resto é a página principal */
const ROTAS = {
  '/em-breve': EmBreve,
}

export default function App() {
  const Rota = ROTAS[window.location.pathname.replace(/\/$/, '')]
  if (Rota) return <Rota />
  return (
    <IdiomaProvider>
      <Pagina />
    </IdiomaProvider>
  )
}
