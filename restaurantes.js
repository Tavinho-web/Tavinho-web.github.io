import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

// ====== MOTOR DE ARRANQUE: SUBIR DATOS SI ESTÁ VACÍO ======
const datosIniciales = [
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
    { nombre: "Nancy Cabrera (postres)", califTavo: 7.0, califTaly: 9.0, comentarios: "" },
    { nombre: "Mokaná", califTavo: 9.4, califTaly: 9.6, comentarios: "" }
];

getDocs(restaurantesRef).then((snapshot) => {
    if (snapshot.empty) {
        datosIniciales.forEach(async (r) => {
            await addDoc(restaurantesRef, r);
        });
    }
});
// ==========================================================

const form = document.getElementById('registroForm');
const listaRestaurantes = document.getElementById('listaRestaurantes');
const btnSubmit = form.querySelector('button[type="submit"]');
const inputTavo = document.getElementById('califTavo');
const spanTavo = document.getElementById('valTavo');
const inputTaly = document.getElementById('califTaly');
const spanTaly = document.getElementById('valTaly');

let restaurantes = [];
let editId = null; 

inputTavo.addEventListener('input', (e) => spanTavo.textContent = parseFloat(e.target.value).toFixed(1));
inputTaly.addEventListener('input', (e) => spanTaly.textContent = parseFloat(e.target.value).toFixed(1));

// ESCUCHAR LA NUBE EN TIEMPO REAL
const q = query(restaurantesRef, orderBy("nombre", "asc"));

onSnapshot(q, (snapshot) => {
    restaurantes = [];
    snapshot.forEach((doc) => {
        restaurantes.push({ id: doc.id, ...doc.data() });
    });
    renderizarRestaurantes();
});

function renderizarRestaurantes() {
    listaRestaurantes.innerHTML = ''; 
    restaurantes.forEach((restaurante) => {
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
            : ``;

        li.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <h3 style="margin: 0; font-size: 20px; color: white; font-weight: 800; letter-spacing: 0.5px;">${restaurante.nombre}</h3>
                <div style="display: flex; gap: 8px;">
                    <button type="button" data-action="editar" data-id="${restaurante.id}" style="background: rgba(255,255,255,0.1); border: none; padding: 6px; border-radius: 8px; cursor: pointer; transition: 0.2s;" title="Editar">✏️</button>
                    <button type="button" data-action="eliminar" data-id="${restaurante.id}" style="background: rgba(255,255,255,0.1); border: none; padding: 6px; border-radius: 8px; cursor: pointer; transition: 0.2s;" title="Borrar">🗑️</button>
                </div>
            </div>
            ${htmlComentarios}
            <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px;">
                <span style="display: inline-flex; align-items: center; gap: 4px; background: rgba(34, 211, 238, 0.15); border: 1px solid rgba(34, 211, 238, 0.3); padding: 6px 12px; border-radius: 999px; font-size: 13px; font-weight: 700; color: #22d3ee; box-shadow: 0 4px 10px rgba(34, 211, 238, 0.1);">👦🏻 Tavo: ${restaurante.califTavo}</span>
                <span style="display: inline-flex; align-items: center; gap: 4px; background: rgba(255, 79, 216, 0.15); border: 1px solid rgba(255, 79, 216, 0.3); padding: 6px 12px; border-radius: 999px; font-size: 13px; font-weight: 700; color: #ff4fd8; box-shadow: 0 4px 10px rgba(255, 79, 216, 0.1);">👧🏻 Taly: ${restaurante.califTaly}</span>
                <span style="display: inline-flex; align-items: center; gap: 4px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); padding: 6px 12px; border-radius: 999px; font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.85);">⭐ Promedio: ${promedio}</span>
            </div>
        `;
        listaRestaurantes.appendChild(li);
    });
}

listaRestaurantes.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.dataset.action === 'eliminar' && confirm("¿Seguros que quieren borrar esta reseña?")) await deleteDoc(doc(db, "restaurantes", id));
    if (btn.dataset.action === 'editar') {
        const r = restaurantes.find(res => res.id === id);
        document.getElementById('nombreRestaurante').value = r.nombre;
        document.getElementById('comentarios').value = r.comentarios || "";
        inputTavo.value = r.califTavo; spanTavo.textContent = r.califTavo;
        inputTaly.value = r.califTaly; spanTaly.textContent = r.califTaly;
        editId = id; btnSubmit.textContent = "Actualizar reseña ✨";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btnSubmit.disabled = true;
    const originalText = btnSubmit.textContent;
    btnSubmit.textContent = "Guardando... ⏳";
    
    const datos = {
        nombre: document.getElementById('nombreRestaurante').value,
        califTavo: parseFloat(inputTavo.value),
        califTaly: parseFloat(inputTaly.value),
        comentarios: document.getElementById('comentarios').value
    };
    
    try {
        if (editId) { await updateDoc(doc(db, "restaurantes", editId), datos); editId = null; }
        else { await addDoc(restaurantesRef, datos); }
        form.reset(); 
        inputTavo.value = 5; inputTaly.value = 5; spanTavo.textContent = "5.0"; spanTaly.textContent = "5.0";
    } finally {
        btnSubmit.textContent = "Agregar reseña"; btnSubmit.disabled = false;
    }
});