document.addEventListener('DOMContentLoaded', () => {
    const addForm = document.getElementById('add-form');
    const regresar = document.getElementById('btn-regre')
    

    addForm.addEventListener('submit', async (e) => {
            
        e.preventDefault();
        const formData = new FormData(addForm);
        const requestData = {
            method: 'POST',
            body: formData,//JSON.stringify(Object.fromEntries(formData.entries())),
            //headers: {
            //    'Content-Type': 'application/json'
            //}
        };
        console.log(requestData)

        try {
            const response = await fetch('http://localhost:3000/peliculas', requestData);
            if (response.ok) {
                
                window.location.href = 'tabla.html';
            } else {
                console.error('Error al agregar registro:', response.statusText);
            }
        } catch (error) {
            console.error('Error al agregar registro:', error);
        }
    });
    regresar.addEventListener('click', (e) =>{
        window.location.href = 'tabla.html'
    });
// Cargar datos al cargar la página
    loadData();
});