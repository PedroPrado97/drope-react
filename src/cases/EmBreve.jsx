import { useEffect, useState } from 'react'
import './em-breve.css'

/* Página "Em breve": aparece quando um projeto ainda não tem case pronto.
   Mostra o nome do projeto clicado, vindo do parâmetro ?p=Nome. */
export default function EmBreve() {
  const [projeto, setProjeto] = useState('')

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('p')
    const nome = p && p.trim() ? p.trim().slice(0, 80) : ''
    setProjeto(nome)
    document.title = (nome ? `${nome} | ` : '') + 'Em breve | Drope Studio'
  }, [])

  return (
    <main className="soon">
      <div className="wrap">
        <a className="back" href="/">← Voltar ao Drope Studio</a>
        {projeto && <p className="proj" id="proj">{projeto}</p>}
        <h1>Ops, esse portfólio ainda não está pronto.</h1>
        <p className="msg">
          Mas em breve retornaremos com novidades! Enquanto isso, fique à vontade para ver nossos{' '}
          <a className="ink" href="/#projetos">projetos ativos</a>, ou acompanhar o{' '}
          <a className="drope" href="https://www.instagram.com/drope.studio_/" target="_blank" rel="noopener">Drope Studio</a>{' '}
          no Instagram.
        </p>
        <div className="actions">
          <a className="btn" href="/#projetos">Ver projetos ativos</a>
          <a className="btn" href="https://www.instagram.com/drope.studio_/" target="_blank" rel="noopener">Seguir no Instagram</a>
        </div>
      </div>
    </main>
  )
}
