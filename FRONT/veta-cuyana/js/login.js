/* Inicio de sesión y registro. Según el tipo de cuenta, redirige a su página. */
(()=>{
  const u0=DB.me();
  if(u0){location.replace(DB.home(u0.rol));return}

  const A={rol:"persona",mode:"login"};
  const AH={persona:"Buscá vacantes y seguí tus postulaciones.",empresa:"Publicá ofertas y mirá quiénes se postularon."};

  function authUI(){
    const reg=A.mode=="reg",on=new Set([A.rol,reg?"reg":"login"]);
    document.querySelectorAll("#af [data-v]").forEach(el=>{
      const ok=el.dataset.v.split(" ").every(k=>on.has(k));
      el.hidden=!ok;
      el.querySelectorAll("input").forEach(i=>{i.disabled=!ok;i.required=ok});
    });
    $("segr").querySelectorAll("button").forEach(b=>{const s=b.dataset.r==A.rol;b.classList.toggle("on",s);b.setAttribute("aria-selected",s)});
    $("at").textContent=$("asb").textContent=reg?"Crear cuenta":"Ingresar";
    $("ah").textContent=AH[A.rol];
    $("ap").autocomplete=reg?"new-password":"current-password";
    $("asw").innerHTML=reg?'¿Ya tenés cuenta? <a href="#" data-m="login">Ingresar</a>':'¿Todavía no tenés cuenta? <a href="#" data-m="reg">Crear cuenta</a>';
    err("");
  }
  function err(m){const e=$("aerr");e.textContent=m;e.hidden=!m}

  /* CUIT argentino: 11 dígitos con dígito verificador */
  function cuitOk(s){
    const d=s.replace(/\D/g,"");
    if(d.length!=11)return false;
    const w=[5,4,3,2,7,6,5,4,3,2];
    let t=0;for(let i=0;i<10;i++)t+=w[i]*+d[i];
    let v=11-t%11;if(v==11)v=0;
    return v==+d[10];
  }

  $("segr").onclick=e=>{const b=e.target.closest("[data-r]");if(b){A.rol=b.dataset.r;authUI()}};
  $("asw").onclick=e=>{const l=e.target.closest("[data-m]");if(l){e.preventDefault();A.mode=l.dataset.m;authUI()}};

  $("af").onsubmit=async e=>{
    e.preventDefault();err("");
    const email=$("ae").value,pw=$("ap").value,btn=$("asb");
    btn.disabled=true;
    try{
      if(A.mode=="login"){
        const r=await DB.login(email,pw);
        if(r.error)return err(r.error);
        if(r.user.rol!=A.rol){
          DB.logout();
          return err("Ese correo es de una cuenta de "+(r.user.rol=="empresa"?"empresa":"persona")+". Elegí «Soy "+r.user.rol+"».");
        }
        return location.replace(DB.home(r.user.rol));
      }
      /* registro */
      if(pw!==$("ap2").value)return err("Las contraseñas no coinciden.");
      if(!$("at2").checked)return err("Tenés que aceptar los términos para crear la cuenta.");
      let d;
      if(A.rol=="empresa"){
        if(!cuitOk($("acu").value))return err("El CUIT no es válido. Revisá los 11 números.");
        d={rol:"empresa",email,password:pw,nombre:$("arz").value,extra:{cuit:$("acu").value.replace(/\D/g,""),contacto:$("apc").value.trim()}};
      }else{
        d={rol:"persona",email,password:pw,nombre:$("an").value,extra:{whatsapp:$("aw").value.trim()}};
      }
      const r=await DB.register(d);
      if(r.error)return err(r.error);
      location.replace(DB.home(r.user.rol));
    }finally{btn.disabled=false}
  };

  authUI();
})();
