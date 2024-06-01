const urlParams = new URLSearchParams(window.location.search);
const id_funcion = urlParams.get('id_funcion');

document.getElementById('adulto').addEventListener('input', updateTotal);
document.getElementById('joven').addEventListener('input', updateTotal);
document.getElementById('adulto_mayor').addEventListener('input', updateTotal);

const butacaBtn = document.getElementById('butaca-btn');
const reservaBtn = document.getElementById('reserva-btn');
const informacion = document.getElementById('datos')
const infoDiv = document.getElementById('informacion')
const infoPeliDiv = document.getElementById('info-peli-reserva')

let seleccionadas = [];
let nombreB = [];
let entrada = []
let totalEntradas = 0;
let totalPrecio = 0;

document.addEventListener('DOMContentLoaded', loadDatos);

document.addEventListener('DOMContentLoaded', updateTotal());

butacaBtn.addEventListener('click', elegir)

reservaBtn.addEventListener('click', pago)

async function loadDatos() {

    const res = await fetch(`http://localhost:3000/cartelera/${id_funcion}`)
    const data = await res.json()

    data.forEach(info =>
        {

            console.log("Datos", info)

            const imagen = document.createElement('img');
            imagen.alt = info.pelicula;
            imagen.src = info.imagen;
            imagen.width = 300;
            imagen.style.marginBottom = '20px';


            infoDiv.appendChild(imagen)

        })


        data.forEach(infoPeli =>
            {
    
                console.log("Datos", infoPeli)
    
                const tituloP = document.createElement('p')
                tituloP.textContent = 'Película:'

                const titulo = document.createElement('h6')
                titulo.textContent = infoPeli.pelicula
                titulo.style.marginLeft = '10px';
    

                const fechaP = document.createElement('p')
                fechaP.textContent = 'Fecha:'

                const fecha = document.createElement('h6')
                fecha.textContent = infoPeli.fecha
                fecha.style.marginLeft = '10px';
    

                const horaP = document.createElement('p')
                horaP.textContent = 'Hora:'

                const hora = document.createElement('h6')
                hora.textContent = infoPeli.hora_inicio
                hora.style.marginLeft = '10px';

                const salaP = document.createElement('p')
                salaP.textContent = 'Sala:'
    
                const sala = document.createElement('h6')
                sala.textContent = infoPeli.sala
                sala.style.marginLeft = '10px';
    
                infoPeliDiv.appendChild(tituloP)
                infoPeliDiv.appendChild(titulo)
                infoPeliDiv.appendChild(fechaP)
                infoPeliDiv.appendChild(fecha)
                infoPeliDiv.appendChild(horaP)
                infoPeliDiv.appendChild(hora)
                infoPeliDiv.appendChild(salaP)
                infoPeliDiv.appendChild(sala)
    
            })
    

}

function elegir() {
    const adulto = parseInt(document.getElementById('adulto').value);
    const joven = parseInt(document.getElementById('joven').value);
    const adulto_mayor = parseInt(document.getElementById('adulto_mayor').value);
    totalEntradas = adulto + joven + adulto_mayor;

    if(adulto==0)
        {} else {entrada.push(`Adulto [${adulto}] `)
        }

    if(joven==0)
        {} else { entrada.push(`Joven [${joven}] `)
        }

    if(adulto_mayor==0)
        {} else { entrada.push(`Adulto Mayor [${adulto_mayor}] `)
        }

    totalPrecio = (adulto * 5.50) + (joven * 3.50) + (adulto_mayor * 2.50);

    if (totalEntradas > 0) {

        const precio = document.createElement('h3')
        precio.textContent = entrada.join(' ')
        infoDiv.appendChild(precio)

        document.getElementById('entradas').classList.remove('active');
        document.getElementById('reserva-butaca').classList.add('active');
        cargarButacas();
    } else {
        alert('Debe seleccionar al menos una entrada');
    }
}

async function cargarButacas() {
    const response = await fetch(`http://localhost:3000/Sala/${id_funcion}`);
    const butacas = await response.json();

    const container = document.getElementById('butacas-container');
    container.innerHTML = '';
    
    // Insertando la imagen de la pantalla
    const imagenSala = document.createElement('img');
    imagenSala.className = 'pantalla-sala';
    imagenSala.src = 'https://firebasestorage.googleapis.com/v0/b/practica09-daw.appspot.com/o/Archivos%2FPANTALLA.png?alt=media&token=6d8f8ace-ba2b-4eec-a0c9-d478d5aaa53a';
    container.appendChild(imagenSala);

    // Agrupar las butacas por filas
    const filas = {};
    butacas.forEach(butaca => {
        const fila = butaca.butaca.charAt(0);
        if (!filas[fila]) {
            filas[fila] = [];
        }
        filas[fila].push(butaca);
    });

    // Crear y añadir las filas al contenedor
    Object.keys(filas).sort().forEach(fila => {
        const filaDiv = document.createElement('div');
        filaDiv.className = 'fila';

        filas[fila].forEach(butaca => {
            const div = document.createElement('div');
            div.className = `butaca ${butaca.estado_butaca.toLowerCase()}`;
            div.textContent = butaca.butaca;
            div.dataset.id = butaca.id_butaca;

            if (butaca.estado_butaca === 'Vacía') {
                div.onclick = () => toggleButaca(div);
            }

            filaDiv.appendChild(div);
        });

        container.appendChild(filaDiv);
    });
}


function toggleButaca(div) {
    const id = div.dataset.id;
    if (div.classList.contains('seleccionada')) {
        div.classList.remove('seleccionada');
        seleccionadas = seleccionadas.filter(b => b !== id);
    } else {
        if (seleccionadas.length < totalEntradas) {
            div.classList.add('seleccionada');
            seleccionadas.push(id);
            nombreB.push(div.textContent)
        } else {
            alert('No puede seleccionar más butacas de las que tiene entradas');
        }
    }
}

function pago() {
    if (seleccionadas.length === totalEntradas) {
        document.getElementById('reserva-butaca').classList.remove('active');
        document.getElementById('factura').classList.add('active');

        const resumen = document.getElementById('resumen');
        resumen.innerHTML = `
            <p><b>Butacas seleccionadas:</b><br> ${nombreB.join(', ')}</p>
            <p><b>Precio total:</b><br> $${totalPrecio.toFixed(2)}</p>
        `;
    } else {
        alert('Debe seleccionar todas las butacas');
    }
}

function updateTotal() {
    const adulto = parseInt(document.getElementById('adulto').value) || 0;
    const joven = parseInt(document.getElementById('joven').value) || 0;
    const adulto_mayor = parseInt(document.getElementById('adulto_mayor').value) || 0;

    const totalPrecio = (adulto * 5.50) + (joven * 3.50) + (adulto_mayor * 3.50);
    
    document.getElementById('total-a-pagar').textContent = `$${totalPrecio.toFixed(2)}`;
}

document.getElementById('reserva-form').onsubmit = async function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const telefono = document.getElementById('telefono').value;
    const correo = document.getElementById('correo').value;

    for (const id_butaca of seleccionadas) {

        console.log("id funcion", seleccionadas)
        
        await fetch('http://localhost:3000/reservas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                apellido,
                telefono,
                correo,
                id_funcion,
                id_butaca,
                id_estado: 2 // Estado 2 es "Reservada"
            })
        });
    }

    alert('Reserva realizada con éxito');
    window.location.href = 'cartelera.html';
};