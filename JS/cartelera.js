document.addEventListener('DOMContentLoaded', cargarFunciones);

async function cargarFunciones() {
    function generarFechas(diasAdelante) {
        const selectFechas = document.getElementById('fechas');
        selectFechas.style.width = '210px';
        const hoy = new Date();

        if (selectFechas.options.length >= 10) {
            return;
        }

        for (let i = -1; i < diasAdelante; i++) {
            const fecha = new Date(hoy);
            fecha.setDate(hoy.getDate() + i);

            const value = fecha.toISOString().split('T')[0];
            

            const option = new Option(value);
            selectFechas.appendChild(option);
        }
    }

    generarFechas(10);

    const idiomaSeleccionado = document.querySelector('input[name="idioma"]:checked').value;
    const fechaSeleccionada = document.getElementById('fechas').value;

    const res = await fetch(`http://localhost:3000/cartelera/${idiomaSeleccionado}/${fechaSeleccionada}`);
    const data = await res.json();

    const container = document.getElementById('funciones-container');
    container.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas funciones

    // Recorremos los datos y generamos la interfaz
    data.forEach(funcion => {
        const peliculaCartelera = document.createElement('div');
        peliculaCartelera.className = 'pelicula_cartelera';
        peliculaCartelera.style.display = 'flex';

        const imagen = document.createElement('img');
        imagen.alt = funcion.pelicula;
        imagen.src = funcion.imagen;
        imagen.style.width = '175px'; // Ajusta según sea necesario

        imagen.addEventListener('click', () => {
            window.location.href = `detalle.html?id=${funcion.id_pelicula}`;
        });

        const infoPeli = document.createElement('div');
        infoPeli.className = 'info_peli';
        infoPeli.style.marginLeft = '20px';

        const titulo = document.createElement('h4');
        titulo.style.fontFamily = "'Montserrat'";
        titulo.style.fontWeight = '600';
        titulo.textContent = funcion.pelicula;

        const duracion = document.createElement('span');
        duracion.className = 'badge badge-dark';
        duracion.textContent = funcion.duracion + ' mins.';

        const trailer = document.createElement('a');
        trailer.href = '#';
        trailer.style.marginLeft = '5px'
        trailer.className = 'badge badge-primary';
        trailer.onclick = (e) => {
            e.preventDefault();
            mostrarPopup(funcion.video);
        };
        const trailerIcon = document.createElement('img');
        trailerIcon.src = 'https://cdn2.iconfinder.com/data/icons/social-media-8/512/youtube.png';
        trailerIcon.style.height = '10px';
        trailerIcon.style.width = '10px';
        trailer.textContent = ' Ver trailer';
        trailer.prepend(trailerIcon);

        const horariosPelicula = document.createElement('div');
        horariosPelicula.className = 'horarios_pelicula';
        horariosPelicula.style.display = 'flex';
        horariosPelicula.style.marginTop = '20px';

        const funciones = funcion.funciones.split(',');
        funciones.forEach(horas => {
            const [horaInicio, id_funcion] = horas.split(' ');
            const horaButton = document.createElement('button');
            horaButton.type = 'button';
            horaButton.className = 'btn btn-primary';
            horaButton.style.marginRight = '10px';
            horaButton.textContent = horaInicio;
            horaButton.onclick = () => {
                window.location.href = `reserva.html?id_funcion=${id_funcion}`;
            };
            horariosPelicula.appendChild(horaButton);
        });

        infoPeli.appendChild(titulo);
        infoPeli.appendChild(duracion);
        infoPeli.appendChild(trailer);
        infoPeli.appendChild(document.createElement('br'));
        infoPeli.appendChild(document.createElement('br'));
        infoPeli.appendChild(horariosPelicula);

        peliculaCartelera.appendChild(imagen);
        peliculaCartelera.appendChild(infoPeli);

        container.appendChild(peliculaCartelera);
        container.appendChild(document.createElement('hr'));

        
    });
}

function mostrarPopup(videoHTML) {
    // Crear el div pop-up
    const popupDiv = document.createElement('div');
    popupDiv.className = 'popup';

    // Agregar el contenido directamente al div pop-up
    popupDiv.innerHTML = videoHTML;

    // Agregar el div pop-up al cuerpo del documento
    document.body.appendChild(popupDiv);

    // Función para cerrar el pop-up
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.onclick = () => popupDiv.remove();
    popupDiv.appendChild(closeButton);
}




const radios = document.querySelectorAll('input[name="idioma"]');
radios.forEach(radio => {
    radio.addEventListener('change', cargarFunciones);
});

const selectFecha = document.getElementById('fechas');
selectFecha.addEventListener('change', cargarFunciones);
