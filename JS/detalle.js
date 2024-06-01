document.addEventListener('DOMContentLoaded', cargarDetalle);

async function cargarDetalle() {
    const urlParams = new URLSearchParams(window.location.search);
    const idPelicula = urlParams.get('id');

    const res = await fetch(`http://localhost:3000/peliculas/${idPelicula}`);
    const pelicula = await res.json();

    const titulo = document.getElementById('titulo');
    titulo.textContent = pelicula[0].nombre;

    const imagen = document.getElementById('imagen');
    imagen.src = pelicula[0].imagen;
    imagen.alt = pelicula[0].nombre;

    const descripcion = document.getElementById('descripcion');
    descripcion.textContent = pelicula[0].descripcion;

    const director = document.getElementById('director');
    director.textContent = `${pelicula[0].director}`;

    const idioma = document.getElementById('idioma');
    idioma.textContent = `${pelicula[0].id_idioma === 1 ? 'Español' : 'Inglés'}`;

    const duracion = document.getElementById('duracion');
    duracion.textContent = `${pelicula[0].duracion} mins.`;

    const videoContainer = document.getElementById('video');
    videoContainer.innerHTML = pelicula[0].video;
}
