# Winrates de Guilty Gear

Simulador de winrates de personajes y matchups de Guilty Gear, hecho con HTML, CSS y JavaScript.

## Funcionalidades

- **Personajes:** agregar personajes con nombre, victorias y derrotas. Cada tarjeta muestra winrate, V, D y nivel (Fuerte, Medio, Débil o Sin partidas). Se pueden eliminar.
- **Buscador:** filtra la lista de personajes mientras escribes.
- **Matchups:** elige un personaje y un rival para crear un matchup. Cada matchup tiene botones **Ganó** y **Perdió** para sumar partidas. Con la casilla **Ver todos los MU** se muestran todos los matchups a la vez.
- **Persistencia:** los personajes, los matchups y el estado de la casilla se guardan en `localStorage`, así que siguen al recargar la página. Al eliminar un personaje también se eliminan sus matchups.
- **Lista de personajes:** trae 34 personajes de Guilty Gear por defecto, con victorias y derrotas de ejemplo. No los he puesto en una base de datos porque eso va a la Pre-entrega 10
- **Aviso al entrar (temporizador):** a los 2 segundos de abrir la página aparece un aviso con un personaje al azar para estudiar. Se puede cerrar con el botón **Cerrar**.
- **Carga simulada:** al abrir la página se muestra "Cargando personajes..." por un segundo, y al crear un matchup aparece "Guardando..." antes de agregarlo. Ambos usan `setTimeout`.
- **Diseño:** tema oscuro con acentos rojos y dorados. Personajes y matchups se muestran en dos columnas, centrados, con listas que se desplazan.


## Cómo usarlo

1. Clona o descarga el repositorio.
2. Abre la carpeta con VS Code.
3. Abre `index.html` con la extensión Live Server.

## Objetivo

- Ser una pagina que registre y calcule los matchups de los personajes, con la finalidad de saber el nivel de cada personaje.
