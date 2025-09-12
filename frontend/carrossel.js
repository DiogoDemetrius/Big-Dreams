// carrossel.js — versão com textos associados
document.addEventListener('DOMContentLoaded', () => {
  const DURATION = 800; // ms
  const EASING = 'cubic-bezier(.25,.8,.25,1)';

  const estados = [
    { parent: '.n1', style: { width: '160px', height: '220px', zIndex: 4, opacity: 1, filter: 'blur(0px)' } },
    { parent: '.n2', style: { width: '144px', height: '198px', zIndex: 3, opacity: 0.9, filter: 'blur(3px)' } },
    { parent: '.n2', style: { width: '144px', height: '198px', zIndex: 3, opacity: 0.9, filter: 'blur(3px)' } },
    { parent: '.n3', style: { width: '108px', height: '148px', zIndex: 2, opacity: 0.5, filter: 'blur(5px)' } },
    { parent: '.n3', style: { width: '108px', height: '148px', zIndex: 2, opacity: 0.5, filter: 'blur(5px)' } },
    { parent: '.n4', style: { width: '91px', height: '125px', zIndex: 1, opacity: 0.25, filter: 'blur(8px)' } },
    { parent: '.n4', style: { width: '91px', height: '125px', zIndex: 1, opacity: 0.25, filter: 'blur(8px)' } }
  ];

  const circleOrder = [0, 2, 4, 6, 5, 3, 1];

  const elementsByState = [
    document.querySelector('.n1um'),
    document.querySelector('.n2um'),
    document.querySelector('.n2dois'),
    document.querySelector('.n3um'),
    document.querySelector('.n3dois'),
    document.querySelector('.n4um'),
    document.querySelector('.n4dois')
  ];

  // Textos aleatórios para cada quadro
  const textos = [
    { titulo: "Criatividade", conteudo: "Transformando ideias em experiências únicas." },
    { titulo: "Inovação", conteudo: "Projetos que inspiram e mudam a forma de ver o mundo." },
    { titulo: "Design", conteudo: "Estética e funcionalidade andando juntas." },
    { titulo: "Tecnologia", conteudo: "Soluções inteligentes para problemas reais." },
    { titulo: "Estratégia", conteudo: "Planejamento que maximiza resultados." },
    { titulo: "Impacto", conteudo: "Cada projeto deixa sua marca." },
    { titulo: "Paixão", conteudo: "O combustível que move tudo que fazemos." }
  ];

  let centerIndex = 0;
  let animando = false;

  const tituloEl = document.querySelector('.titulo');
  const conteudoEl = document.querySelector('.conteudo');

  // Fade simples para o texto
  const atualizarTexto = () => {
    tituloEl.style.opacity = 0;
    conteudoEl.style.opacity = 0;

    setTimeout(() => {
      const texto = textos[centerIndex];
      tituloEl.textContent = texto.titulo;
      conteudoEl.textContent = texto.conteudo;
      tituloEl.style.transition = 'opacity 0.5s';
      conteudoEl.style.transition = 'opacity 0.5s';
      tituloEl.style.opacity = 1;
      conteudoEl.style.opacity = 1;
    }, 250);
  };

  // Aplica os estilos iniciais do carrossel
  const aplicarEstados = () => {
    for (let i = 0; i < estados.length; i++) {
      const estado = estados[i];
      const parent = document.querySelector(estado.parent);
      const el = elementsByState[i];
      if (!el || !parent) continue;

      parent.appendChild(el);
      el.style.width = estado.style.width;
      el.style.height = estado.style.height;
      el.style.zIndex = estado.style.zIndex;
      el.style.opacity = estado.style.opacity;
      el.style.filter = estado.style.filter;
      el.style.transition = `transform ${DURATION}ms ${EASING}, opacity ${DURATION}ms ${EASING}, filter ${DURATION}ms ${EASING}`;
      el.style.transformOrigin = 'center center';
      el.style.visibility = 'visible';
    }
    atualizarTexto();
  };

  aplicarEstados();

  // Função de rotação (FLIP)
  const animate = (direc = true) => {
    if (animando) return;
    animando = true;

    const n = circleOrder.length;
    const allElements = elementsByState.slice();
    const firstRects = new Map();

    allElements.forEach(el => firstRects.set(el, el.getBoundingClientRect()));

    const newElementsByState = new Array(elementsByState.length);
    for (let j = 0; j < n; j++) {
      const fromState = circleOrder[j];
      const toState = circleOrder[(j + (direc ? 1 : -1) + n) % n];
      newElementsByState[toState] = elementsByState[fromState];
    }
    for (let k = 0; k < elementsByState.length; k++) {
      if (!newElementsByState[k]) newElementsByState[k] = elementsByState[k];
    }
    for (let k = 0; k < elementsByState.length; k++) elementsByState[k] = newElementsByState[k];

    for (let i = 0; i < estados.length; i++) {
      const estado = estados[i];
      const parent = document.querySelector(estado.parent);
      const el = elementsByState[i];
      if (!el || !parent) continue;
      parent.appendChild(el);
      el.style.width = estado.style.width;
      el.style.height = estado.style.height;
      el.style.zIndex = estado.style.zIndex;
      el.style.opacity = estado.style.opacity;
      el.style.filter = estado.style.filter;
      el.style.transform = 'none';
    }

    // FLIP animation
    const running = [];
    allElements.forEach(el => {
      const first = firstRects.get(el);
      const last = el.getBoundingClientRect();
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      const sx = first.width / last.width || 1;
      const sy = first.height / last.height || 1;
      el.style.transition = 'none';
      el.style.transformOrigin = 'center center';
      el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
      el.getBoundingClientRect();
      el.style.transition = `transform ${DURATION}ms ${EASING}, opacity ${DURATION}ms ${EASING}, filter ${DURATION}ms ${EASING}`;
      running.push(el);
      requestAnimationFrame(() => el.style.transform = 'none');
    });

    // Atualiza índice do centro e o texto
    centerIndex = (centerIndex + (direc ? 1 : -1) + textos.length) % textos.length;
    atualizarTexto();

    // Finalização da animação
    let finished = 0;
    running.forEach(el => {
      const handler = (ev) => {
        if (ev.propertyName !== 'transform') return;
        el.removeEventListener('transitionend', handler);
        finished++;
        if (finished === running.length) animando = false;
      };
      el.addEventListener('transitionend', handler);
      setTimeout(() => { finished++; if (finished >= running.length) animando = false; }, DURATION + 100);
    });
  };

  document.querySelector('.seta-direita')?.addEventListener('click', () => animate(true));
  document.querySelector('.seta-esquerda')?.addEventListener('click', () => animate(false));
});
