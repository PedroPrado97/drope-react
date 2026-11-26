import { useEffect, useState } from 'react'
import { WHATSAPP_NUMERO } from './Cta.jsx'

/* Chat no canto inferior esquerdo: aparece na tela inicial e acompanha a rolagem até o fim da página. */
export default function ChatFlutuante() {
  const [aberto, setAberto] = useState(false)
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const sec = document.getElementById('contato')
    const onScroll = () => setVisivel(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const abrir = () => window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent('Olá! Vim pelo site do Drope Studio.')}`, '_blank', 'noopener')

  return (
    <div className={'chat' + (visivel ? ' on' : '') + (aberto ? ' aberto' : '')}>
      {aberto && (
        <div className="chat-janela" role="dialog" aria-label="Chat com o Drope Studio">
          <div className="chat-cab">
            <span className="chat-avatar"><img src="/logo/drope-simbolo.svg" alt="" /></span>
            <div>
              <strong>Drope Studio</strong>
              <small>Respondemos pelo WhatsApp</small>
            </div>
            <button type="button" className="chat-fechar" onClick={() => setAberto(false)} aria-label="Fechar">×</button>
          </div>
          <p className="chat-msg">Oi! Quer saber como o Drope pode ajudar a sua marca?</p>
          <button type="button" className="chat-ir" onClick={abrir}>Falar no WhatsApp ↗</button>
        </div>
      )}
      <button type="button" className="chat-botao" onClick={() => setAberto((v) => !v)} aria-expanded={aberto} aria-label="Abrir chat">
        <span className="chat-botao-icone" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/></svg>
        </span>
      </button>
    </div>
  )
}
