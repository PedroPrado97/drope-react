import { useEffect } from 'react'

/* Barra flutuante: aparece quando a barra de idiomas da capa sai da tela.
   Ao rolar para baixo ela se recolhe (para não atrapalhar a leitura);
   reaparece ao rolar para cima ou quando a rolagem para por um instante. */
export default function useDock(ref) {
  useEffect(() => {
    const dock = ref.current
    if (!dock) return
    let ultimoY = window.scrollY
    let parada = null
    let ticking = false

    const mostrarBarra = () => {
      const seletor = document.querySelector('.hero-lang')
      const mostrar = seletor ? seletor.getBoundingClientRect().bottom < 0 : false
      dock.classList.toggle('on', mostrar)
      dock.setAttribute('aria-hidden', String(!mostrar))
      return mostrar
    }

    const atualizar = () => {
      ticking = false
      const y = window.scrollY
      const mostrar = mostrarBarra()
      const descendo = y > ultimoY + 4
      const subindo = y < ultimoY - 4
      ultimoY = y
      if (!mostrar) { dock.classList.remove('recolhido'); return }
      if (descendo) dock.classList.add('recolhido')
      if (subindo) dock.classList.remove('recolhido')
      clearTimeout(parada)
      parada = setTimeout(() => dock.classList.remove('recolhido'), 1200)
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
      clearTimeout(parada)
    }
  }, [ref])
}
