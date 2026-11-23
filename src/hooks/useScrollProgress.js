import { useEffect, useRef, useState } from 'react'

/* Progresso (0 a 1) da rolagem dentro de uma seção alta com a tela travada.
   Uso: const [ref, p] = useScrollProgress() e colocar `ref` na <section>. */
export default function useScrollProgress() {
  const ref = useRef(null)
  const [p, setP] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0

    const medir = () => {
      frame = 0
      const topo = el.getBoundingClientRect().top + window.scrollY
      const total = Math.max(el.offsetHeight - window.innerHeight, 1)
      const valor = (window.scrollY - topo) / total
      setP(Math.min(1, Math.max(0, valor)))
    }
    const agendar = () => {
      if (!frame) frame = requestAnimationFrame(medir)
    }

    medir()
    window.addEventListener('scroll', agendar, { passive: true })
    window.addEventListener('resize', agendar)
    return () => {
      window.removeEventListener('scroll', agendar)
      window.removeEventListener('resize', agendar)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return [ref, p]
}
