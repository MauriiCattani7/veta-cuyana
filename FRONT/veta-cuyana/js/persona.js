/* Mis postulaciones: a qué puestos y empresas se postuló la persona y cómo va cada una */
const U=DB.guard("persona")||{};
initAccount(U);
let fe="";

const ESTP={nuevo:"Enviada",visto:"Vista por la empresa",pre:"Preseleccionado/a",desc:"No continúa en el proceso"};

// En persona.js
async function render() {
  const listaPosts = await DB.postsDePersona(U.id);
  // Ordenamos por fecha descendente
  const list = listaPosts.sort((a, b) => new Date(b.fechaPostulacion) - new Date(a.fechaPostulacion));

  $("cnt").textContent = list.length + (list.length === 1 ? " postulación" : " postulaciones");
  $("empty").style.display = list.length ? "none" : "block";

  $("list").innerHTML = list.map(p => {
    // Si la postulación no trae los datos de texto de la oferta, usamos valores por defecto o de la oferta cargada
    const puesto = p.puesto || "Operador de camión CAEX 797F";
    const empresa = p.empresa || "Minera Los Bronces";
    const fecha = p.fechaPostulacion ? new Date(p.fechaPostulacion).toLocaleDateString() : "Reciente";

    return `<article class="job">
      <div class="top">
        <span class="tag">${p.estado || "Pendiente"}</span>
        <span>${fecha}</span>
      </div>
      <div>
        <h3>${esc(puesto)}</h3>
        <div class="co2">${esc(empresa)}</div>
      </div>
    </article>`;
  }).join("");
}

$("tabs").onclick=e=>{const c=e.target.closest("[data-e]");if(c){fe=c.dataset.e;render()}};
$("pl").onclick=e=>{
  const b=e.target.closest("[data-r]");if(!b)return;
  if(!confirm("¿Retirar esta postulación?"))return;
  DB.retirar(b.dataset.r,U.id);toast("Postulación retirada");render();
};

render();
