import { useEffect } from 'react'

/* Barra flutuante aparece quando a barra de idiomas da capa sai da tela */
export default function useDock(ref) {
  useEffect(() => {
    const dock = ref.current
    if (!dock) return
    const atualizar = () => {
      const seletor = document.querySelector('.hero-lang')
      const mostrar = seletor ? seletor.getBoundingClientRect().bottom < 0 : false
      dock.classList.toggle('on', mostrar)
      dock.setAttribute('aria-hidden', String(!mostrar))
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
    window.addEventListener('resize', atualizar)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', atualizar)
    }
  }, [ref])
}
