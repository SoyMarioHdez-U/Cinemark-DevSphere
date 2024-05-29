document.addEventListener('DOMContentLoaded', cargarFunciones);

async function cargarFunciones() {
    
    function generarFechas(diasAdelante) {

        
        const selectFechas = document.getElementById('fechas');
        const hoy = new Date();

        if (selectFechas.options.length >= 10) {
            return;
        }
        
        for (let i = 0; i < diasAdelante; i++) {
            const fecha = new Date(hoy);
            fecha.setDate(hoy.getDate() + i);

            const value = fecha.toISOString().split('T')[0];
            const text = fecha.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });

            const option = new Option(text, value);
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
        const funcionDiv = document.createElement('div');
        funcionDiv.className = 'funcion';

        const tituloDiv = document.createElement('div');
        tituloDiv.className = 'titulo';
        const titulo = document.createElement('h2');
        titulo.textContent = funcion.pelicula;
        const popUpButton = document.createElement('button');
        popUpButton.textContent = 'Ver Trailer';
        popUpButton.onclick = () => mostrarPopup(funcion.video);

        // Agregamos la imagen de la película
        const imagen = document.createElement('img');
        imagen.alt = funcion.pelicula;
        imagen.src = funcion.imagen;
        imagen.width = 150;
        


        const horasDiv = document.createElement('div');
        horasDiv.className = 'horas';

        // Generamos botones de hora para cada función
        const funciones = funcion.funciones.split(',');
        funciones.forEach(horas => {
            const [horaInicio, id_funcion] = horas.split(' ');
            const horaButton = document.createElement('button');
            horaButton.textContent = horaInicio;
            horaButton.onclick = () => {
                window.location.href = `reserva.html?id_funcion=${id_funcion}`;
            };
            horasDiv.appendChild(horaButton);
        });

        tituloDiv.appendChild(titulo);
        tituloDiv.appendChild(popUpButton);
        funcionDiv.appendChild(tituloDiv);
        funcionDiv.appendChild(imagen);
        funcionDiv.appendChild(horasDiv);
        container.appendChild(funcionDiv);
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

// Agregar event listeners para cambios en los filtros
const radios = document.querySelectorAll('input[name="idioma"]');
radios.forEach(radio => {
    radio.addEventListener('change', cargarFunciones);
});

const selectFecha = document.getElementById('fechas');
selectFecha.addEventListener('change', cargarFunciones);
