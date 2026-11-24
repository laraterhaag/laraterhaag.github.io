/* =========================================================
   CONTEÚDO — edite estas listas para atualizar o portfólio
   ========================================================= */

// Obras de arte. Coloque suas imagens em /img e preencha "img".
// Enquanto "img" estiver vazio, o site desenha uma pintura generativa de exemplo.
const ARTWORKS = [
  { title: "Ellie e Joel - TLOU", year: 2026, technique: "digital",  medium: "Pintura digital · Procreate", ratio: 1.25, img: "img/img1.webp", desc: "Escreva aqui a história da obra: inspiração, processo, o que você queria transmitir." },
  { title: "Cartão de aniversário para minha amiga!",        year: 2026, technique: "digital", medium: "Pintura digital · Procreate",   ratio: 0.75, img: "img/img2.webp", desc: "Descrição da obra." },
  { title: "Retrato da gata Bigoda",  year: 2026, technique: "digital",     medium: "Pintura digital · Procreate",   ratio: 1.3,  img: "img/img3.webp", desc: "Descrição da obra." },
  { title: "Desenho de hora de aventura",  year: 2026, technique: "digital",  medium: "Pintura digital · Procreate",  ratio: 1,    img: "img/img4.webp", desc: "Descrição da obra." },
  { title: "Desenho de hora de aventura",      year: 2026, technique: "digital", medium: "Pintura digital · Procreate",          ratio: 1.4,  img: "img/img5.webp", desc: "Descrição da obra." },
  { title: "Desenho de hora de aventura - Marceline e Jujuba",     year: 2026, technique: "digital",     medium: "Pintura digital · Procreate",         ratio: 0.8,  img: "img/img6.webp", desc: "Descrição da obra." },
  { title: "Deseinhos",    year: 2026, technique: "digital",  medium: "Pintura digital · Procreate",             ratio: 1.15, img: "img/img7.webp", desc: "Descrição da obra." },
  { title: "Kombi e Sr Pequeno ",  year: 2026, technique: "digital", medium: "Pintura digital · Procreate",        ratio: 1,    img: "img/img8.webp", desc: "Descrição da obra." },
  { title: "Help Cola",      year: 2026, technique: "digital",     medium: "Pintura digital · Procreate",             ratio: 1.25, img: "img/img9.webp", desc: "Descrição da obra." },
];

// Projetos de Ciência da Computação.
const PROJECTS = [
  {
    name: "pincel-neural",
    file: "main.py",
    desc: "Rede neural que transfere o estilo das minhas aquarelas para fotografias. Projeto de TCC.",
    tags: ["Python", "PyTorch", "Visão Computacional"],
    badge: "★ TCC",
    links: { código: "https://github.com/", demo: "#" },
  },
  {
    name: "paleta-api",
    file: "server.ts",
    desc: "API que extrai paletas de cores de imagens usando k-means e sugere combinações harmônicas.",
    tags: ["TypeScript", "Node.js", "Docker"],
    links: { código: "https://github.com/" },
  },
  {
    name: "flores-generativas",
    file: "sketch.js",
    desc: "Série de arte generativa em p5.js — cada flor nasce de uma semente aleatória diferente.",
    tags: ["p5.js", "Arte Generativa"],
    badge: "arte + código",
    links: { código: "https://github.com/", demo: "#" },
  },
  {
    name: "rastreador-de-tarefas",
    file: "App.java",
    desc: "Sistema de gerenciamento de tarefas desenvolvido em equipe durante o estágio.",
    tags: ["Java", "Spring", "PostgreSQL"],
    links: { código: "https://github.com/" },
  },
];

/* =========================================================
   Utilidades
   ========================================================= */
const $ = (s, el = document) => el.querySelector(s);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

function rng(seed) { // mulberry32
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PALETTES = {
  digital:  ["#2a1530", "#ff7eb6", "#c9a7ff", "#ffd6e7", "#5b2a5e", "#ffe29a"],
  aquarela: ["#f7c6d9", "#d9c4ff", "#ffe4ec", "#fbe2c8", "#e898b8", "#bfe3dc"],
  oleo:     ["#3a1a2c", "#d6336c", "#ffb3cf", "#6c3d8f", "#f3dce6", "#8a2d4f"],
};

/* =========================================================
   Pintura generativa de exemplo (placeholder das obras)
   ========================================================= */
function paint(canvas, seed, technique, w, h) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = w * dpr; canvas.height = h * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  const r = rng(seed);
  const pal = PALETTES[technique] || PALETTES.digital;
  const pick = () => pal[Math.floor(r() * pal.length)];

  // fundo
  const bg = ctx.createLinearGradient(0, 0, w * r(), h);
  bg.addColorStop(0, pick()); bg.addColorStop(1, pick());
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

  // manchas suaves
  const blobs = technique === "aquarela" ? 14 : 7;
  for (let i = 0; i < blobs; i++) {
    const x = r() * w, y = r() * h, rad = (0.15 + r() * 0.45) * Math.max(w, h);
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    const c = pick();
    g.addColorStop(0, c + (technique === "aquarela" ? "88" : "cc"));
    g.addColorStop(1, c + "00");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }

  // pinceladas
  const strokes = technique === "oleo" ? 160 : technique === "digital" ? 90 : 40;
  ctx.lineCap = "round";
  for (let i = 0; i < strokes; i++) {
    let x = r() * w, y = r() * h;
    const len = 20 + r() * (technique === "oleo" ? 60 : 140);
    const ang0 = r() * Math.PI * 2;
    ctx.strokeStyle = pick();
    ctx.globalAlpha = technique === "aquarela" ? 0.15 : 0.35 + r() * 0.4;
    ctx.lineWidth = technique === "oleo" ? 3 + r() * 9 : 1 + r() * 4;
    ctx.beginPath(); ctx.moveTo(x, y);
    for (let s = 0; s < len; s += 4) {
      const a = ang0 + Math.sin((x + y) * 0.01 + seed) * 1.2;
      x += Math.cos(a) * 4; y += Math.sin(a) * 4;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // forma focal (sol / lua / flor)
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = pick();
  ctx.beginPath();
  ctx.arc(w * (0.25 + r() * 0.5), h * (0.25 + r() * 0.4), Math.min(w, h) * (0.06 + r() * 0.1), 0, Math.PI * 2);
  ctx.fill();

  // granulação do papel
  ctx.globalAlpha = 1;
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (r() - 0.5) * (technique === "aquarela" ? 22 : 14);
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

/* =========================================================
   Galeria
   ========================================================= */
const gallery = $("#gallery");

function mediaFor(art, i, width) {
  if (art.img) {
    const im = new Image();
    im.src = art.img; im.alt = `${art.title} — ${art.medium}`; im.loading = "lazy";
    return im;
  }
  const c = document.createElement("canvas");
  c.setAttribute("role", "img");
  c.setAttribute("aria-label", `${art.title} (imagem de exemplo)`);
  paint(c, i * 9973 + 17, art.technique, width, Math.round(width * art.ratio));
  return c;
}

ARTWORKS.forEach((art, i) => {
  const fig = document.createElement("figure");
  fig.className = "art-card";
  fig.tabIndex = 0;
  fig.dataset.technique = art.technique;
  fig.appendChild(mediaFor(art, i, 420));
  fig.insertAdjacentHTML("beforeend",
    `<figcaption><strong>${art.title}</strong><span>${art.medium} · ${art.year}</span></figcaption>`);
  const open = () => openLightbox(art, i);
  fig.addEventListener("click", open);
  fig.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  gallery.appendChild(fig);
});

// filtros
document.querySelectorAll(".filters .chip").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filters .chip").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const f = btn.dataset.filter;
    gallery.querySelectorAll(".art-card").forEach((card) => {
      card.classList.toggle("is-hidden", f !== "todas" && card.dataset.technique !== f);
    });
  });
});

// lightbox
const lb = $("#lightbox");
function openLightbox(art, i) {
  const media = $("#lightboxMedia");
  media.innerHTML = "";
  media.appendChild(mediaFor(art, i, 900));
  $("#lightboxTitle").textContent = art.title;
  $("#lightboxMeta").textContent = `${art.medium} · ${art.year}`;
  $("#lightboxDesc").textContent = art.desc;
  lb.showModal();
}
$("#lightboxClose").addEventListener("click", () => lb.close());
lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });

/* =========================================================
   Projetos
   ========================================================= */
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
$("#projects").innerHTML = PROJECTS.map((p) => `
  <article class="project">
    <div class="project__bar"><i></i><i></i><i></i><span>${esc(p.name)}/${esc(p.file)}</span></div>
    <div class="project__body">
      ${p.badge ? `<span class="project__badge">${esc(p.badge)}</span>` : ""}
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.desc)}</p>
      <ul class="project__tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      <div class="project__links">
        ${Object.entries(p.links).map(([k, v]) => `<a href="${esc(v)}" target="_blank" rel="noopener">${esc(k)} ↗</a>`).join("")}
      </div>
    </div>
  </article>`).join("");

/* =========================================================
   Hero — campo de fluxo generativo (pinceladas de código)
   ========================================================= */
(function hero() {
  const canvas = $("#heroCanvas");
  const ctx = canvas.getContext("2d");
  let w, h, particles = [], t = 0;
  const mouse = { x: -9999, y: -9999 };

  function colors() { return [css("--art"), css("--code"), css("--gold"), css("--ink-soft")]; }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = css("--paper"); ctx.fillRect(0, 0, w, h);
    const pal = colors();
    const n = Math.min(900, Math.floor((w * h) / 1600));
    particles = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      c: pal[Math.floor(Math.random() * pal.length)],
      life: Math.random() * 200,
    }));
  }

  function field(x, y) {
    let a = Math.sin(x * 0.0035 + t) * Math.cos(y * 0.004 - t * 0.7) * Math.PI * 2;
    const dx = x - mouse.x, dy = y - mouse.y, d2 = dx * dx + dy * dy;
    if (d2 < 30000) a += Math.atan2(dy, dx) + Math.PI / 2; // redemoinho em volta do mouse
    return a;
  }

  function step() {
    ctx.globalAlpha = 0.04;
    ctx.fillStyle = css("--paper");
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 1.4;
    for (const p of particles) {
      const a = field(p.x, p.y);
      const nx = p.x + Math.cos(a) * 1.6, ny = p.y + Math.sin(a) * 1.6;
      ctx.strokeStyle = p.c;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny); ctx.stroke();
      p.x = nx; p.y = ny; p.life--;
      if (p.life < 0 || p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
        p.x = Math.random() * w; p.y = Math.random() * h; p.life = 100 + Math.random() * 200;
      }
    }
    t += 0.0015;
  }

  function loop() { step(); requestAnimationFrame(loop); }

  canvas.parentElement.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  canvas.parentElement.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });

  resize();
  window.addEventListener("resize", resize);
  document.addEventListener("themechange", resize);
  if (reduceMotion) { for (let i = 0; i < 400; i++) step(); }
  else loop();
})();

/* =========================================================
   Retrato placeholder, tema, animações de entrada
   ========================================================= */
const portrait = $("#portraitCanvas");
// Se você trocar o <canvas> pela sua foto (<img>), este desenho de exemplo é simplesmente ignorado.
if (portrait) paint(portrait, 4242, "aquarela", 380, 475);

const themeBtn = $("#themeToggle");
const root = document.documentElement;
try { const saved = localStorage.getItem("theme"); if (saved) root.dataset.theme = saved; } catch (e) {}
themeBtn.addEventListener("click", () => {
  const isDark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = isDark ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  document.dispatchEvent(new Event("themechange"));
});

const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
}, { threshold: 0.1 });
document.querySelectorAll(".art-card").forEach((el) => io.observe(el));

// destaca o link da seção atual no menu
const navLinks = document.querySelectorAll(".nav__links a");
const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      navLinks.forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === "#" + en.target.id));
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach((s) => sectionObs.observe(s));

$("#year").textContent = new Date().getFullYear();
