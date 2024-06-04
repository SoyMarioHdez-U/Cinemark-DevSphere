document.addEventListener('DOMContentLoaded', cargarPeliculas);

async function cargarPeliculas() {
    const res = await fetch('http://localhost:3000/peliculas');
    const peliculas = await res.json();

    const carteleraContainer = document.querySelector('.peliculas');

    peliculas.forEach(pelicula => {
        const peliculaDiv = document.createElement('div');
        peliculaDiv.className = 'pelicula';

        const imagen = document.createElement('img');
        imagen.src = pelicula.imagen;
        imagen.alt = pelicula.nombre;
        imagen.title = pelicula.nombre;
        imagen.style.height = '280px'; // Ajustar altura según el diseño

        const anchor = document.createElement('a');
        anchor.href = `detalle.html?id=${pelicula.id_pelicula}`;
        anchor.appendChild(imagen);

        peliculaDiv.appendChild(anchor);

        carteleraContainer.appendChild(peliculaDiv);
    });

    // Añadir scroll si el contenido excede el tamaño del contenedor
    const peliculaHeight = 280; // Altura de las imágenes
    const numPeliculas = peliculas.length;
    const containerHeight = carteleraContainer.offsetHeight;
    if (numPeliculas * peliculaHeight > containerHeight) {
        carteleraContainer.style.overflowY = 'auto';
    }
}
