import { useEffect } from 'react'

/* Título da capa: as palavras acendem em verde (#6dc249) conforme a rolagem */
export default function useHeroWords(deps = []) {
  useEffect(() => {
    let ticking = false
    const atualizar = () => {
      ticking = false
      const ws = document.querySelectorAll('.hero-title .w')
      if (!ws.length) return
      const n = ws.length
      const p = Math.max(0, Math.min(1, window.scrollY / (window.innerHeight * 0.6)))
      ws.forEach((s, i) => {
        const limite = (i / n) * 0.85
        s.classList.toggle('on', p + 0.02 >= limite)
      })
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(atualizar)
      }
    }
    atualizar()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', atualizar)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', atualizar)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
