/* $, esc, toast y el tema claro/oscuro vienen de ui.js */
let U = DB.guard("persona") || {};
initAccount(U);
const S = { cat: "todos", m: "", kw: "", ros: "", all: false };

/* hero */
let si = 0;
$("slides").innerHTML = SL.map((s, i) => `<div class="slide${i ? '' : ' on'}"><svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMax slice"><rect width="1200" height="600" style="fill:${s[2]}"/><path style="fill:#000;opacity:.25" d="M0 420L180 260l140 110 190-210 170 170 150-130 210 200 160-90V600H0z"/><path style="fill:#000;opacity:.4" d="M0 500l220-120 160 80 220-150 200 150 190-90 210 130V600H0z"/><path style="fill:#000;opacity:.6" d="M0 560l300-70 260 40 300-60 340 50V600H0z"/></svg></div>`).join("");
function show() { const s = SL[si]; $("ht").innerHTML = s[0]; $("hp").textContent = s[1]; document.querySelectorAll(".slide").forEach((e, i) => e.classList.toggle("on", i == si)); }
let tm; function go(d) { si = (si + d + SL.length) % SL.length; show(); clearInterval(tm); if (!matchMedia("(prefers-reduced-motion:reduce)").matches) tm = setInterval(() => go(1), 7000); }
go(0);

/* empresas */
const tile = c => `<div class="co"><div><b>${c[0]}</b><small>${c[1]}</small></div></div>`;
$("tr").innerHTML = CO.map(tile).join(""); $("gc").innerHTML = CO.map(tile).join("");
$("allco").onclick = () => { const o = $("gc").classList.toggle("open"); $("tr").parentElement.style.display = o ? "none" : "flex"; $("allco").lastChild.textContent = o ? "Ver menos empresas" : "Ver todas las empresas"; };

/* vacantes y postulaciones en memoria */
let dbOfertas = [];
let userPosts = [];

const ALL = () => dbOfertas.map(DB.toArr).concat(J.map((j, i) => [...j, "seed-" + i]));

async function cargarDatosBackend() {
  dbOfertas = await DB.ofertasAbiertas();
  if (U && U.id) {
    userPosts = await DB.postsDePersona(U.id);
  }
  render();
}
cargarDatosBackend();

function render() {
  const f = ALL().filter(j => (S.cat == "todos" || j[2] == S.cat) && (!S.m || j[3] == S.m) && (!S.ros || j[5] == S.ros) && (!S.kw || (j[0] + j[1]).toLowerCase().includes(S.kw.toLowerCase())));
  const list = S.all ? f : f.slice(0, 6);
  $("cnt").textContent = f.length + (f.length == 1 ? " resultado" : " resultados");
  $("empty").style.display = f.length ? "none" : "block";
  $("more").parentElement.style.display = f.length > 6 ? "block" : "none";
  $("more").textContent = S.all ? "Ver menos vacantes" : `Ver todas las vacantes (${f.length})`;

  // Comprueba si el usuario ya se postuló a esta oferta (por ID numérico o seed)
  const mine = new Set(userPosts.map(p => String(p.ofertaId)));

  $("jobs").innerHTML = list.map(j => {
    const yaPostulado = mine.has(String(j[10]));
    return `<article class="job" style="--mc:${MC[j[3]] || "var(--acc)"}">
      <div class="top"><span class="tag">${esc(j[3])}</span>${j[9] ? '<span class="urg">Urgente</span>' : '<span>Vigente</span>'}</div>
      <div><h3>${esc(j[0])}</h3><div class="co2">${esc(j[1])}</div></div>
      <dl>
        <dt>Ubicación</dt><dd>${esc(j[4])}</dd>
        <dt>Régimen</dt><dd>${esc(j[5])}</dd>
        <dt>Altura</dt><dd>${esc(j[7])}</dd>
        <dt>Renta ref./mes</dt><dd class="sal">${esc(j[6])}</dd>
        <dt>Alojamiento</dt><dd>${esc(j[8])}</dd>
      </dl>
      ${yaPostulado ? '<button class="btn" disabled>✓ Ya te postulaste</button>' : `<button class="btn" data-id="${esc(j[10])}">Postular a este puesto</button>`}
    </article>`;
  }).join("");

  $("tabs").innerHTML = CATS.map(c => `<button class="chip${S.cat == c[0] ? ' on' : ''}" data-c="${c[0]}">${c[1]}</button>`).join("");
  $("cat").value = S.cat;
}

$("tabs").onclick = e => { const c = e.target.closest("[data-c]"); if (c) { S.cat = c.dataset.c; render(); } };
$("jobs").onclick = e => { const b = e.target.closest("[data-id]"); if (b) { cvOferta = ALL().find(j => j[10] == b.dataset.id) || null; openCVDialog(); } };
$("more").onclick = () => { S.all = !S.all; render(); };
document.querySelector(".chips").onclick = e => { const c = e.target.closest("[data-m]"); if (!c) return; S.m = c.dataset.m; document.querySelectorAll(".chips .chip").forEach(x => x.classList.toggle("on", x == c)); render(); $("vacantes").scrollIntoView(); };
$("sf").onsubmit = e => { e.preventDefault(); S.kw = $("kw").value; S.cat = $("cat").value; S.ros = $("ros").value; render(); $("vacantes").scrollIntoView(); };
function reset() { Object.assign(S, { cat: "todos", m: "", kw: "", ros: "", all: false }); $("kw").value = ""; $("ros").value = ""; document.querySelectorAll(".chips .chip").forEach((x, i) => x.classList.toggle("on", i == 0)); render(); }

/* Modal CV y postulación */
const cv = $("cv");
let cvOferta = null;
function openCV() { cvOferta = null; openCVDialog(); }
function openCVDialog() {
  $("cvt").textContent = cvOferta ? "Postular: " + cvOferta[0] : "Cargar CV";
  $("cbtn").textContent = cvOferta ? "Enviar postulación" : "Guardar CV";
  $("cn").value = U.nombre || ""; $("ce").value = U.email || ""; $("cw").value = U.whatsapp || "";
  $("cx").value = U.experiencia || "Menos de 2 años"; $("ca").value = U.altura || "Vigente";
  $("cf").value = ""; $("cf").required = false;
  $("cvs").textContent = U.cv ? "CV guardado: " + U.cv.name + ". Subí otro solo si querés reemplazarlo." : "";
  $("cerr").hidden = true;
  cv.showModal();
}

$("cvf").onsubmit = async e => {
  e.preventDefault();
  const fail = m => { $("cerr").textContent = m; $("cerr").hidden = false; };

  const f = $("cf").files[0];
  const datosFormulario = {
    nombre: $("cn").value.trim(),
    whatsapp: $("cw").value.trim(),
    experiencia: $("cx").value,
    altura: $("ca").value,
    cvNombre: f ? f.name : (U.cv ? U.cv.name : "CV_Candidato.pdf")
  };

  if (cvOferta) {
    const r = await DB.postular(U, { id: cvOferta[10] }, datosFormulario);
    if (r.error) return fail(r.error);
    toast("Postulación enviada con éxito.");
    
    // Actualizamos las postulaciones en vivo
    if (U && U.id) {
      userPosts = await DB.postsDePersona(U.id);
    }
  } else {
    toast("Datos actualizados correctamente.");
  }

  cv.close();
  render();
};