import { PROJETOS } from './projetos.js'

/* Telas do carrossel dentro do iPhone.
   Para adicionar, trocar ou remover publicações, edite esta lista (src = imagem em public/). */
export const SLIDES = PROJETOS.map((p) => ({ src: p.src, alt: p.alt }))

/* Tempos do carrossel, em milissegundos */
export const CARROSSEL = { intervalo: 3200, transicao: 900 }
