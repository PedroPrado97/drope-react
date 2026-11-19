import { useIdioma } from '../context/Idioma.jsx'
import { useRef } from 'react'
import useVitrine from '../hooks/useVitrine.js'
export default function Projetos() {
  const { t } = useIdioma()
  const ref = useRef(null)
  useVitrine(ref)
  return (
    <section ref={ref} className={"vt"} id={"projetos"} aria-label={t("Projetos")}>
      <div className={"vt-stage"}>
        <div className={"vt-top"}>
          <span className={"vt-tag"}>
            {t("Projetos")}
          </span>
          <p className={"vt-head"}>
            {t("Marcas que j\u00e1 ajudamos a tornar \u00fanicas.")}
          </p>
        </div>
        <article className={"vt-slide"} data-i={"0"} style={{ "--i": "0" }}>
          <div className={"vt-media"}>
            <img src={"/media/385d853b061f.webp"} alt={"Brisa Beachwear & Fitwear"} />
          </div>
          <div className={"vt-shade"} aria-hidden={"true"}></div>
          <div className={"vt-copy"}>
            <p className={"vt-type"}>
              {t("Moda praia \u00b7 Identidade visual")}
            </p>
            <h3 className={"vt-name"}>
              {"BRISA"}
            </h3>
            <a className={"vt-btn"} href={"brisa.html"} aria-label={"Ver case: Brisa Beachwear & Fitwear"}>
              <span>
                {t("Ver case")}
              </span>
              <span className={"vt-arr"} aria-hidden={"true"}>
                {"\u2197"}
              </span>
            </a>
          </div>
        </article>
        <article className={"vt-slide"} data-i={"1"} style={{ "--i": "1" }}>
          <div className={"vt-media"}>
            <img src={"/media/a06df05153dc.webp"} alt={"Ateli\u00ea Alencar"} />
          </div>
          <div className={"vt-shade"} aria-hidden={"true"}></div>
          <div className={"vt-copy"}>
            <p className={"vt-type"}>
              {t("Confeitaria artesanal \u00b7 Identidade visual")}
            </p>
            <h3 className={"vt-name"}>
              {"ATELI\u00ca ALENCAR"}
            </h3>
            <a className={"vt-btn"} href={"atelie-alencar.html"} aria-label={"Ver case: Ateli\u00ea Alencar"}>
              <span>
                {t("Ver case")}
              </span>
              <span className={"vt-arr"} aria-hidden={"true"}>
                {"\u2197"}
              </span>
            </a>
          </div>
        </article>
        <article className={"vt-slide"} data-i={"2"} style={{ "--i": "2" }}>
          <div className={"vt-media"}>
            <img src={"/media/d25d1ffc604c.webp"} alt={"Rumo Livre 360\u00b0"} />
          </div>
          <div className={"vt-shade"} aria-hidden={"true"}></div>
          <div className={"vt-copy"}>
            <p className={"vt-type"}>
              {t("Turismo de aventura \u00b7 Identidade visual")}
            </p>
            <h3 className={"vt-name"}>
              {"RUMO LIVRE 360\u00b0"}
            </h3>
            <a className={"vt-btn"} href={"rumo.html"} aria-label={"Ver case: Rumo Livre 360\u00b0"}>
              <span>
                {t("Ver case")}
              </span>
              <span className={"vt-arr"} aria-hidden={"true"}>
                {"\u2197"}
              </span>
            </a>
          </div>
        </article>
        <article className={"vt-slide"} data-i={"3"} style={{ "--i": "3" }}>
          <div className={"vt-media"}>
            <img src={"/media/817e145c77d9.webp"} alt={"Rancho Pardo"} />
          </div>
          <div className={"vt-shade"} aria-hidden={"true"}></div>
          <div className={"vt-copy"}>
            <p className={"vt-type"}>
              {t("Alimenta\u00e7\u00e3o \u00b7 Identidade visual")}
            </p>
            <h3 className={"vt-name"}>
              {"RANCHO PARDO"}
            </h3>
            <a className={"vt-btn"} href={"rancho.html"} aria-label={"Ver case: Rancho Pardo"}>
              <span>
                {t("Ver case")}
              </span>
              <span className={"vt-arr"} aria-hidden={"true"}>
                {"\u2197"}
              </span>
            </a>
          </div>
        </article>
        <article className={"vt-slide"} data-i={"4"} style={{ "--i": "4" }}>
          <div className={"vt-media"}>
            <img src={"/media/75a1d8e9686b.webp"} alt={"Tiger Store"} />
          </div>
          <div className={"vt-shade"} aria-hidden={"true"}></div>
          <div className={"vt-copy"}>
            <p className={"vt-type"}>
              {t("Loja \u00b7 Identidade visual")}
            </p>
            <h3 className={"vt-name"}>
              {"TIGER STORE"}
            </h3>
            <a className={"vt-btn"} href={"tiger.html"} aria-label={"Ver case: Tiger Store"}>
              <span>
                {t("Ver case")}
              </span>
              <span className={"vt-arr"} aria-hidden={"true"}>
                {"\u2197"}
              </span>
            </a>
          </div>
        </article>
        <div className={"vt-count"} aria-live={"polite"}>
          <span className={"vt-cur"}>
            {"01"}
          </span>
          {" / 05"}
        </div>
        <div className={"vt-rail"} aria-hidden={"true"}>
          <span className={"vt-dot"} data-i={"0"}></span>
          <span className={"vt-dot"} data-i={"1"}></span>
          <span className={"vt-dot"} data-i={"2"}></span>
          <span className={"vt-dot"} data-i={"3"}></span>
          <span className={"vt-dot"} data-i={"4"}></span>
        </div>
      </div>
    </section>
  )
}
