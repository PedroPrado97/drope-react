import { useState } from 'react'
import { useIdioma } from '../context/Idioma.jsx'

/* CTA: formulário em duas colunas sobre o vídeo de fundo. Ao enviar, as respostas vão para o WhatsApp do estúdio. */
const OPCOES = [
  'Criar uma marca do zero — estratégia e identidade visual para um novo negócio',
  'Transformar uma marca existente — reposicionamento ou rebranding',
  'Criar uma identidade visual — desenvolver ou profissionalizar a aparência da marca',
  'Estratégia e posicionamento — definir essência, diferenciais e direção da marca',
  'Direção criativa e aplicações — desenvolver materiais e desdobramentos da identidade',
  'Ainda não sei. Preciso de orientação',
]

export const WHATSAPP_NUMERO = '5577999709584'
const VAZIO = { nome: '', whatsapp: '', empresa: '', cidade: '', opcao: '', sobre: '' }

export default function Cta() {
  const { t } = useIdioma()
  const [aba, setAba] = useState('orcamento')
  const [dados, setDados] = useState(VAZIO)
  const [erro, setErro] = useState('')

  const mudar = (campo) => (e) => setDados({ ...dados, [campo]: e.target.value })

  const enviar = (e) => {
    e.preventDefault()
    if (!dados.nome.trim() || !dados.whatsapp.trim() || !dados.opcao) {
      setErro('Preencha seu nome, WhatsApp e escolha o que você procura.')
      return
    }
    setErro('')
    const linhas = [
      'Olá! Vim pelo site do Drope Studio.',
      '',
      `*Nome:* ${dados.nome}`,
      `*WhatsApp:* ${dados.whatsapp}`,
      `*Empresa:* ${dados.empresa || '-'}`,
      `*Cidade:* ${dados.cidade || '-'}`,
      `*Procura:* ${dados.opcao}`,
      `*Sobre o projeto:* ${dados.sobre || '-'}`,
    ]
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(linhas.join('\n'))}`, '_blank', 'noopener')
  }

  return (
    <section className="ct" id="contato" aria-label="Pedir um orçamento">
      <video className="ct-video" src="/media/cta/fundo.mp4" poster="/media/cta/fundo-poster.jpg" autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
      <div className="ct-veu" aria-hidden="true" />

      <div className="ct-wrap">
        <div className="ct-esquerda">
          <p className="ct-eyebrow">{t('Vamos conversar')}</p>
          <h2 className="ct-titulo">
            {t('Sua marca tem algo a dizer.')}{' '}
            <span className="ct-destaque">{t('Vamos descobrir o quê.')}</span>
          </h2>
          <p className="ct-texto">{t('Conte um pouco do que você precisa. Queremos entender seu negócio antes de pensar em qualquer solução.')}</p>

          <a className="ct-contato" href={`https://wa.me/${WHATSAPP_NUMERO}`} target="_blank" rel="noopener">
            <span className="ct-contato-logo" aria-hidden="true"><img src="/logo/drope-simbolo.svg" alt="" /></span>
            <span className="ct-contato-info">
              <strong>Drope Studio</strong>
              <small>{t('Atendimento direto com o estúdio')}</small>
            </span>
            <span className="ct-contato-btn" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20z"/></svg>
            </span>
          </a>
        </div>

        <div className="ct-direita">
          <div className="ct-abas" role="tablist">
            <button type="button" role="tab" aria-selected={aba === 'orcamento'} className={'ct-aba' + (aba === 'orcamento' ? ' on' : '')} onClick={() => setAba('orcamento')}>
              {t('Pedir orçamento')}
            </button>
            <button type="button" role="tab" aria-selected={aba === 'conversa'} className={'ct-aba' + (aba === 'conversa' ? ' on' : '')} onClick={() => setAba('conversa')}>
              {t('Marcar uma conversa')}
            </button>
          </div>

          {aba === 'orcamento' ? (
            <form className="ct-card" onSubmit={enviar}>
              <h3 className="ct-card-titulo">{t('Pedir um orçamento')}</h3>
              <p className="ct-card-desc">{t('Preencha em poucas palavras o que você precisa. O estúdio responde no seu WhatsApp.')}</p>

              <label className="ct-campo">
                <span>{t('Seu nome')}</span>
                <input value={dados.nome} onChange={mudar('nome')} />
              </label>
              <label className="ct-campo">
                <span>{t('WhatsApp com DDD')}</span>
                <input value={dados.whatsapp} onChange={mudar('whatsapp')} placeholder="(77) 99999-9999" inputMode="tel" />
              </label>
              <div className="ct-linha">
                <label className="ct-campo">
                  <span>{t('Empresa')}</span>
                  <input value={dados.empresa} onChange={mudar('empresa')} />
                </label>
                <label className="ct-campo">
                  <span>{t('Cidade')}</span>
                  <input value={dados.cidade} onChange={mudar('cidade')} />
                </label>
              </div>
              <label className="ct-campo">
                <span>{t('O que você procura?')}</span>
                <select value={dados.opcao} onChange={mudar('opcao')}>
                  <option value="">{t('Escolha uma opção')}</option>
                  {OPCOES.map((op) => (
                    <option key={op} value={op}>{t(op)}</option>
                  ))}
                </select>
              </label>
              <label className="ct-campo">
                <span>{t('Conte rapidinho')} <em>({t('opcional')})</em></span>
                <textarea rows={3} value={dados.sobre} onChange={mudar('sobre')} placeholder={t('O que você está construindo ou gostaria de transformar?')} />
              </label>

              {erro && <p className="ct-erro" role="alert">{t(erro)}</p>}
              <button type="submit" className="ct-enviar">
                {t('Enviar e falar com o comercial')}
                <span className="ct-enviar-seta" aria-hidden="true">↗</span>
              </button>
            </form>
          ) : (
            <div className="ct-card ct-card-conversa">
              <h3 className="ct-card-titulo">{t('Marcar uma conversa')}</h3>
              <p className="ct-card-desc">{t('Prefere falar direto? Chame o estúdio no WhatsApp e escolha o melhor horário.')}</p>
              <a className="ct-enviar" href={`https://wa.me/${WHATSAPP_NUMERO}`} target="_blank" rel="noopener">
                {t('Falar no WhatsApp')}
                <span className="ct-enviar-seta" aria-hidden="true">↗</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
