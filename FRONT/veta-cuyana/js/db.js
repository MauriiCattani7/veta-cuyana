/* CAPA DE DATOS de Veta Cuyana.
   Hoy todo se guarda en el localStorage del navegador: sirve para armar y probar la página,
   pero los datos viven solo en esa computadora y esa persona. Para tener cuentas reales
   (que entren desde cualquier dispositivo) hay que reemplazar el contenido de este archivo
   por un servidor (Supabase, Firebase, etc.). El resto de la página solo usa las funciones de DB. */
const DB=(()=>{
  const K={u:"vc-users",s:"vc-session",o:"vc-ofertas",p:"vc-postulaciones"};
  const rd=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
  const wr=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
  const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
  const norm=e=>String(e||"").trim().toLowerCase();

  /* contraseña: se guarda un hash, nunca el texto. (Con un servidor real esto lo hace el servidor.) */
  async function hash(pw,salt){
    const s=salt+"|"+pw;
    try{
      const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));
      return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("");
    }catch(e){let h=5381;for(const c of s)h=((h<<5)+h+c.charCodeAt(0))|0;return "f"+(h>>>0).toString(16)}
  }

  /* ---------- cuentas y sesión ---------- */
  const users=()=>rd(K.u,[]);
  const API_URL = "http://localhost:8080/api/usuarios";

  async function register(d) {
    const email = norm(d.email);
    const rolId = d.rol === "empresa" ? 2 : 1;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: d.password,
          rolId: rolId
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        return { error: errorText || "No se pudo registrar el usuario en el servidor." };
      }

      const userCreated = await res.json();

      const u = {
        ...(d.extra || {}),
        id: userCreated.id,
        rol: d.rol,
        email: userCreated.email,
        nombre: d.nombre.trim(),
        creado: userCreated.fechaRegistro
      };

      // Mantiene la sesión activa para la navegación del front
      wr(K.s, { id: u.id, rol: u.rol, nombre: u.nombre, email: u.email });
      return { user: u };

    } catch (err) {
      console.error("Error al conectar con la API:", err);
      return { error: "No se pudo conectar con el servidor (verificá que el backend esté corriendo en el puerto 8080)." };
    }
  }
  async function login(email, password) {
    email = norm(email);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (res.status === 401) {
        return { error: "Correo o contraseña incorrectos." };
      }

      if (!res.ok) {
        return { error: "Error en el servidor al intentar iniciar sesión." };
      }

      const user = await res.json();
      const rolTexto = user.rolId === 2 ? "empresa" : "persona";

      const u = {
        id: user.id,
        rol: rolTexto,
        email: user.email,
        nombre: user.email.split("@")[0],
        creado: user.fechaRegistro
      };

      wr(K.s, { id: u.id, rol: u.rol, nombre: u.nombre, email: u.email });
      return { user: u };

    } catch (err) {
      console.error("Error en login:", err);
      return { error: "No se pudo conectar con el servidor." };
    }
  }

  function me(){return rd(K.s, null);}
  
  function logout(){try{localStorage.removeItem(K.s)}catch(e){}}
  const home=rol=>rol=="empresa"?"empresa.html":"index.html";
  /* protege una página: sin sesión va al login; con otro tipo de cuenta, a su propia página */
  function guard(rol){
    const u=me();
    if(!u){location.replace("login.html");return null}
    if(u.rol!=rol){location.replace(home(u.rol));return null}
    return u;
  }
  function updateProfile(id,patch){
    const l=users(),i=l.findIndex(x=>x.id==id);
    if(i<0)return false;
    l[i]={...l[i],...patch};return wr(K.u,l);
  }
  /* CV: se guarda en el perfil de la persona (máx. 600 KB por el límite del navegador) */
  const MAXCV=600*1024;
  function readCV(file){
    return new Promise(res=>{
      if(file.size>MAXCV)return res({error:"El CV pesa más de 600 KB. Subí una versión más liviana."});
      const r=new FileReader();
      r.onload=()=>res({cv:{name:file.name,data:r.result}});
      r.onerror=()=>res({error:"No se pudo leer el archivo."});
      r.readAsDataURL(file);
    });
  }
  const cvDe=personaId=>(users().find(x=>x.id==personaId)||{}).cv||null;

  /* ---------- ofertas de trabajo ---------- */
  const API_OFERTAS_URL = "http://localhost:8080/api/ofertas";
  const ofertas = () => rd(K.o, []);

  async function ofertasAbiertas() {
    try {
      const res = await fetch(API_OFERTAS_URL);
      if (!res.ok) return [];
      const lista = await res.json();

      return lista.map(o => ({
        id: o.id,
        empresaId: o.empresaId,
        puesto: o.titulo,
        empresa: "Minera Los Bronces",
        cat: o.modalidad || "Operaciones",
        mineral: "Cobre",
        ubicacion: "Cordillera, San Juan",
        regimen: "7x7",
        renta: o.salario ? `USD ${o.salario}` : "A convenir",
        altura: "3.800 msnm",
        alojamiento: "Campamento minero",
        urgente: 1,
        estado: "abierta",
        descripcion: o.descripcion
      }));
    } catch (err) {
      console.error("Error al cargar ofertas desde el backend:", err);
      return [];
    }
  }

  async function ofertaPorId(id) {
    try {
      const res = await fetch(`${API_OFERTAS_URL}/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  const ofertasDe = empresaId => ofertas().filter(o => o.empresaId == empresaId).sort((a, b) => b.creada - a.creada);

  async function publish(empresa, d) {
    try {
      const res = await fetch(API_OFERTAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresaId: empresa.id,
          titulo: d.puesto || d.titulo,
          descripcion: d.descripcion || "Sin descripción",
          modalidad: d.cat || d.modalidad || "Presencial",
          salario: d.renta ? parseFloat(String(d.renta).replace(/[^0-9.]/g, '')) || null : null
        })
      });
      if (!res.ok) return { error: "No se pudo guardar la oferta en el servidor." };
      const ofertaCreada = await res.json();
      return { oferta: ofertaCreada };
    } catch (err) {
      return { error: "Error al conectar con el servidor." };
    }
  }

  function setOferta(id, patch) { const l = ofertas(), i = l.findIndex(x => x.id == id); if (i >= 0) { l[i] = { ...l[i], ...patch }; wr(K.o, l); } }
  function delOferta(id) { wr(K.o, ofertas().filter(x => x.id != id)); }

  /* mismo formato que las vacantes de data.js:
     [puesto, empresa, categoría, mineral, ubicación, régimen, renta, altura, alojamiento, urgente, id] */
  const toArr = o => [
    o.puesto,
    o.empresa,
    o.cat,
    o.mineral,
    o.ubicacion,
    o.regimen,
    o.renta,
    o.altura,
    o.alojamiento,
    o.urgente ? 1 : 0,
    o.id
  ];

        /* ---------- postulaciones ---------- */
  const API_POSTULACIONES_URL = "http://localhost:8080/api/postulaciones";
  const posts = () => rd(K.p, []);
  const postsDeEmpresa = id => posts().filter(p => p.empresaId == id);

  async function postsDePersona(id) {
    try {
      const res = await fetch(`${API_POSTULACIONES_URL}/candidato/${id}`);
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  }

  async function postular(persona, of, datosFormulario = {}) {
    try {
      // Extraemos el ID numérico de la vacante
      let ofertaIdNum = of.id;
      if (typeof of.id === "string" && of.id.startsWith("seed-")) {
        ofertaIdNum = 1; // Respaldo para vacantes fijas de ejemplo
      }

      const payload = {
        usuarioId: persona.id,
        ofertaId: Number(ofertaIdNum),
        nombreCompleto: datosFormulario.nombre || persona.nombre || "Candidato",
        whatsapp: datosFormulario.whatsapp || persona.whatsapp || "",
        experiencia: datosFormulario.experiencia || persona.experiencia || "",
        examenAltura: datosFormulario.altura || persona.altura || "",
        cvNombre: datosFormulario.cvNombre || "CV_Adjunto.pdf"
      };

      const res = await fetch(API_POSTULACIONES_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        return { error: "No se pudo registrar la postulación en el servidor." };
      }

      const postGuardada = await res.json();
      return { post: postGuardada };
    } catch (err) {
      console.error("Error al postular:", err);
      return { error: "Error de conexión con el backend." };
    }
  }

  function setEstado(id, estado) { const l = posts(), i = l.findIndex(x => x.id == id); if (i >= 0) { l[i].estado = estado; wr(K.p, l); } }
  function retirar(id, personaId) { wr(K.p, posts().filter(p => !(p.id == id && p.personaId == personaId))); }

  return {
    register, login, me, logout, home, guard, updateProfile, readCV, cvDe,
    ofertasAbiertas, ofertaPorId, ofertasDe, publish, setOferta, delOferta, toArr,
    postsDePersona, postsDeEmpresa, postular, setEstado, retirar
  };

})();
