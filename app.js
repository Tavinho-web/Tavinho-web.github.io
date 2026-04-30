// Seleccionamos los elementos principales
const form = document.getElementById('registroForm');
const listaRestaurantes = document.getElementById('listaRestaurantes');
const btnSubmit = form.querySelector('button[type="submit"]');

// Sliders y sus textos
const inputTavo = document.getElementById('califTavo');
const spanTavo = document.getElementById('valTavo');
const inputTaly = document.getElementById('califTaly');
const spanTaly = document.getElementById('valTaly');

// Base de datos local (con tus restaurantes precargados si no hay nada guardado)
let restaurantes = JSON.parse(localStorage.getItem('misRestaurantes')) || [
    { nombre: "Mimi", califTavo: 7.5, califTaly: 8.5, comentarios: "" },
    { nombre: "Mc", califTavo: 7.0, califTaly: 8.4, comentarios: "" },
    { nombre: "Búho", califTavo: 9.0, califTaly: 9.5, comentarios: "" },
    { nombre: "Fiordi", califTavo: 7.4, califTaly: 7.7, comentarios: "" },
    { nombre: "Storia", califTavo: 9.91, califTaly: 10.0, comentarios: "" },
    { nombre: "Mediterráneo", califTavo: 9.1, califTaly: 8.7, comentarios: "" },
    { nombre: "Hikani, sushi máster", califTavo: 6.9, califTaly: 8.8, comentarios: "" },
    { nombre: "Brasas Steak", califTavo: 8.9, califTaly: 9.0, comentarios: "" },
    { nombre: "Marruata", califTavo: 8.95, califTaly: 9.4, comentarios: "" },
    { nombre: "Raval", califTavo: 9.0, califTaly: 9.0, comentarios: "" },
    { nombre: "Monster Jey festival del perro", califTavo: 3.0, califTaly: 4.0, comentarios: "Tavo: Qle fila, pasamos Laurazo y no valió la pena. | Taly: no me gustó el aspecto de ese perro" },
    { nombre: "El tigre", califTavo: 9.2, califTaly: 9.7, comentarios: "" },
    { nombre: "Alitas bbq", califTavo: 7.2, califTaly: 7.9, comentarios: "Taly: volvería pero el espacio no me agradó tanto" },
    { nombre: "King kong, puerto Colombia", califTavo: 8.6, califTaly: 8.7, comentarios: "" },
    { nombre: "Nancy Cabrera (postres)" , califTavo: 7.0, califTaly: 9.0, comentarios: "" },
    { nombre: "Mokaná", califTavo: 9.4, califTaly: 9.6, comentarios: "" }
];

// Variable clave: nos dirá si estamos editando una reseña existente (-1 significa que es nueva)
let editIndex = -1; 

// Actualizar textos de los sliders en tiempo real
inputTavo.addEventListener('input', (e) => spanTavo.textContent = parseFloat(e.target.value).toFixed(1));
inputTaly.addEventListener('input', (e) => spanTaly.textContent = parseFloat(e.target.value).toFixed(1));

// ====== FUNCIÓN PARA MOSTRAR LAS TARJETAS ======
function renderizarRestaurantes() {
    listaRestaurantes.innerHTML = ''; 
    
    restaurantes.forEach((restaurante, index) => {
        const li = document.createElement('li');
        
        li.style.background = "rgba(255,255,255,0.06)";
        li.style.border = "1px solid rgba(255,255,255,0.1)";
        li.style.borderRadius = "18px";
        li.style.padding = "20px";
        li.style.marginBottom = "15px";
        li.style.listStyle = "none";
        li.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";

        const promedio = ((restaurante.califTavo + restaurante.califTaly) / 2).toFixed(1);

        const htmlComentarios = restaurante.comentarios 
            ? `<p style="margin: 0 0 15px 0; font-size: 14.5px; color: rgba(255,255,255,0.8); line-height: 1.5;">${restaurante.comentarios}</p>` 
            : '';

        // Aquí cambiamos el onclick por data-action y data-index
        li.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <h3 style="margin: 0; font-size: 20px; color: white; font-weight: 800; letter-spacing: 0.5px;">${restaurante.nombre}</h3>
                
                <div style="display: flex; gap: 8px;">
                    <button type="button" data-action="editar" data-index="${index}" style="background: rgba(255,255,255,0.1); border: none; padding: 6px; border-radius: 8px; cursor: pointer; transition: 0.2s;" title="Editar">✏️</button>
                    <button type="button" data-action="eliminar" data-index="${index}" style="background: rgba(255,255,255,0.1); border: none; padding: 6px; border-radius: 8px; cursor: pointer; transition: 0.2s;" title="Borrar">🗑️</button>
                </div>
            </div>
            
            ${htmlComentarios}
            
            <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px;">
                <span style="display: inline-flex; align-items: center; gap: 4px; background: rgba(34, 211, 238, 0.15); border: 1px solid rgba(34, 211, 238, 0.3); padding: 6px 12px; border-radius: 999px; font-size: 13px; font-weight: 700; color: #22d3ee; box-shadow: 0 4px 10px rgba(34, 211, 238, 0.1);">
                    👦🏻 Tavo: ${restaurante.califTavo}
                </span>
                <span style="display: inline-flex; align-items: center; gap: 4px; background: rgba(255, 79, 216, 0.15); border: 1px solid rgba(255, 79, 216, 0.3); padding: 6px 12px; border-radius: 999px; font-size: 13px; font-weight: 700; color: #ff4fd8; box-shadow: 0 4px 10px rgba(255, 79, 216, 0.1);">
                    👧🏻 Taly: ${restaurante.califTaly}
                </span>
                <span style="display: inline-flex; align-items: center; gap: 4px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); padding: 6px 12px; border-radius: 999px; font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.85);">
                    ⭐ Promedio: ${promedio}
                </span>
            </div>
        `;
        listaRestaurantes.appendChild(li);
    });
}

// ====== DELEGACIÓN DE EVENTOS (LA SOLUCIÓN A LOS BOTONES) ======
// Escuchamos los clics en toda la lista, y verificamos si tocaron un botón
listaRestaurantes.addEventListener('click', function(e) {
    const boton = e.target.closest('button'); // Buscamos si el clic fue en un botón
    if (!boton) return; // Si no fue en un botón, no hacemos nada

    const accion = boton.getAttribute('data-action');
    const index = parseInt(boton.getAttribute('data-index'), 10);

    if (accion === 'eliminar') {
        eliminarResena(index);
    } else if (accion === 'editar') {
        editarResena(index);
    }
});

// ====== FUNCIONES SEPARADAS ======
function eliminarResena(index) {
    if(confirm("¿Seguros que quieren borrar esta reseña?")) {
        restaurantes.splice(index, 1);
        localStorage.setItem('misRestaurantes', JSON.stringify(restaurantes));
        renderizarRestaurantes();
    }
}

function editarResena(index) {
    const resena = restaurantes[index];
    
    document.getElementById('nombreRestaurante').value = resena.nombre;
    document.getElementById('comentarios').value = resena.comentarios;
    
    inputTavo.value = resena.califTavo;
    spanTavo.textContent = resena.califTavo;
    
    inputTaly.value = resena.califTaly;
    spanTaly.textContent = resena.califTaly;
    
    editIndex = index;
    
    btnSubmit.textContent = "Actualizar reseña ✨";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ====== AL ENVIAR EL FORMULARIO ======
form.addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    const datosResena = {
        nombre: document.getElementById('nombreRestaurante').value,
        califTavo: parseFloat(inputTavo.value),
        califTaly: parseFloat(inputTaly.value),
        comentarios: document.getElementById('comentarios').value
    };
    
    if (editIndex > -1) {
        restaurantes[editIndex] = datosResena;
        editIndex = -1; 
        btnSubmit.textContent = "Agregar reseña"; 
    } else {
        restaurantes.push(datosResena);
    }
    
    localStorage.setItem('misRestaurantes', JSON.stringify(restaurantes));
    form.reset();
    
    spanTavo.textContent = "5.0";
    spanTaly.textContent = "5.0";
    inputTavo.value = 5;
    inputTaly.value = 5;
    
    renderizarRestaurantes();
});

// Forzamos el guardado de los iniciales
if (!localStorage.getItem('misRestaurantes')) {
    localStorage.setItem('misRestaurantes', JSON.stringify(restaurantes));
}

// Arrancamos la app
renderizarRestaurantes();
