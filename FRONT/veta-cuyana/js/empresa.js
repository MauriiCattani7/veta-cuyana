/* Panel de empresa: mis ofertas, nueva oferta y postulantes */
const U=DB.guard("empresa")||{};
initAccount(U);
const of=$("of");
let tab="o",fo="";

const fmt=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,".");
const EST=[["nuevo","Nuevo"],["visto","Visto"],["pre","Preseleccionado"],["desc","Descartado"]];
const estLabel=k=>(EST.find(e=>e[0]==k)||EST[0])[1];

function render(){
  const os=DB.ofertasDe(U.id),ps=DB.postsDeEmpresa(U.id).sort((a,b)=>b.fecha-a.fecha);
  $("ds").textContent=U.nombre||"";

  /* resumen */
  const abiertas=os.filter(o=>o.estado=="abierta").length,nuevos=ps.filter(p=>p.estado=="nuevo").length;
  $("stats").innerHTML=[[abiertas,"Ofertas abiertas"],[ps.length,"Postulaciones recibidas"],[nuevos,"Sin revisar"]]
    .map(s=>`<div class="stat"><b>${s[0]}</b><span>${s[1]}</span></div>`).join("");

  document.querySelectorAll("#tabs .chip").forEach(c=>c.classList.toggle("on",c.dataset.t==tab));
  $("pO").hidden=tab!="o";$("pP").hidden=tab!="p";

  /* mis ofertas */
  if(!os.length){
    $("ol").innerHTML=`<div class="vacio" style="grid-column:1/-1"><h3>Todavía no publicaste ofertas</h3><p>Publicá tu primera vacante y empezá a recibir postulaciones.</p><button class="btn pri" data-a="nueva">Publicar una oferta</button></div>`;
  }else{
    $("ol").innerHTML=os.map(o=>{
      const n=ps.filter(p=>p.ofertaId==o.id).length,ab=o.estado=="abierta";
      return `<article class="job" style="--mc:${MC[o.mineral]||"var(--acc)"}">
        <div class="top"><span class="tag">${esc(o.mineral)}</span><span class="${ab?"ok":"off"}">${ab?"Abierta":"Cerrada"}</span></div>
        <div><h3>${esc(o.puesto)}</h3><div class="co2">Publicada el ${fdate(o.creada)}${o.urgente?" · Urgente":""}</div></div>
        <dl><dt>Ubicación</dt><dd>${esc(o.ubicacion)}</dd><dt>Régimen</dt><dd>${esc(o.regimen)}</dd><dt>Renta ref./mes</dt><dd class="sal">${esc(o.renta)}</dd><dt>Postulantes</dt><dd>${n}</dd></dl>
        <div class="jact">
          <button class="btn" data-a="ver" data-id="${o.id}">Postulantes (${n})</button>
          <button class="btn" data-a="tog" data-id="${o.id}">${ab?"Cerrar":"Reabrir"}</button>
          <button class="btn" data-a="del" data-id="${o.id}">Eliminar</button>
        </div></article>`;
    }).join("");
  }

  /* postulantes */
  if(fo&&!os.some(o=>o.id==fo))fo="";
  $("pf").innerHTML='<option value="">Todas mis ofertas</option>'+os.map(o=>`<option value="${o.id}"${fo==o.id?" selected":""}>${esc(o.puesto)}</option>`).join("");
  const lst=ps.filter(p=>!fo||p.ofertaId==fo);
  if(!lst.length){
    $("pl").innerHTML=`<div class="vacio"><h3>Sin postulantes por ahora</h3><p>Cuando alguien se postule a una de tus ofertas va a aparecer acá.</p></div>`;
  }else{
    $("pl").innerHTML=lst.map(p=>{
      const wa=String(p.whatsapp||"").replace(/\D/g,"");
      return `<article class="cand">
        <div class="av">${esc((p.nombre||"?").trim().charAt(0).toUpperCase())}</div>
        <div>
          <h3>${esc(p.nombre)}</h3>
          <div class="co2">Se postuló a <b>${esc(p.puesto)}</b> · ${fdate(p.fecha)}</div>
          <div class="cm"><span>Experiencia: ${esc(p.experiencia||"—")}</span><span>Examen de altura: ${esc(p.altura||"—")}</span></div>
          <div class="cl">
            <a href="mailto:${esc(p.email)}">Correo</a>
            ${wa?`<a href="https://wa.me/${wa}" target="_blank" rel="noopener">WhatsApp</a>`:""}
            <button type="button" data-cv="${p.personaId}">Descargar CV</button>
          </div>
        </div>
        <label class="est">Estado<select class="inp" data-p="${p.id}">${EST.map(e=>`<option value="${e[0]}"${p.estado==e[0]?" selected":""}>${e[1]}</option>`).join("")}</select></label>
      </article>`;
    }).join("");
  }
}

$("tabs").onclick=e=>{const c=e.target.closest("[data-t]");if(c){tab=c.dataset.t;render()}};
$("pf").onchange=e=>{fo=e.target.value;render()};
$("pl").onchange=e=>{const s=e.target.closest("[data-p]");if(s){DB.setEstado(s.dataset.p,s.value);toast("Estado: "+estLabel(s.value));render()}};
$("pl").onclick=e=>{const b=e.target.closest("[data-cv]");if(b)bajarCV(DB.cvDe(b.dataset.cv))};
$("ol").onclick=e=>{
  const b=e.target.closest("[data-a]");if(!b)return;
  const a=b.dataset.a,id=b.dataset.id;
  if(a=="nueva")return openNueva();
  if(a=="ver"){fo=id;tab="p"}
  if(a=="tog"){const o=DB.ofertasDe(U.id).find(x=>x.id==id);DB.setOferta(id,{estado:o.estado=="abierta"?"cerrada":"abierta"});toast(o.estado=="abierta"?"Oferta cerrada: ya no aparece en el buscador":"Oferta reabierta")}
  if(a=="del"){
    if(DB.postsDeEmpresa(U.id).some(p=>p.ofertaId==id)){toast("Tiene postulantes: cerrala en lugar de eliminarla");return}
    if(!confirm("¿Eliminar esta oferta?"))return;
    DB.delOferta(id);toast("Oferta eliminada");
  }
  render();
};

/* nueva oferta */
function openNueva(){$("off").reset();$("oerr").hidden=true;of.showModal()}
$("newo").onclick=openNueva;
$("off").onsubmit=e=>{
  e.preventDefault();
  const min=+$("on1").value,max=+$("on2").value;
  if(max<min){$("oerr").textContent="La renta máxima no puede ser menor que la mínima.";$("oerr").hidden=false;return}
  const r=DB.publish(U,{
    puesto:$("op").value.trim(),cat:$("oc").value,mineral:$("om").value,
    ubicacion:$("ou").value.trim(),regimen:$("or").value,
    renta:"USD "+fmt(min)+"–"+fmt(max),
    altura:$("oa").value?fmt(+$("oa").value)+" msnm":"—",
    alojamiento:$("ol2").value.trim()||"A confirmar",
    urgente:$("ox").checked
  });
  if(r.error){$("oerr").textContent=r.error;$("oerr").hidden=false;return}
  of.close();tab="o";render();toast("Oferta publicada: ya aparece en el buscador de vacantes");
};

render();
