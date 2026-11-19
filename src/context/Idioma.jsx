import { createContext, useContext, useEffect, useState } from 'react'
import { TRADUCOES } from '../i18n/traducoes.js'

const IdiomaContext = createContext(null)
const SUPORTADOS = ['pt-BR', 'en', 'es']

/* Idioma escolhido pelo visitante (fica salvo no navegador) */
export function IdiomaProvider({ children }) {
  const [idioma, setIdioma] = useState(() => {
    try {
      const salvo = localStorage.getItem('drope-lang')
      return SUPORTADOS.includes(salvo) ? salvo : 'pt-BR'
    } catch {
      return 'pt-BR'
    }
  })

  useEffect(() => {
    document.documentElement.lang = idioma
    try { localStorage.setItem('drope-lang', idioma) } catch { /* sem armazenamento */ }
  }, [idioma])

  /* Traduz um texto da página (se não houver tradução, mantém o original) */
  const t = (txt) => (idioma === 'pt-BR' ? txt : (TRADUCOES[idioma] && TRADUCOES[idioma][txt]) || txt)

  return (
    <IdiomaContext.Provider value={{ idioma, setIdioma, t }}>
      {children}
    </IdiomaContext.Provider>
  )
}

export function useIdioma() {
  return useContext(IdiomaContext)
}
