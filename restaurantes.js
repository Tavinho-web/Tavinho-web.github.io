import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBmZh5h4-KhzKKTb_Raj6sFMg23955TCDg",
    authDomain: "rutagastronomica-bceb7.firebaseapp.com",
    projectId: "rutagastronomica-bceb7",
    storageBucket: "rutagastronomica-bceb7.firebasestorage.app",
    messagingSenderId: "110746989006",
    appId: "1:110746989006:web:42a7817c7f3024515a3b9f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const restaurantesRef = collection(db, "restaurantes");

// --- INICIALIZAR MAPA ---
const map = L.map('map').setView([11.0041, -74.8070], 13); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Truco para que el mapa se vea bien si carga en gris
setTimeout(() => { map.invalidateSize(); }, 500);

let marcadoresActuales = [];
let restaurantes = [];

// Elementos del DOM
const form = document.getElementById('registroForm');
const listaRestaurantes = document.getElementById('listaRestaurantes');
const btnSubmit = form.querySelector('button[type="submit"]');
const inputTavo = document.getElementById('califTavo');
const spanTavo = document.getElementById('valTavo');
const inputTaly = document.getElementById('califTaly');
const spanTaly = document.getElementById('valTaly');

let editId = null;

// ACTUALIZAR TEXTO SLIDERS
inputTavo.addEventListener('input', (e) => spanTavo.textContent = parseFloat(e.target.value).toFixed(1));
inputTaly.addEventListener('input', (e) => spanTaly.textContent = parseFloat(e.target.value).toFixed(1));

// --- ESCUCHAR FIREBASE Y PINTAR PINES ---
const q = query(restaurantesRef, orderBy("nombre", "asc"));

onSnapshot(q, (snapshot) => {
    // 1. Limpiar lista y pines viejos
    restaurantes = [];
    listaRestaurantes.innerHTML = '';
    marcadoresActuales.forEach(m => map.removeLayer(m));
    marcadoresActuales = [];

    snapshot.forEach((doc) => {
        const res = { id: doc.id, ...doc.data() };
        restaurantes.push(res);
        
        // 2. Renderizar Tarjeta
        renderizarTarjeta(res);

        // 3. Pintar Pin si tiene coordenadas válidas
        const lat = parseFloat(res.lat);
        const lng = parseFloat(res.lng);

        if (!isNaN(lat) && !isNaN(lng)) {
            const prom = (res.califTavo + res.califTaly) / 2;
            
            // LÓGICA DE SEMÁFORO
            let colorClase = "";
            if (prom >= 9.0) {
                colorClase = "pin-verde";    // Buenos (9.0 - 10)
            } else if (prom >= 7.0) {
                colorClase = "pin-amarillo"; // Medios (7.0 - 8.9)
            } else {
                colorClase = "pin-rojo";     // Malos (0 - 6.9)
            }

            const pin = L.marker([lat, lng], {
                icon: L.icon({
                    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    className: colorClase // Aplicamos la clase según el promedio
                })
            }).addTo(map)
              .bindPopup(`
                <div style="text-align: center;">
                    <b style="color:black; font-size: 14px;">${res.nombre}</b><br>
                    <button onclick="activarCorreccionManual('${res.id}', '${res.nombre.replace(/'/g, "\\'")}')" 
                            style="margin-top: 8px; background: #22d3ee; border: none; padding: 5px 10px; border-radius: 5px; color: white; cursor: pointer; font-size: 11px; font-weight: bold;">
                        📍 Corregir ubicación
                    </button>
                </div>
              `);
            
            marcadoresActuales.push(pin);
        }
    });

    actualizarEstadisticas(restaurantes);
});

// ====== FUNCIÓN PARA PINTAR LAS TARJETAS ======
function renderizarTarjeta(restaurante) {
    const li = document.createElement('li');
    
    // Devolvemos el estilo original que tenías
    li.style.cssText = `
        background: rgba(255,255,255,0.06); 
        border: 1px solid rgba(255,255,255,0.1); 
        border-radius: 18px; 
        padding: 20px; 
        margin-bottom: 15px; 
        list-style: none; 
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    `;

    const promedio = ((restaurante.califTavo + restaurante.califTaly) / 2).toFixed(1);
    
    li.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <h3 style="margin: 0; font-size: 20px; color: white; font-weight: 800;">${restaurante.nombre}</h3>
            <div style="display: flex; gap: 8px;">
                <button type="button" class="btn-editar" data-id="${restaurante.id}" style="background: rgba(255,255,255,0.1); border: none; padding: 6px; border-radius: 8px; cursor: pointer;">✏️</button>
                <button type="button" class="btn-eliminar" data-id="${restaurante.id}" style="background: rgba(255,255,255,0.1); border: none; padding: 6px; border-radius: 8px; cursor: pointer;">🗑️</button>
            </div>
        </div>
        <p style="margin: 0 0 5px 0; font-size: 12px; color: rgba(255,255,255,0.6);">📍 ${restaurante.direccion || 'Sin dirección'}</p>
        <p style="margin: 0 0 15px 0; font-size: 14.5px; color: rgba(255,255,255,0.8);">${restaurante.comentarios || ''}</p>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <span style="color: #22d3ee; font-weight: 700;">👦🏻 Tavo: ${restaurante.califTavo}</span>
            <span style="color: #ff4fd8; font-weight: 700;">👧🏻 Taly: ${restaurante.califTaly}</span>
            <span style="color: rgba(255,255,255,0.6);">⭐ Promedio: ${promedio}</span>
        </div>
    `;
    listaRestaurantes.appendChild(li);
}

// Función global para que el botón del popup la encuentre
window.activarCorreccionManual = function(id, nombre) {
    map.closePopup();

    Swal.fire({
        title: 'Modo Corrección',
        text: `Toca en el mapa el lugar exacto para "${nombre}"`,
        icon: 'info',
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 4000
    });

    document.getElementById('map').style.cursor = 'crosshair';

    map.once('click', async (e) => {
        const { lat, lng } = e.latlng;

        try {
            const docRef = doc(db, "restaurantes", id);
            await updateDoc(docRef, {
                lat: lat,
                lng: lng
            });

            Swal.fire({
                title: '¡Ubicación actualizada!',
                text: 'El pin se ha movido correctamente.',
                icon: 'success',
                timer: 2000
            });
        } catch (error) {
            console.error("Error al corregir ubicación:", error);
            Swal.fire('Error', 'No se pudo actualizar la posición.', 'error');
        } finally {
            document.getElementById('map').style.cursor = '';
        }
    });
};

// --- GUARDAR CON BUSQUEDA AUTOMÁTICA ---
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btnSubmit.disabled = true;
    btnSubmit.textContent = "Ubicando en el mapa... 📍";

    const nombre = document.getElementById('nombreRestaurante').value;
    const direccion = document.getElementById('direccionRestaurante').value;

    const datos = {
        nombre: nombre,
        direccion: direccion,
        califTavo: parseFloat(inputTavo.value),
        califTaly: parseFloat(inputTaly.value),
        comentarios: document.getElementById('comentarios').value,
        lat: null,
        lng: null
    };

    try {
        const respuesta = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`);
        const resultados = await respuesta.json();

        if (resultados.length > 0) {
            datos.lat = parseFloat(resultados[0].lat);
            datos.lng = parseFloat(resultados[0].lon);
            await guardarEnFirebase(datos);
        } else {
            // --- MODO MANUAL ACTIVADO ---
            Swal.fire({
                title: '📍 Ubicación no encontrada',
                text: 'No hallamos la dirección. Por favor, toca en el mapa el lugar exacto del restaurante.',
                icon: 'info',
                confirmButtonColor: '#22d3ee'
            });

            map.once('click', async (event) => {
                const { lat, lng } = event.latlng;
                datos.lat = lat;
                datos.lng = lng;
                
                const tempMarker = L.marker([lat, lng]).addTo(map);
                
                await guardarEnFirebase(datos);
                
                Swal.fire('¡Listo!', 'Ubicación guardada manualmente.', 'success');
                map.removeLayer(tempMarker);
            });
        }
    } catch (error) {
        console.error(error);
        btnSubmit.disabled = false;
        btnSubmit.textContent = "Agregar reseña";
    }
});

// Función auxiliar para no repetir código
async function guardarEnFirebase(datos) {
    if (editId) {
        await updateDoc(doc(db, "restaurantes", editId), datos);
        editId = null;
    } else {
        await addDoc(restaurantesRef, datos);
    }
    form.reset();
    btnSubmit.disabled = false;
    btnSubmit.textContent = "Agregar reseña";
}

// ====== ESCUCHADOR DE CLICS (EDITAR Y ELIMINAR) ======
listaRestaurantes.addEventListener('click', async (e) => {
    // Buscamos si el clic fue en un botón o dentro de un botón
    const btnEditar = e.target.closest('.btn-editar');
    const btnEliminar = e.target.closest('.btn-eliminar');

    if (btnEliminar) {
        const id = btnEliminar.dataset.id;
        if (confirm("¿Seguros que quieren borrar esta reseña?")) {
            await deleteDoc(doc(db, "restaurantes", id));
        }
    }

    if (btnEditar) {
        const id = btnEditar.dataset.id;
        // Buscamos el restaurante en nuestro array local
        const r = restaurantes.find(res => res.id === id);
        if (r) {
            // Llenamos el formulario con los datos
            document.getElementById('nombreRestaurante').value = r.nombre;
            document.getElementById('direccionRestaurante').value = r.direccion || "";
            document.getElementById('comentarios').value = r.comentarios || "";
            inputTavo.value = r.califTavo; spanTavo.textContent = r.califTavo;
            inputTaly.value = r.califTaly; spanTaly.textContent = r.califTaly;
            
            editId = id; // Guardamos el ID para saber que estamos editando
            btnSubmit.textContent = "Actualizar reseña ✨";
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});

// ====== BUSCADOR EN TIEMPO REAL ======
const inputBuscador = document.getElementById('buscador');

inputBuscador.addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    
    // Filtramos el array de restaurantes que ya tenemos cargado
    const filtrados = restaurantes.filter(res => 
        res.nombre.toLowerCase().includes(texto)
    );

    // Limpiamos la lista visual
    listaRestaurantes.innerHTML = '';
    
    // Volvemos a renderizar solo los que coinciden
    filtrados.forEach(res => renderizarTarjeta(res));
});

function actualizarEstadisticas(data) {
    if (data.length === 0) return;

    document.getElementById('totalVisitados').textContent = data.length;

    let sumaTotal = 0;
    let favorito = data[0];
    let peor = data[0];

    data.forEach(res => {
        const prom = (res.califTavo + res.califTaly) / 2;
        sumaTotal += prom;

        if (prom > (favorito.califTavo + favorito.califTaly) / 2) favorito = res;
        if (prom < (peor.califTavo + peor.califTaly) / 2) peor = res;
    });

    document.getElementById('promedioGral').textContent = (sumaTotal / data.length).toFixed(1);
    document.getElementById('elFavorito').textContent = favorito.nombre;
    document.getElementById('elPeor').textContent = peor.nombre;

    const top3 = [...data]
        .sort((a, b) => ((b.califTavo + b.califTaly) / 2) - ((a.califTavo + a.califTaly) / 2))
        .slice(0, 3);

    const containerTop3 = document.getElementById('top3Lista');
    containerTop3.innerHTML = '';
    
    const medallas = ['🥇', '🥈', '🥉'];
    top3.forEach((res, index) => {
        const prom = ((res.califTavo + res.califTaly) / 2).toFixed(1);
        containerTop3.innerHTML += `
            <div style="display:flex; justify-content:space-between; background: rgba(255,255,255,0.03); padding: 8px 15px; border-radius: 10px; font-size: 0.9rem;">
                <span>${medallas[index]} ${res.nombre}</span>
                <span style="color: #22d3ee; font-weight: bold;">⭐ ${prom}</span>
            </div>
        `;
    });
}

// ====== BOTÓN DE RULETA ======
const btnRuleta = document.getElementById('btnRuleta');

btnRuleta.addEventListener('click', () => {
    const opcionesTop = restaurantes.filter(res => {
        const prom = (res.califTavo + res.califTaly) / 2;
        return prom >= 9 && res.lat && res.lng;
    });

    if (opcionesTop.length === 0) {
        alert("¡Necesitan calificar más lugares con +9 para activar la ruleta! 🍕");
        return;
    }

    btnRuleta.style.transform = "rotate(360deg) scale(1.2)";
    setTimeout(() => btnRuleta.style.transform = "rotate(0deg) scale(1)", 500);

    const elegido = opcionesTop[Math.floor(Math.random() * opcionesTop.length)];

    map.flyTo([elegido.lat, elegido.lng], 16, {
        animate: true,
        duration: 1.5
    });

    setTimeout(() => {
        Swal.fire({
            title: '✨ ¡EL DESTINO HA HABLADO! ✨',
            html: `
                <div style="color: #eee; margin-top: 10px;">
                    <p style="font-size: 1.2rem; margin-bottom: 5px;">Hoy la cita es en:</p>
                    <h2 style="color: #22d3ee; font-weight: 800; margin-bottom: 15px;">${elegido.nombre.toUpperCase()}</h2>
                    <p style="font-size: 0.9rem; opacity: 0.8;">📍 ${elegido.direccion || 'Dirección no registrada'}</p>
                </div>
            `,
            background: '#1a1c2c',
            color: '#fff',
            confirmButtonText: '¡Vamos allá! 🍔',
            confirmButtonColor: '#ff4fd8',
            customClass: {
                popup: 'borde-neon-alerta'
            },
            showClass: {
                popup: 'animate__animated animate__zoomIn'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOut'
            },
            backdrop: `rgba(0,0,123,0.4)`
        });

        const marcador = marcadoresActuales.find(m => 
            m.getLatLng().lat === elegido.lat && m.getLatLng().lng === elegido.lng
        );
        if (marcador) marcador.openPopup();
    }, 1600);
});
