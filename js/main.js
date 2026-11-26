const rivalGeneral = "General";
const limiteFuertePersonaje = 70;
const limiteFuerteMatchup = 60;
const limiteMedio = 40;

const listaPersonajes = JSON.parse(localStorage.getItem("personajes")) ?? [
  { nombre: "Ramlethal Valentine", rival: rivalGeneral, victorias: 30, derrotas: 10 },
  { nombre: "I-No", rival: rivalGeneral, victorias: 14, derrotas: 26 },
  { nombre: "Sol Badguy", rival: rivalGeneral, victorias: 29, derrotas: 21 },
  { nombre: "Ky Kiske", rival: rivalGeneral, victorias: 21, derrotas: 29 },
  { nombre: "Potemkin", rival: rivalGeneral, victorias: 33, derrotas: 17 },
];

let listaMatchups = JSON.parse(localStorage.getItem("matchups")) ?? [
  { nombre: "Ramlethal Valentine", rival: "Ky Kiske", victorias: 18, derrotas: 12 },
  { nombre: "Ramlethal Valentine", rival: "Potemkin", victorias: 10, derrotas: 20 },
  { nombre: "Ramlethal Valentine", rival: "I-No", victorias: 15, derrotas: 15 },
  { nombre: "Sol Badguy", rival: "Ky Kiske", victorias: 12, derrotas: 8 },
  { nombre: "Sol Badguy", rival: "Potemkin", victorias: 9, derrotas: 11 },
];

const contenedorItems = document.getElementById("contenedor-items");
const botonAgregar = document.getElementById("boton-agregar");
const inputNombre = document.getElementById("nombre-personaje");
const inputVictorias = document.getElementById("victorias");
const inputDerrotas = document.getElementById("derrotas");
const mensaje = document.getElementById("mensaje");
const buscadorPersonaje = document.getElementById("buscador-personaje");
const selectPersonaje = document.getElementById("select-personaje");
const selectRival = document.getElementById("select-rival");
const mensajeMatchup = document.getElementById("mensaje-matchup");
const botonCrearMatchup = document.getElementById("boton-crear-matchup");
const contenedorMatchups = document.getElementById("contenedor-matchups");
const todosMatchups = document.getElementById("todos-matchups");

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

botonAgregar.addEventListener("click", () => {
  const nombre = inputNombre.value.trim();
  const victorias = parseInt(inputVictorias.value, 10);
  const derrotas = parseInt(inputDerrotas.value, 10);
  const existe = listaPersonajes.some(
    (personaje) => personaje.nombre === nombre,
  );

  if (existe) {
    mensaje.textContent = "Ese personaje ya existe.";
  } else if (
    nombre &&
    !isNaN(victorias) &&
    !isNaN(derrotas) &&
    victorias >= 0 &&
    derrotas >= 0
  ) {
    listaPersonajes.push({
      nombre,
      rival: rivalGeneral,
      victorias,
      derrotas,
    });
    guardarDatos();
    mostrarPersonajes();
    llenarSelects();
    inputNombre.value = "";
    inputVictorias.value = "";
    inputDerrotas.value = "";
    mensaje.textContent = "Personaje agregado.";
  } else {
    mensaje.textContent = "Por favor, complete todos los campos correctamente.";
  }
});
botonCrearMatchup.addEventListener("click", () => {
  const personaje = selectPersonaje.value;
  const rival = selectRival.value;
  const existe = listaMatchups.some(
    (matchup) => matchup.nombre === personaje && matchup.rival === rival,
  );
  if (personaje === "") {
    mensajeMatchup.textContent = "Elegí un personaje para crear el matchup.";
  } else if (personaje === rival) {
    mensajeMatchup.textContent =
      "El personaje y el rival no pueden ser el mismo.";
  } else if (existe) {
    mensajeMatchup.textContent = "Ese matchup ya existe.";
  } else {
    listaMatchups.push({
      nombre: personaje,
      rival,
      victorias: 0,
      derrotas: 0,
    });
    guardarDatos();
    mostrarMatchups();
    mensajeMatchup.textContent = "Matchup creado.";
  }
});

mostrarPersonajes();
llenarSelects();
todosMatchups.checked = JSON.parse(localStorage.getItem("verTodos")) ?? false;
mostrarMatchups();

function mostrarPersonajes(lista = listaPersonajes) {
  contenedorItems.innerHTML = "<h3>Lista de personajes</h3>";
  lista.forEach((personaje) => {
    const winrate = calcularWinrate(personaje);
    const nivel = clasificar(personaje);
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";
    tarjeta.innerHTML = `
        <h3>${personaje.nombre}</h3>
        <p>Winrate: ${winrate}% | V:${personaje.victorias} | D:${personaje.derrotas} | Nivel: ${nivel}</p>
        <button class="eliminar">Eliminar</button>`;
    contenedorItems.appendChild(tarjeta);
  });
  const botonesEliminar = contenedorItems.querySelectorAll(".eliminar");
  botonesEliminar.forEach((boton, indice) => {
    boton.addEventListener("click", () => {
      const { nombre } = lista[indice];
      listaPersonajes.splice(listaPersonajes.indexOf(lista[indice]), 1);
      listaMatchups = listaMatchups.filter(
        (matchup) => matchup.nombre !== nombre && matchup.rival !== nombre,
      );
      guardarDatos();
      mostrarPersonajes(listaFiltrada());
      llenarSelects();
      mostrarMatchups();
      mensaje.textContent = "Personaje eliminado.";
    });
  });
}

function llenarSelects() {
  selectPersonaje.innerHTML = "";
  selectRival.innerHTML = "";
  const optionVacia = document.createElement("option");
  optionVacia.textContent = "Elegí un personaje";
  optionVacia.value = "";
  selectPersonaje.appendChild(optionVacia);
  listaPersonajes.forEach((personaje) => {
    const optionPersonaje = document.createElement("option");
    optionPersonaje.textContent = personaje.nombre;
    optionPersonaje.value = personaje.nombre;
    selectPersonaje.appendChild(optionPersonaje);

    const optionRival = document.createElement("option");
    optionRival.textContent = personaje.nombre;
    optionRival.value = personaje.nombre;
    selectRival.appendChild(optionRival);
  });
}
function mostrarMatchups() {
  const matchups = mostrarMatchupsDe(selectPersonaje.value);
  contenedorMatchups.innerHTML = "";
  if (matchups.length === 0) {
    mensajeMatchup.innerHTML =
      "<span>No hay matchups para este personaje.</span>";
  } else {
    mensajeMatchup.textContent = "";
    matchups.forEach((matchup) => {
      const titulo = tituloDe(matchup);
      const winrate = calcularWinrate(matchup);
      const nivel = clasificar(matchup);
      const tarjeta = document.createElement("div");
      tarjeta.className = "tarjeta";
      tarjeta.innerHTML = `
          <h3>${titulo}</h3>
          <p>Winrate: ${winrate}% | V:${matchup.victorias} | D:${matchup.derrotas} | Nivel: ${nivel}</p>
          <button class="ganar">Ganó</button>
          <button class="perder">Perdió</button>`;
      contenedorMatchups.appendChild(tarjeta);
    });
    const botonesGanar = contenedorMatchups.querySelectorAll(".ganar");
    botonesGanar.forEach((boton, indice) => {
      boton.addEventListener("click", () => {
        registrarResultado(matchups[indice], true);
        guardarDatos();
        mostrarMatchups();
      });
    });
    const botonesPerder = contenedorMatchups.querySelectorAll(".perder");
    botonesPerder.forEach((boton, indice) => {
      boton.addEventListener("click", () => {
        registrarResultado(matchups[indice], false);
        guardarDatos();
        mostrarMatchups();
      });
    });
  }
}

function registrarResultado(registro, gano) {
  if (gano) {
    registro.victorias++;
  } else {
    registro.derrotas++;
  }
}

function guardarDatos() {
  localStorage.setItem("personajes", JSON.stringify(listaPersonajes));
  localStorage.setItem("matchups", JSON.stringify(listaMatchups));
}

function mostrarMatchupsDe(personaje) {
  return todosMatchups.checked
    ? listaMatchups
    : listaMatchups.filter((matchup) => matchup.nombre === personaje);
}

//Cálculos y textos (sirven para personajes y matchups)

function calcularWinrate({ victorias, derrotas }) {
  const total = victorias + derrotas;
  let winrate = 0;
  if (total > 0) {
    winrate = Math.round((victorias / total) * 1000) / 10;
  }
  return winrate;
}

function clasificar(registro) {
  const winrate = calcularWinrate(registro);
  const limiteFuerte =
    registro.rival === rivalGeneral ? limiteFuertePersonaje : limiteFuerteMatchup;

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

