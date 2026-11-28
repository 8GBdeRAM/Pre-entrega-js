let listaPersonajes = [];
const mensajeCarga = document.getElementById("mensaje-carga");

const rivalGeneral = "General";
const limiteFuertePersonaje = 70;
const limiteFuerteMatchup = 60;
const limiteMedio = 40;
let ventajas = {};
let matchupsCalculados = [];
let consejosMatchups = {};
const textoSinConsejo = "Todavía no hay consejo para este matchup.";

const contenedorItems = document.getElementById("contenedor-items");
const buscadorPersonaje = document.getElementById("buscador-personaje");
const selectPersonaje = document.getElementById("select-personaje");
const mensajeMatchup = document.getElementById("mensaje-matchup");
const contenedorMatchups = document.getElementById("contenedor-matchups");
const todosMatchups = document.getElementById("todos-matchups");
const contenedorFiltrosTipos = document.getElementById("filtros-tipos");
const botonConsejo = document.getElementById("boton-consejo");
const contenedorConsejos = document.getElementById("contenedor-consejos");
const selectConsejoPersonaje = document.getElementById(
  "select-consejo-personaje",
);
const selectConsejoRival = document.getElementById("select-consejo-rival");
const inputBuscarConsejo = document.getElementById("buscar-consejo");

const URL = "./data/datos.json";

//creo el toast en una función para no estar repitiendo el código cada vez que quiero mostrar un mensaje
function mostrarToast(texto, tipo = "info", duracion = 3000) {
  const claseToast = `toast-${tipo}`;
  Toastify({
    text: texto,
    duration: duracion,
    close: true,
    gravity: "top",
    position: "right",
    className: claseToast,
  }).showToast();
}

async function cargarDatos() {
  mensajeCarga.textContent = "Cargando personajes...";
  try {
    const respuesta = await fetch(URL);
    const datos = await respuesta.json();
    listaPersonajes = datos.personajes;
    ventajas = datos.ventajas;
    consejosMatchups = datos.consejos;
    llenarFiltrosTipos();
    matchupsCalculados = calcularMatchups();
    mostrarPersonajes();
    llenarSelects();
    mostrarMatchups();
    mostrarToast("Datos cargados correctamente", "exito", 2000);
  } catch (error) {
    const textoError = "Error al cargar los datos";
    mostrarToast(textoError, "error");
  } finally {
    mensajeCarga.textContent = "";
  }
}

cargarDatos();

function listaFiltrada() {
  const filtro = buscadorPersonaje.value.trim().toLowerCase();
  return listaPersonajes.filter((personaje) =>
    personaje.nombre.toLowerCase().includes(filtro),
  );
}

buscadorPersonaje.addEventListener("keyup", () => {
  mostrarPersonajes(listaFiltrada());
});

selectPersonaje.addEventListener("change", () => {
  mostrarMatchups();
});

todosMatchups.addEventListener("change", () => {
  localStorage.setItem("verTodos", JSON.stringify(todosMatchups.checked));
  mostrarMatchups();
});

llenarSelects();
todosMatchups.checked = JSON.parse(localStorage.getItem("verTodos")) ?? false;
mostrarMatchups();

function mostrarPersonajes(lista = listaPersonajes) {
  contenedorItems.textContent = "";
  lista.forEach((personaje) => {
    const winrate = calcularWinrate(personaje);
    const nivel = clasificar(personaje);
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";
    const titulo = document.createElement("h3");
    titulo.textContent = personaje.nombre;
    const datos = document.createElement("p");
    datos.textContent = `Winrate: ${winrate}% | V:${personaje.victorias} | D:${personaje.derrotas} | Nivel: ${nivel}`;
    tarjeta.append(titulo, datos);
    contenedorItems.append(tarjeta);
  });
}

function llenarSelects() {
  selectPersonaje.textContent = "";
  selectPersonaje.insertAdjacentHTML(
    "beforeend",
    `<option value="">Elegí un personaje</option>`,
  );
  listaPersonajes.forEach((personaje) => {
    const opcion = `<option value="${personaje.nombre}">${personaje.nombre}</option>`;
    selectPersonaje.insertAdjacentHTML("beforeend", opcion);
  });
  llenarSelectsConsejo();
}

function llenarSelectsConsejo() {
  selectConsejoPersonaje.textContent = "";
  selectConsejoRival.textContent = "";
  selectConsejoPersonaje.insertAdjacentHTML(
    "beforeend",
    `<option value="">Elegí un personaje</option>`,
  );
  selectConsejoRival.insertAdjacentHTML(
    "beforeend",
    `<option value="">General</option>`,
  );
  listaPersonajes.forEach((personaje) => {
    const opcion = `<option value="${personaje.nombre}">${personaje.nombre}</option>`;
    selectConsejoPersonaje.insertAdjacentHTML("beforeend", opcion);
    selectConsejoRival.insertAdjacentHTML("beforeend", opcion);
  });
}
function mostrarMatchups() {
  const matchups = mostrarMatchupsDe(selectPersonaje.value);
  contenedorMatchups.textContent = "";
  if (matchups.length === 0) {
    mensajeMatchup.textContent = "No hay matchups para este personaje.";
  } else {
    mensajeMatchup.textContent = "";
    matchups.forEach((matchup) => {
      const titulo = tituloDe(matchup);
      contenedorMatchups.insertAdjacentHTML(
        "beforeend",
        `<div class="tarjeta tarjeta-matchup">
          <h3>${titulo}</h3>
          <p>Winrate: ${matchup.winrateBase}%</p>
        </div>`,
      );
    });
    const tarjetasMatchups =
      contenedorMatchups.querySelectorAll(".tarjeta-matchup");
    tarjetasMatchups.forEach((tarjeta, indice) => {
      tarjeta.addEventListener("click", () => {
        mostrarConsejoMatchup(matchups[indice]);
      });
    });
  }
}
const listaConsejo = JSON.parse(localStorage.getItem("consejos")) ?? [];

botonConsejo.addEventListener("click", async () => {
  const personaje = selectConsejoPersonaje.value;
  const rival = selectConsejoRival.value;
  if (personaje === "") {
    mostrarToast("Elegí un personaje para el consejo.", "error");
    return;
  }
  const resultado = await Swal.fire({
    title: `Consejo para ${personaje}`,
    input: "text",
    inputPlaceholder: "Escribe tu consejo aquí",
    showCancelButton: true,
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
    customClass: {
      popup: "swal-popup",
      confirmButton: "swal-confirm",
    },
  });
  const consejo = resultado.value && resultado.value.trim();
  if (resultado.isConfirmed && consejo) {
    listaConsejo.push({
      nombre: personaje,
      rival: rival || rivalGeneral,
      texto: consejo,
    });
    guardarConsejos();
    mostrarConsejos(listaConsejo);
    mostrarToast("Consejo guardado.", "exito");
  }
});

function mostrarConsejos(lista) {
  contenedorConsejos.textContent = "";
  lista.forEach((consejo) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";
    const titulo = document.createElement("h3");
    titulo.textContent = tituloDe(consejo);
    const texto = document.createElement("p");
    texto.textContent = consejo.texto;
    tarjeta.append(titulo, texto);
    contenedorConsejos.append(tarjeta);
  });
}

inputBuscarConsejo.addEventListener("input", () => {
  const termino = inputBuscarConsejo.value.trim().toLowerCase();
  const filtrados = listaConsejo.filter((consejo) => {
    const titulo = tituloDe(consejo).toLowerCase();
    return (
      titulo.includes(termino) || consejo.texto.toLowerCase().includes(termino)
    );
  });
  mostrarConsejos(filtrados);
});

function guardarConsejos() {
  localStorage.setItem("consejos", JSON.stringify(listaConsejo));
}

function mostrarMatchupsDe(personaje) {
  const base = todosMatchups.checked
    ? matchupsCalculados
    : matchupsCalculados.filter((matchup) => matchup.nombre === personaje);
  const tiposElegidos = tiposSeleccionados();
  return tiposElegidos.length === 0
    ? base
    : base.filter((matchup) => tiposElegidos.includes(matchup.tipoRival));
}

function llenarFiltrosTipos() {
  contenedorFiltrosTipos.textContent = "";
  Object.keys(ventajas).forEach((tipo) => {
    const casilla = `<label><input type="checkbox" class="filtro-tipo" value="${tipo}" /> ${tipo}</label>`;
    contenedorFiltrosTipos.insertAdjacentHTML("beforeend", casilla);
  });
  const casillas = contenedorFiltrosTipos.querySelectorAll(".filtro-tipo");
  casillas.forEach((casilla) => {
    casilla.addEventListener("change", mostrarMatchups);
  });
}

function tiposSeleccionados() {
  const casillasMarcadas = contenedorFiltrosTipos.querySelectorAll(
    ".filtro-tipo:checked",
  );
  return Array.from(casillasMarcadas).map((casilla) => casilla.value);
}

function mostrarConsejoMatchup(matchup) {
  const contenido = document.createElement("div");
  const consejoBase = document.createElement("p");
  consejoBase.textContent =
    consejosMatchups[matchup.tipoAtacante]?.[matchup.tipoRival] ??
    textoSinConsejo;
  contenido.append(consejoBase);
  listaConsejo
    .filter(
      (consejo) =>
        consejo.nombre === matchup.nombre && consejo.rival === matchup.rival,
    )
    .forEach((consejo) => {
      const parrafo = document.createElement("p");
      const etiqueta = document.createElement("strong");
      etiqueta.textContent = "Tu consejo: ";
      parrafo.append(etiqueta, consejo.texto);
      contenido.append(parrafo);
    });
  Swal.fire({
    title: tituloDe(matchup),
    html: contenido,
    customClass: {
      popup: "swal-popup",
      confirmButton: "swal-confirm",
    },
  });
}
mostrarConsejos(listaConsejo);

//Cálculos y textos (sirven para personajes y matchups)

function calcularWinrate({ victorias, derrotas }) {
  const total = victorias + derrotas;
  let winrate = 0;
  if (total > 0) {
    winrate = Math.round((victorias / total) * 1000) / 10;
  }
  return winrate;
}
function calcularMatchups() {
  const resultado = [];
  listaPersonajes.forEach((personajeA) => {
    listaPersonajes.forEach((personajeB) => {
      if (personajeA.nombre === personajeB.nombre) return;
      const bonus = ventajas[personajeA.tipo][personajeB.tipo];
      resultado.push({
        nombre: personajeA.nombre,
        rival: personajeB.nombre,
        tipoAtacante: personajeA.tipo,
        tipoRival: personajeB.tipo,
        winrateBase: 50 + bonus / 2,
      });
    });
  });
  return resultado;
}

function clasificar(registro) {
  const winrate = calcularWinrate(registro);
  const limiteFuerte =
    registro.rival === rivalGeneral
      ? limiteFuertePersonaje
      : limiteFuerteMatchup;

  let nivel = "Debil";
  if (registro.victorias + registro.derrotas === 0) {
    nivel = "Sin partidas";
  } else if (winrate >= limiteFuerte) {
    nivel = "Fuerte";
  } else if (winrate >= limiteMedio) {
    nivel = "Medio";
  }
  return nivel;
}

function tituloDe(registro) {
  if (registro.rival === rivalGeneral) {
    return registro.nombre;
  }
  return registro.nombre + " vs " + registro.rival;
}
function mostrarAvisoPersonaje(personaje) {
  const textoAviso = `Hoy estudia los MU de ${personaje}`;
  mostrarToast(textoAviso, "exito", 5000);
}
const personajesGuilty = [
  "Ramlethal Valentine",
  "I-No",
  "Sol Badguy",
  "Ky Kiske",
  "Potemkin",
  "May",
  "Axl Low",
  "Chipp Zanuff",
  "Faust",
  "Millia Rage",
  "Zato-1",
  "Leo Whitefang",
  "Nagoriyuki",
  "Giovanna",
  "Anji Mito",
  "Goldlewis Dickinson",
  "Jack-O' Valentine",
  "Happy Chaos",
  "Baiken",
  "Testament",
  "Bridget",
  "Sin Kiske",
  "Bedman?",
  "Asuka R. Kreutz",
  "Johnny",
  "Elphelt Valentine",
  "A.B.A",
  "Slayer",
  "Queen Dizzy",
  "Venom",
  "Unika",
  "Lucy",
  "Jam Kuradoberi",
  "Robo-Ky",
];

setTimeout(() => {
  const indice = Math.floor(Math.random() * personajesGuilty.length);
  const personajeAzar = personajesGuilty[indice];
  mostrarAvisoPersonaje(personajeAzar);
}, 2000);
