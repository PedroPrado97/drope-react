import { useIdioma } from '../context/Idioma.jsx'
export default function Servicos() {
  const { t } = useIdioma()
  return (
    <section className={"sv"} id={"servicos"} aria-label={t("Servi\u00e7os")}>
      <ul className={"sv-list"}>
        <li className={"sv-row reveal"}>
          <span className={"sv-no"}>
            {"01"}
          </span>
          <h3 className={"sv-name"}>
            {t("Estrat\u00e9gia de marca")}
          </h3>
          <p className={"sv-desc"}>
            {t("Posicionamento, arquitetura e dire\u00e7\u00e3o de comunica\u00e7\u00e3o.")}
          </p>
        </li>
        <li className={"sv-row reveal"}>
          <span className={"sv-no"}>
            {"02"}
          </span>
          <h3 className={"sv-name"}>
            {t("Branding")}
          </h3>
          <p className={"sv-desc"}>
            {t("Naming, narrativa e sistema de marca completo.")}
          </p>
        </li>
        <li className={"sv-row reveal"}>
          <span className={"sv-no"}>
            {"03"}
          </span>
          <h3 className={"sv-name"}>
            {t("Identidade visual")}
          </h3>
          <p className={"sv-desc"}>
            {t("Logotipo, tipografia, cor, grafismos e aplica\u00e7\u00f5es.")}
          </p>
        </li>
      </ul>
    </section>
  )
}
