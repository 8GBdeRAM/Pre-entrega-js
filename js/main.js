// Una sola clase sirve para personajes (rival "General") y para matchups (rival concreto)
class Registro {
  constructor(nombre, rival, victorias, derrotas) {
    this.nombre = nombre;
    this.rival = rival;
    this.victorias = victorias;
    this.derrotas = derrotas;
  }
  registrarResultado(gano) {
    if (gano) {
      this.victorias++;
    } else {
      this.derrotas++;
    }
  }
}

const rivalGeneral = "General";
const limiteFuertePersonaje = 70;
const limiteFuerteMatchup = 60;
const limiteMedio = 40;

const listaPersonajes = [
  new Registro("Ramlethal Valentine", rivalGeneral, 30, 10),
  new Registro("I-No", rivalGeneral, 14, 26),
  new Registro("Sol Badguy", rivalGeneral, 29, 21),
  new Registro("Ky Kiske", rivalGeneral, 21, 29),
  new Registro("Potemkin", rivalGeneral, 33, 17),
];

let listaMatchups = [
  new Registro("Ramlethal Valentine", "Ky Kiske", 18, 12),
  new Registro("Ramlethal Valentine", "Potemkin", 10, 20),
  new Registro("Ramlethal Valentine", "I-No", 15, 15),
  new Registro("Sol Badguy", "Ky Kiske", 12, 8),
  new Registro("Sol Badguy", "Potemkin", 9, 11),
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
    listaPersonajes.push(
      new Registro(nombre, rivalGeneral, victorias, derrotas),
    );
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
  if (personaje === rival) {
    mensajeMatchup.textContent =
      "El personaje y el rival no pueden ser el mismo.";
  } else if (existe) {
    mensajeMatchup.textContent = "Ese matchup ya existe.";
  } else {
    listaMatchups.push(new Registro(personaje, rival, 0, 0));
    mostrarMatchups();
    mensajeMatchup.textContent = "Matchup creado.";
  }
});

mostrarPersonajes();
llenarSelects();
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
      listaPersonajes.splice(listaPersonajes.indexOf(lista[indice]), 1);
      mostrarPersonajes(listaFiltrada());
      llenarSelects();
      mensaje.textContent = "Personaje eliminado.";
    });
  });
}

function llenarSelects() {
  selectPersonaje.innerHTML = "";
  selectRival.innerHTML = "";
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
  const matchups = matchupsDe(selectPersonaje.value);
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
        matchups[indice].registrarResultado(true);
        mostrarMatchups();
      });
    });
    const botonesPerder = contenedorMatchups.querySelectorAll(".perder");
    botonesPerder.forEach((boton, indice) => {
      boton.addEventListener("click", () => {
        matchups[indice].registrarResultado(false);
        mostrarMatchups();
      });
    });
  }
}

//Cálculos y textos (sirven para personajes y matchups)

function calcularWinrate(registro) {
  const total = registro.victorias + registro.derrotas;
  let winrate = 0;
  if (total > 0) {
    winrate = Math.round((registro.victorias / total) * 1000) / 10;
  }
  return winrate;
}

function clasificar(registro) {
  const winrate = calcularWinrate(registro);
  let limiteFuerte = limiteFuerteMatchup;
  if (registro.rival === rivalGeneral) {
    limiteFuerte = limiteFuertePersonaje;
  }

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

function matchupsDe(nombre) {
  return listaMatchups.filter(
    (matchup) => matchup.nombre.toLowerCase() === nombre.toLowerCase(),
  );
}
