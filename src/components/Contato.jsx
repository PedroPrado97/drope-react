import { useIdioma } from '../context/Idioma.jsx'
export default function Contato() {
  const { t } = useIdioma()
  return (
    <section className={"cto"} id={"contato"} aria-label={t("Contato")}>
      <h2 className={"cto-title reveal"}>
        {t("Vamos construir algo")}
        <br />
        <span className={"g"}>
          {t("diferente.")}
        </span>
      </h2>
      <p className={"cto-sub reveal"}>
        {t("Conte o que voc\u00ea quer provocar com a sua marca.")}
      </p>
      <nav className={"cto-links reveal"} aria-label={"Canais de contato"}>
        <a href={"mailto:pedropradodesigner@gmail.com"}>
          {"pedropradodesigner@gmail.com"}
        </a>
        <a href={"https://api.whatsapp.com/send/?phone=5577999709584&text&type=phone_number&app_absent=0"} target={"_blank"} rel={"noopener"}>
          {t("WhatsApp")}
        </a>
        <a href={"https://www.instagram.com/drope.studio_/"} target={"_blank"} rel={"noopener"}>
          {t("Instagram")}
        </a>
        <a href={"https://www.behance.net/dropestudio_"} target={"_blank"} rel={"noopener"}>
          {t("Behance")}
        </a>
      </nav>
    </section>
  )
}
