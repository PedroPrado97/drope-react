import { useEffect } from 'react'

/* Barra do processo acompanha a rolagem dentro da seção */
export default function useProcesso(ref) {
  useEffect(() => {
    const sec = ref.current
    if (!sec) return
    const atualizar = () => {
      const r = sec.getBoundingClientRect()
      const tot = sec.offsetHeight - window.innerHeight
      const p = Math.max(0, Math.min(1, -r.top / Math.max(tot, 1)))
      sec.style.setProperty('--p', p.toFixed(4))
    }
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => { ticking = false; atualizar() })
      }
    }
    atualizar()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ref])
}
