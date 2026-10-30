/* Panel de empresa: mis ofertas, nueva oferta y postulantes */
const U = DB.guard("empresa") || {};
initAccount(U);
const of = $("of");
let tab = "o", fo = "";

const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const EST = [["nuevo", "Nuevo"], ["visto", "Visto"], ["pre", "Preseleccionado"], ["desc", "Descartado"]];
const estLabel = k => (EST.find(e => e[0] == k) || EST[0])[1];

async function render() {
  const os = (await DB.ofertasDe(U.id)) || [];
  const ps = (await DB.postsDePersona(1)) || [];
  $("ds").textContent = U.nombre || "Empresa";

  /* resumen */
  const abiertas = os.filter(o => o.estado == "abierta").length;
  const nuevos = ps.filter(p => (p.estado || "Pendiente") == "Pendiente").length;
  $("stats").innerHTML = [[abiertas, "Ofertas abiertas"], [ps.length, "Postulaciones recibidas"], [nuevos, "Sin revisar"]]
    .map(s => `<div class="stat"><b>${s[0]}</b><span>${s[1]}</span></div>`).join("");

  document.querySelectorAll("#tabs .chip").forEach(c => c.classList.toggle("on", c.dataset.t == tab));
  $("pO").hidden = tab != "o";
  $("pP").hidden = tab != "p";

  /* mis ofertas */
  if (!os.length) {
    $("ol").innerHTML = `<div class="vacio" style="grid-column:1/-1"><h3>Todavía no publicaste ofertas</h3><p>Publicá tu primera vacante y empezá a recibir postulaciones.</p><button class="btn pri" data-a="nueva">Publicar una oferta</button></div>`;
  } else {
    $("ol").innerHTML = os.map(o => {
      const puestoNombre = o.puesto || o.titulo || "Puesto minero";
      const mineralNombre = o.mineral || "Minería";
      const ubicacionNombre = o.ubicacion || "Mendoza / San Juan";
      const rentaTexto = o.renta || (o.salario ? `USD ${o.salario}` : "A convenir");
      const n = ps.filter(p => p.ofertaId == o.id).length;

      return `<article class="job" style="--mc:${MC[mineralNombre] || "var(--acc)"}">
        <div class="top"><span class="tag">${esc(mineralNombre)}</span><span class="ok">Abierta</span></div>
        <div><h3>${esc(puestoNombre)}</h3><div class="co2">Publicada recientemente</div></div>
        <dl>
          <dt>Ubicación</dt><dd>${esc(ubicacionNombre)}</dd>
          <dt>Modalidad</dt><dd>${esc(o.cat || o.modalidad || "Operaciones")}</dd>
          <dt>Renta ref./mes</dt><dd class="sal">${esc(rentaTexto)}</dd>
          <dt>Postulantes</dt><dd>${n}</dd>
        </dl>
        <div class="jact">
          <button class="btn" data-a="ver" data-id="${o.id}">Postulantes (${n})</button>
          <button class="btn" data-a="del" data-id="${o.id}">Eliminar</button>
        </div></article>`;
    }).join("");
  }

  /* postulantes */
  if (fo && !os.some(o => o.id == fo)) fo = "";
  $("pf").innerHTML = '<option value="">Todas mis ofertas</option>' + os.map(o => `<option value="${o.id}"${fo == o.id ? " selected" : ""}>${esc(o.puesto || o.titulo)}</option>`).join("");
  const lst = ps.filter(p => !fo || p.ofertaId == fo);

  if (!lst.length) {
    $("pl").innerHTML = `<div class="vacio"><h3>Sin postulantes por ahora</h3><p>Cuando alguien se postule a una de tus ofertas va a aparecer acá.</p></div>`;
  } else {
    $("pl").innerHTML = lst.map(p => {
      return `<article class="cand">
        <div class="av">C</div>
        <div>
          <h3>Candidato Postulado #${p.candidatoId}</h3>
          <div class="co2">Postulación a oferta #${p.ofertaId} · Estado: <b>${esc(p.estado || "Pendiente")}</b></div>
          <div class="cm">
            <span>Fecha: ${p.fechaPostulacion ? new Date(p.fechaPostulacion).toLocaleDateString() : "Reciente"}</span>
          </div>
        </div>
      </article>`;
    }).join("");
  }
}

$("tabs").onclick = e => { const c = e.target.closest("[data-t]"); if (c) { tab = c.dataset.t; render(); } };
$("pf").onchange = e => { fo = e.target.value; render(); };

$("ol").onclick = e => {
  const b = e.target.closest("[data-a]"); if (!b) return;
  const a = b.dataset.a, id = b.dataset.id;
  if (a == "nueva") return openNueva();
  if (a == "ver") { fo = id; tab = "p"; render(); }
};

/* nueva oferta */
function openNueva() { $("off").reset(); $("oerr").hidden = true; of.showModal(); }
$("newo").onclick = openNueva;

$("off").onsubmit = async e => {
  e.preventDefault();
  const min = +$("on1").value, max = +$("on2").value;
  if (max < min) { $("oerr").textContent = "La renta máxima no puede ser menor que la mínima."; $("oerr").hidden = false; return; }

  const res = await DB.publish(U, {
    puesto: $("op").value.trim(),
    cat: $("oc").value,
    mineral: $("om").value,
    ubicacion: $("ou").value.trim(),
    regimen: $("or").value,
    renta: "USD " + fmt(min) + "–" + fmt(max),
    altura: $("oa").value ? fmt(+$("oa").value) + " msnm" : "—",
    alojamiento: $("ol2").value.trim() || "A confirmar",
    urgente: $("ox").checked
  });

  if (res.error) {
    $("oerr").textContent = res.error;
    $("oerr").hidden = false;
    return;
  }

  of.close();
  tab = "o";
  await render();
  toast("Oferta publicada y registrada en MySQL");
};

render();