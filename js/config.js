// =========================================
// CONFIGURACIÓN COMPARTIDA DE TECH MAREA
// Todas las páginas importan este archivo.
// =========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Estos datos de Firebase son públicos por diseño (no son una clave secreta).
// La seguridad la dan las reglas de Firestore (archivo firestore.rules).
const firebaseConfig = {
    apiKey: "AIzaSyCHV9m2iYtx70sqT0C5AlSiRQIrP2AL6zI",
    authDomain: "tech-marea-db.firebaseapp.com",
    projectId: "tech-marea-db",
    storageBucket: "tech-marea-db.firebasestorage.app",
    messagingSenderId: "120154130587",
    appId: "1:120154130587:web:390fd3c12fc7b3460cde3e"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Siempre usa el servidor de pagos real publicado en Firebase.
// Solo si abrís la página con "?emulador" al final de la dirección
// (ej: 127.0.0.1:5500/parlantes.html?emulador) usa el emulador local.
const usarEmulador = new URLSearchParams(window.location.search).has("emulador");
export const URL_PAGO = usarEmulador
    ? "http://127.0.0.1:5001/tech-marea-db/us-central1/crearPreferencia"
    : "https://us-central1-tech-marea-db.cloudfunctions.net/crearPreferencia";

export const WHATSAPP = "5492613132991";

// Escapa texto antes de meterlo en HTML (evita que alguien inyecte código).
export function escaparHTML(texto) {
    return String(texto ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Envía el carrito al servidor. Solo mandamos id y cantidad:
// el precio lo pone el servidor desde el catálogo, así nadie puede cambiarlo.
export async function pagarConMercadoPago(carrito, boton) {
    if (!carrito || carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    const textoOriginal = boton ? boton.innerHTML : "";
    if (boton) {
        boton.disabled = true;
        boton.innerHTML = "Procesando...";
    }

    try {
        const respuesta = await fetch(URL_PAGO, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                items: carrito.map(p => ({ id: p.id, cantidad: p.cantidad })),
                origen: new URL(".", window.location.href).href
            })
        });

        const datos = await respuesta.json();

        if (respuesta.ok && datos.init_point) {
            window.location.href = datos.init_point;
            return;
        }
        alert(datos.error || "Hubo un error al generar el pago.");
    } catch (error) {
        console.error("Error al conectar con el servidor de pago:", error);
        alert("No se pudo conectar con el servidor de pagos. Probá de nuevo en unos minutos o pedí por WhatsApp.");
    }

    if (boton) {
        boton.disabled = false;
        boton.innerHTML = textoOriginal;
    }
}

// Menú hamburguesa (celular) para todas las páginas
function iniciarMenu() {
    const btnMenu = document.getElementById("btn-menu");
    const enlaces = document.getElementById("enlaces-menu");
    if (!btnMenu || !enlaces) return;

    btnMenu.addEventListener("click", () => enlaces.classList.toggle("activo"));
    enlaces.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", () => enlaces.classList.remove("activo"));
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarMenu);
} else {
    iniciarMenu();
}
