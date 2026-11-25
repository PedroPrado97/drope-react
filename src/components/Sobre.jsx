import { useIdioma } from '../context/Idioma.jsx'
export default function Sobre() {
  const { t } = useIdioma()
  return (
    <section className={"sb"} id={"sobre"} aria-label={"Sobre o Drope"}>
      <div className={"sb-left reveal"}>
        <h2 className={"sb-title"}>
          {t("Sobre o")}
          <br />
          {"Drope"}
        </h2>
      </div>
      <div className={"sb-right"}>
        <p className={"sb-lead reveal"}>
          {t("Somos um est\u00fadio de cria\u00e7\u00e3o e estrutura\u00e7\u00e3o de marcas. Investigamos antes de desenhar, porque acreditamos que uma identidade precisa tornar percept\u00edvel aquilo que faz uma marca ser diferente.")}
        </p>
        <p className={"sb-body reveal"}>
          {t("N\u00e3o trabalhamos com f\u00f3rmulas prontas. Cada projeto nasce do universo pr\u00f3prio da marca e busca uma solu\u00e7\u00e3o que dificilmente poderia ter vindo de qualquer outro lugar. Observamos, provocamos e assumimos escolhas.")}
        </p>
        <p className={"sb-traits reveal"} aria-label={"Personalidade"}>
          <span>
            {t("curiosa")}
          </span>
          <span>
            {t("provocadora")}
          </span>
          <span>
            {t("autoral")}
          </span>
          <span>
            {t("experimental")}
          </span>
          <span>
            {t("humana")}
          </span>
          <span>
            {t("observadora")}
          </span>
        </p>
      </div>
    </section>
  )
}
