import { useEffect } from 'react'

/* Revela os elementos com a classe .reveal (e os cases) ao entrarem na tela */
export default function useReveal() {
  useEffect(() => {
    const itens = document.querySelectorAll('.reveal, .pf-item')
    if (!('IntersectionObserver' in window)) {
      itens.forEach((el) => el.classList.add('in'))
      return
    }
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.18 })
    itens.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}
