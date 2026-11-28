# Winrates de Guilty Gear

Simulador de winrates de personajes y matchups de Guilty Gear, hecho con HTML, CSS y JavaScript.

## Funcionalidades

- **Datos en JSON:** los personajes, la matriz de ventajas entre tipos y los consejos por matchup están en `data/datos.json`. Se cargan con `fetch` y `async/await`, con `try/catch/finally`.
- **Personajes:** la lista viene de `data/datos.json`. Cada tarjeta muestra winrate, V, D y nivel (Fuerte, Medio, Débil o Sin partidas). Cada personaje tiene un tipo (Balance, Zoning, Rushdown, Shooting, One Shot, Power o Unique).
- **Buscador:** filtra la lista de personajes mientras escribes.
- **Matchups:** elige un personaje y se muestran sus matchups contra todos los demás, con el winrate base calculado a partir de la matriz de ventajas entre tipos. Con la casilla **Todos los Matchups** se muestran todos a la vez. Con las casillas por tipo se filtran los matchups por el tipo del rival.
- **Consejos de matchup:** al hacer click en un matchup se abre un aviso (SweetAlert2) con el consejo preescrito para ese par de tipos y los consejos que escribiste para ese personaje contra ese rival.
- **Consejos:** escribe un consejo para un personaje y, opcionalmente, un rival. Se puede buscar entre los consejos escritos.
- **Persistencia:** solo se guarda en `localStorage` el estado de la casilla **Todos los Matchups** y los consejos escritos, que siguen al recargar la página.
- **Avisos:** los mensajes cortos usan Toastify. Al entrar aparece un aviso con un personaje al azar para estudiar, a los 2 segundos.
- **Diseño:** tema oscuro con acentos rojos y dorados. Personajes y matchups se muestran en dos columnas, centrados, con listas que se desplazan.


## Cómo usarlo

1. Clona o descarga el repositorio.
2. Abre la carpeta con VS Code.
3. Abre `index.html` con la extensión Live Server.

## Objetivo

- Ser una pagina que registre y calcule los matchups de los personajes, con la finalidad de saber el nivel de cada personaje.
