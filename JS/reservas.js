const urlParams = new URLSearchParams(window.location.search);
const id_funcion = urlParams.get('id_funcion');
console.log(id_funcion)
const butacaBtn = document.getElementById('butaca-btn');
const reservaBtn = document.getElementById('reserva-btn');

let seleccionadas = [];
let nombreB = [];
let totalEntradas = 0;
let totalPrecio = 0;

butacaBtn.addEventListener('click', elegir)

reservaBtn.addEventListener('click', pago)

function elegir() {
    const adulto = parseInt(document.getElementById('adulto').value);
    const joven = parseInt(document.getElementById('joven').value);
    const adulto_mayor = parseInt(document.getElementById('adulto_mayor').value);
    totalEntradas = adulto + joven + adulto_mayor;

    totalPrecio = (adulto * 5.50) + (joven * 3.50) + (adulto_mayor * 2.50);

    if (totalEntradas > 0) {
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

    butacas.forEach(butaca => {
        const div = document.createElement('div');
        div.className = `butaca ${butaca.estado_butaca.toLowerCase()}`;
        div.textContent = butaca.butaca;
        div.dataset.id = butaca.id_butaca;

        if (butaca.estado_butaca === 'Vacía') {
            div.onclick = () => toggleButaca(div);
        }

        container.appendChild(div);
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
            <p>Butacas seleccionadas: ${nombreB.join(', ')}</p>
            <p>Precio total: $${totalPrecio.toFixed(2)}</p>
        `;
    } else {
        alert('Debe seleccionar todas las butacas');
    }
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
    window.location.href = 'funciones.html';
};