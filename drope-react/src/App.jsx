import { IdiomaProvider } from './context/Idioma.jsx'
import useReveal from './hooks/useReveal.js'
import useCursor from './hooks/useCursor.js'
import useSmoothWheel from './hooks/useSmoothWheel.js'
import Hero from './components/Hero.jsx'
import Marcas from './components/Marcas.jsx'
import Projetos from './components/Projetos.jsx'
import Sobre from './components/Sobre.jsx'
import Processo from './components/Processo.jsx'
import Servicos from './components/Servicos.jsx'
import Contato from './components/Contato.jsx'
import Rodape from './components/Rodape.jsx'
import Dock from './components/Dock.jsx'

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
        <Sobre />
        <Processo />
        <Servicos />
        <Contato />
      </main>
      <Rodape />
      <Dock />
    </>
  )
}

export default function App() {
  return (
    <IdiomaProvider>
      <Pagina />
    </IdiomaProvider>
  )
}
