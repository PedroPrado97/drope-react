import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* Capa cinematográfica:
   · abertura: o logo se assenta como uma câmera se afastando (de grande e desfocado ao tamanho final), a luz verde acende
     e a foto sobe saindo da sombra (o título e os botões entram em seguida, pelo CSS);
   · ambiente: a luz verde "respira";
   · profundidade: logo, foto e luz se deslocam em camadas com o mouse e com a rolagem.
   Com movimento reduzido, nada disso roda e a capa aparece pronta. */
export default function useHeroCinema(ref) {
  useLayoutEffect(() => {
    const sec = ref.current
    if (!sec) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    sec.classList.add('cine')
    const ctx = gsap.context(() => {
      const marcas = gsap.utils.toArray('.hero-mark', sec)
      const foto = sec.querySelector('.hero-photo img')
      const luz = sec.querySelector('.hero-beam')
      const palavras = gsap.utils.toArray('.hero-title .w', sec)

      /* o CSS centraliza logo e luz com translateX(-50%); o GSAP assume esses transforms */
      gsap.set(marcas, { x: 0, xPercent: -50 })
      gsap.set(luz, { x: 0, xPercent: -50, rotation: -12 })

      /* ---------- abertura ---------- */
      const intro = gsap.timeline({ defaults: { ease: 'expo.out' } })
      intro
        .fromTo(luz, { opacity: 0, scaleY: 0.4 }, { opacity: 0.9, scaleY: 1, duration: 2.2, ease: 'power2.out' }, 0.2)
        /* logo: como uma câmera se afastando, começa grande, escuro e desfocado e se assenta no lugar */
        .fromTo(marcas, { scale: 1.32, yPercent: 10, opacity: 0, filter: 'blur(16px) brightness(0.35) drop-shadow(0px 0px 0px rgba(109,194,73,0))' },
          { scale: 1, yPercent: 0, opacity: 0.96, filter: 'blur(0px) brightness(1) drop-shadow(0px 0px 40px rgba(109,194,73,0.22))', duration: 3, ease: 'power3.out' }, 0.1)
        /* a foto começa como silhueta escura (tampando o logo) e vai sendo iluminada */
        .fromTo(foto, { scale: 1.14, yPercent: 6, filter: 'brightness(0) contrast(1.2) blur(4px)' },
          { scale: 1, yPercent: 0, filter: 'brightness(1) contrast(1) blur(0px)', duration: 2.8, ease: 'power2.inOut', clearProps: 'filter' }, 0.4)
        /* título: as palavras sobem saindo do desfoque, uma de cada vez */
        .fromTo(palavras, { opacity: 0, yPercent: 60, filter: 'blur(10px)' },
          { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 1.1, stagger: 0.09, ease: 'power3.out', clearProps: 'opacity,transform,filter' }, 1.4)
        .add(() => sec.classList.add('cine-pronto'), 2.6)

      /* ---------- luz respirando ---------- */
      gsap.to(luz, { opacity: 0.6, x: '+=40', duration: 4.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.4 })

      /* ---------- profundidade na rolagem (camadas em velocidades diferentes) ---------- */
      gsap.timeline({
        scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom top', scrub: 0.6 },
      })
        .to(marcas, { y: () => window.innerHeight * 0.28, ease: 'none' }, 0)
        .to(foto, { y: () => window.innerHeight * 0.12, ease: 'none' }, 0)
        .to(luz, { y: () => window.innerHeight * 0.2, ease: 'none' }, 0)

      /* ---------- profundidade com o mouse (só computador) ---------- */
      const mm = gsap.matchMedia()
      mm.add('(hover: hover) and (pointer: fine) and (min-width: 901px)', () => {
        const mover = (e) => {
          const x = e.clientX / window.innerWidth - 0.5
          const y = e.clientY / window.innerHeight - 0.5
          gsap.to(marcas, { x: x * -28, yPercent: y * -4, duration: 1.4, ease: 'power3.out', overwrite: 'auto' })
          gsap.to(foto, { x: x * 18, rotationY: x * 4, rotationX: y * -3, duration: 1.6, ease: 'power3.out', overwrite: 'auto' })
        }
        sec.addEventListener('pointermove', mover)
        return () => sec.removeEventListener('pointermove', mover)
      })
      return () => mm.revert()
    }, sec)

    return () => {
      ctx.revert()
      sec.classList.remove('cine', 'cine-pronto')
    }
  }, [ref])
}
