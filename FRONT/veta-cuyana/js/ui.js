/* Utilidades compartidas por todas las páginas: tema claro/oscuro, avisos, cuenta y texto seguro */
const $=id=>document.getElementById(id);
/* todo texto que escribe un usuario y se muestra con innerHTML pasa por esc() */
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fdate=t=>new Date(t).toLocaleDateString("es-AR",{day:"2-digit",month:"short",year:"numeric"});

function toast(m){const t=$("toast");t.textContent=m;t.classList.add("show");clearTimeout(t.h);t.h=setTimeout(()=>t.classList.remove("show"),3200)}

const sun='<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',moon='<svg viewBox="0 0 24 24"><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/></svg>';
function theme(t){document.documentElement.dataset.theme=t;$("theme").innerHTML=t=="dark"?sun:moon;try{localStorage.setItem("mt-theme",t)}catch(e){}}
let t0="dark";try{t0=localStorage.getItem("mt-theme")||(matchMedia("(prefers-color-scheme:light)").matches?"light":"dark")}catch(e){}
theme(t0);$("theme").onclick=()=>theme(document.documentElement.dataset.theme=="dark"?"light":"dark");

/* botón de usuario del encabezado: muestra la cuenta y permite cerrar sesión */
function initAccount(U){
  const b=$("acc");if(!b)return;
  const prev=$("acct");if(prev)prev.remove();
  const d=document.createElement("dialog");d.id="acct";
  d.innerHTML=`<div class="sesbox"><h3>Tu cuenta</h3>
    <p><b>${esc(U.nombre)}</b><br>${esc(U.email)}<br><span class="hint">Cuenta de ${U.rol=="empresa"?"empresa":"persona"}</span></p>
    <div class="row"><button type="button" class="btn" data-x="c">Cerrar</button><button type="button" class="btn pri" data-x="o">Cerrar sesión</button></div></div>`;
  document.body.append(d);
  d.onclick=e=>{const x=e.target.closest("[data-x]");if(!x)return;if(x.dataset.x=="c")d.close();else{DB.logout();location.replace("login.html")}};
  b.onclick=()=>d.showModal();
  b.classList.add("on");
}

/* descarga el CV guardado (viene como data URL) */
function bajarCV(cv){
  if(!cv){toast("Esta persona todavía no cargó un CV.");return}
  const a=document.createElement("a");a.href=cv.data;a.download=cv.name;document.body.append(a);a.click();a.remove();
}
