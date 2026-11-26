import { useState } from 'react'
import { useIdioma } from '../context/Idioma.jsx'

/* CTA em formulário: a pessoa responde e, ao enviar, a mensagem segue para o WhatsApp do estúdio. */
const OPCOES = [
  'Criar uma marca do zero — estratégia e identidade visual para um novo negócio',
  'Transformar uma marca existente — reposicionamento ou rebranding',
  'Criar uma identidade visual — desenvolver ou profissionalizar a aparência da marca',
  'Estratégia e posicionamento — definir essência, diferenciais e direção da marca',
  'Direção criativa e aplicações — desenvolver materiais e desdobramentos da identidade',
  'Ainda não sei. Preciso de orientação',
]

const WHATSAPP = '5577999709584'
const VAZIO = { nome: '', whatsapp: '', marca: '', cidade: '', opcao: '', sobre: '' }

export default function Cta() {
  const { t } = useIdioma()
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
      `*Marca / Empresa:* ${dados.marca || '-'}`,
      `*Cidade:* ${dados.cidade || '-'}`,
      `*Procura:* ${dados.opcao}`,
      `*Sobre o projeto:* ${dados.sobre || '-'}`,
    ]
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(linhas.join('\n'))}`, '_blank', 'noopener')
  }

  return (
    <section className="cta" id="contato" aria-label="Vamos entender sua marca">
      <div className="cta-card">
        <div className="cta-info">
          <p className="cta-kicker">{t('Vamos falar de marca')}</p>
          <h2 className="cta-titulo">{t('Sua marca tem algo a dizer. Vamos descobrir o quê.')}</h2>
          <p className="cta-desc">{t('Conte um pouco sobre o que você está construindo. Queremos entender seu negócio antes de pensar em qualquer solução.')}</p>
          <div className="cta-box">
            <div className="cta-box-logo" aria-hidden="true"><img src="/logo/drope-simbolo.svg" alt="" /></div>
            <div>
              <p className="cta-box-nome">Drope Studio</p>
              <p className="cta-box-sub">{t('Atendimento direto com o estúdio')}</p>
            </div>
          </div>
        </div>

        <form className="cta-form" onSubmit={enviar}>
          <span className="cta-badge">{t('Novos projetos')}</span>
          <h3 className="cta-form-titulo">{t('Vamos entender sua marca?')}</h3>
          <p className="cta-form-desc">{t('Algumas informações já nos ajudam a encontrar o melhor caminho para o seu projeto.')}</p>

          <label className="cta-campo">
            <span>{t('Seu nome')}</span>
            <input value={dados.nome} onChange={mudar('nome')} placeholder={t('Como podemos te chamar?')} />
          </label>
          <label className="cta-campo">
            <span>WhatsApp</span>
            <input value={dados.whatsapp} onChange={mudar('whatsapp')} placeholder="(00) 00000-0000" inputMode="tel" />
          </label>
          <div className="cta-linha">
            <label className="cta-campo">
              <span>{t('Marca / Empresa')}</span>
              <input value={dados.marca} onChange={mudar('marca')} placeholder={t('Nome da marca')} />
            </label>
            <label className="cta-campo">
              <span>{t('Cidade')}</span>
              <input value={dados.cidade} onChange={mudar('cidade')} placeholder={t('Sua cidade')} />
            </label>
          </div>
          <label className="cta-campo">
            <span>{t('O que você procura?')}</span>
            <select value={dados.opcao} onChange={mudar('opcao')}>
              <option value="">{t('Selecione uma opção')}</option>
              {OPCOES.map((op) => (
                <option key={op} value={op}>{t(op)}</option>
              ))}
            </select>
          </label>
          <label className="cta-campo">
            <span>{t('Conte um pouco sobre seu projeto')}</span>
            <textarea rows={3} value={dados.sobre} onChange={mudar('sobre')} placeholder={t('O que você está construindo ou gostaria de transformar?')} />
          </label>

          {erro && <p className="cta-erro" role="alert">{t(erro)}</p>}
          <button type="submit" className="cta-enviar">{t('Enviar projeto ao Drope')} <span aria-hidden="true">↗</span></button>
        </form>
      </div>
    </section>
  )
}
