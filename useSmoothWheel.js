import { useEffect } from 'react'

/* Rolagem suave com a roda do mouse (desliza em vez de pular) */
export default function useSmoothWheel() {
  useEffect(() => {
    if (window.matchMedia && (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(pointer: coarse)').matches)) return
    let alvo = window.pageYOffset, atual = alvo, rodando = false, guiando = false
    const maximo = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    const passo = () => {
      atual += (alvo - atual) * 0.085
      if (Math.abs(alvo - atual) < 0.5) atual = alvo
      guiando = true
      window.scrollTo({ top: atual, behavior: 'instant' })
      guiando = false
      if (atual !== alvo) requestAnimationFrame(passo)
      else rodando = false
    }
    const onWheel = (e) => {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY) || Math.abs(e.deltaY) < 1) return
      e.preventDefault()
      if (!rodando) { atual = window.pageYOffset; alvo = atual }
      alvo = Math.min(maximo(), Math.max(0, alvo + e.deltaY))
      if (!rodando) { rodando = true; requestAnimationFrame(passo) }
    }
    const onScroll = () => {
      if (guiando || rodando) return
      alvo = atual = window.pageYOffset
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])
}
