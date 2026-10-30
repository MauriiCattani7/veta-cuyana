/* Vacantes: [puesto, empresa, categoría, mineral, ubicación, régimen, renta, altura, alojamiento, urgente] */
const J=[
["Operador de camión CAEX 797F","Minera Los Bronces","operacion","Cobre","Antofagasta, Chile","14x14","USD 2.800–3.500","3.800 msnm","Campamento y vuelo",1],
["Ingeniero de planificación y sondaje","Lithium Puna Corp","geologia","Litio","Salar del Hombre Muerto, Salta","7x7","USD 3.200–4.200","4.000 msnm","Campamento Los Andes",0],
["Técnico mecánico de palas eléctricas","Servicios Mineros Komatsu & Joy","mantenimiento","Cobre","Copiapó, Atacama","14x14","USD 2.600–3.100","2.900 msnm","Hotelería y comidas",1],
["Supervisor de seguridad y ambiente","Veladero Gold Project","seguridad","Oro","Cordillera, San Juan","8x6","USD 3.000–3.800","4.200 msnm","Campamento cordillera",0],
["Geólogo de producción y control de leyes","Cerro Verde","geologia","Cobre","Arequipa, Perú","4x3","USD 3.400–4.500","2.700 msnm","Traslado diario",0],
["Operador de planta concentradora","Sonora Copper Works","operacion","Cobre","Cananea, Sonora","7x7","USD 2.200–2.900","1.600 msnm","Alojamiento en faena",1],
["Operador de pala hidráulica","Minera Altiplano","operacion","Oro","Iglesia, San Juan","14x14","USD 2.700–3.300","3.900 msnm","Campamento y traslado",0],
["Técnico electromecánico de planta","Salares del Norte","mantenimiento","Litio","Susques, Jujuy","7x7","USD 2.500–3.200","3.700 msnm","Campamento",1],
["Jefe de sondaje diamantino","Andes Drilling","geologia","Oro","Calingasta, San Juan","14x14","USD 3.600–4.800","3.300 msnm","Campamento y comidas",0],
["Prevencionista de riesgos HSEC","Atacama Lithium","seguridad","Litio","Salar de Atacama, Chile","7x7","USD 2.400–3.000","2.500 msnm","Hotelería",0],
["Mecánico de camiones de extracción","Codelco Servicios","mantenimiento","Cobre","Calama, Chile","14x14","USD 2.800–3.400","2.300 msnm","Campamento y vuelo",1],
["Planificador de corto plazo","Cerro Moro Gold","operacion","Oro","Santa Cruz, Argentina","14x14","USD 3.300–4.100","300 msnm","Campamento",0]];

/* Colores por mineral */
const MC={Cobre:"#e07a3f",Litio:"#4cc9e0",Oro:"#f2b134"};

/* Categorías */
const CATS=[["todos","Todas"],["operacion","Operación"],["mantenimiento","Mantenimiento"],["geologia","Geología"],["seguridad","HSEC"]];

/* Slides del hero: [título, texto, color] */
const SL=[
 ["Encuentra tu próximo turno en las mejores <em>operaciones mineras</em>","Ingeniería de minas, equipo pesado, planta concentradora, geología y seguridad HSEC en yacimientos de cobre, litio, oro y plata.","#2a4a5e"],
 ["Litio en la puna, <em>turnos 7x7</em>","Salmueras y plantas a más de 3.500 metros. Examen de altura y campamento incluidos.","#1e5560"],
 ["Cobre y oro en la <em>cordillera</em>","Operadores, mecánicos y supervisores para faenas en Chile, Argentina y Perú.","#5a4326"]];

/* Empresas: [nombre, subtítulo] */
const CO=[["BHP","Minerals"],["Codelco","Chile"],["Barrick","Gold"],["Albemarle","Litio"],["Glencore","Cobre"],["Komatsu","Servicios"],["Cerro Verde","Perú"],["Southern","Copper"],["Rio Tinto","Litio"],["Newmont","Oro"]];
