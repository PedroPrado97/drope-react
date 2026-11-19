import { createContext, useContext, useEffect, useState } from 'react'

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

  return (
    <IdiomaContext.Provider value={{ idioma, setIdioma }}>
      {children}
    </IdiomaContext.Provider>
  )
}

export function useIdioma() {
  return useContext(IdiomaContext)
}
