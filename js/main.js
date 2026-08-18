// =========================================
// INICIALIZACIÓN DE FIREBASE (MAIN)
// =========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCHV9m2iYtx70sqT0C5AlSiRQIrP2AL6zI",
    authDomain: "tech-marea-db.firebaseapp.com",
    projectId: "tech-marea-db",
    storageBucket: "tech-marea-db.firebasestorage.app",
    messagingSenderId: "120154130587",
    appId: "1:120154130587:web:390fd3c12fc7b3460cde3e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// =========================================
// 1. INYECCIÓN DEL CARRITO FLOTANTE EN EL DOM
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    // Creamos el botón flotante del carrito en la esquina si no existe
    if (!document.getElementById("btn-abrir-carrito")) {
        const btnFlotante = document.createElement("div");
        btnFlotante.innerHTML = `
            <a href="#" id="btn-abrir-carrito" style="position: fixed; bottom: 20px; right: 20px; background: var(--color-cian, #00ffff); color: #000; padding: 12px 20px; border-radius: 50px; font-weight: bold; z-index: 1000; box-shadow: 0 4px 10px rgba(0,0,0,0.3); text-decoration: none; display: flex; align-items: center; gap: 8px;">
                🛒 Carrito (<span id="contador-carrito">0</span>)
            </a>
        `;
        document.body.appendChild(btnFlotante);
    }

    // Creamos la ventana lateral/modal del carrito si no existe
    if (!document.getElementById("ventana-carrito")) {
        const ventana = document.createElement("div");
        ventana.id = "ventana-carrito";
        ventana.style.cssText = "position: fixed; top: 0; right: -400px; width: 350px; height: 100%; background: #1a1a1a; color: #fff; z-index: 2500; box-shadow: -5px 0 15px rgba(0,0,0,0.5); transition: right 0.3s ease; display: flex; flex-direction: column; padding: 20px; box-sizing: border-box;";
        ventana.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 15px;">
                <h3 style="margin: 0; color: var(--color-cian, #00ffff);">Tu Carrito</h3>
                <button id="btn-cerrar-carrito" style="background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer;">&times;</button>
            </div>
            <div id="lista-carrito-items" style="flex-grow: 1; overflow-y: auto; padding: 15px 0;">
                <p class="carrito-vacio">El carrito está vacío.</p>
            </div>
            <div style="border-top: 1px solid #333; padding-top: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 1.1rem; font-weight: bold;">
                    <span>Total:</span>
                    <span id="total-carrito" style="color: var(--color-cian, #00ffff);">$0</span>
                </div>
                <button id="btn-pagar" style="background: #25d366; color: #fff; border: none; padding: 12px; width: 100%; border-radius: 6px; font-weight: bold; cursor: pointer; margin-bottom: 10px;">
                    Pedir por WhatsApp 📱
                </button>
                <button id="btn-mercadopago" style="background: #009ee3; color: #fff; border: none; padding: 12px; width: 100%; border-radius: 6px; font-weight: bold; cursor: pointer; margin-bottom: 10px;">
                    Pagar con Mercado Pago 💳
                </button>
                <button id="btn-vaciar-carrito" style="background: #ff4c4c; color: #fff; border: none; padding: 8px; width: 100%; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.9rem;">
                    Vaciar Carrito
                </button>
            </div>
        `;
        document.body.appendChild(ventana);
    }

    // Estilo dinámico para abrir el carrito
    const estiloCss = document.createElement("style");
    estiloCss.innerHTML = `
        .carrito-abierto { right: 0 !important; }
    `;
    document.head.appendChild(estiloCss);

    // Inicializar eventos del carrito recién inyectado
    inicializarLogicaCarrito();
});

// =========================================
// 2. LÓGICA GENERAL DEL CARRITO Y PAGOS
// =========================================
function inicializarLogicaCarrito() {
    let carrito = [];
    let usuarioActual = null;

    const btnAbrirCarrito = document.getElementById("btn-abrir-carrito");
    const ventanaCarrito = document.getElementById("ventana-carrito");
    const btnCerrarCarrito = document.getElementById("btn-cerrar-carrito");

    if (btnAbrirCarrito && ventanaCarrito) {
        btnAbrirCarrito.addEventListener("click", (e) => {
            e.preventDefault();
            ventanaCarrito.classList.add("carrito-abierto");
        });
    }

    if (btnCerrarCarrito && ventanaCarrito) {
        btnCerrarCarrito.addEventListener("click", () => {
            ventanaCarrito.classList.remove("carrito-abierto");
        });
    }

    // Auth state observer para persistencia en nube
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            usuarioActual = user;
            const docRef = doc(db, "carritos", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                carrito = docSnap.data().items || [];
            } else {
                carrito = JSON.parse(localStorage.getItem("carritoTechMarea")) || [];
                guardarEnMemoria();
            }
            renderizarCarrito();
        } else {
            usuarioActual = null;
            carrito = JSON.parse(localStorage.getItem("carritoTechMarea")) || [];
            renderizarCarrito();
        }
    });

    async function guardarEnMemoria() {
        if (usuarioActual) {
            try {
                await setDoc(doc(db, "carritos", usuarioActual.uid), { items: carrito });
            } catch (error) {
                console.error("Error guardando en la nube:", error);
            }
        } else {
            localStorage.setItem("carritoTechMarea", JSON.stringify(carrito));
        }
    }

    function renderizarCarrito() {
        const contenedorCarrito = document.getElementById("lista-carrito-items");
        const contadorCarrito = document.getElementById("contador-carrito");
        const totalCarrito = document.getElementById("total-carrito");

        if (!contenedorCarrito) return;

        contenedorCarrito.innerHTML = "";

        if (carrito.length === 0) {
            contenedorCarrito.innerHTML = '<p class="carrito-vacio" style="color: #777; text-align: center;">El carrito está vacío.</p>';
            if (contadorCarrito) contadorCarrito.innerText = "0";
            if (totalCarrito) totalCarrito.innerText = "$0";
            return;
        }

        let total = 0;
        let cantidadTotalItems = 0;

        carrito.forEach((producto) => {
            const item = document.createElement("div");
            item.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #333; padding-bottom: 10px;";

            let subtotalItem = producto.precio * producto.cantidad;
            let precioItemFormateado = subtotalItem.toLocaleString("es-AR");

            item.innerHTML = `
                <div style="flex-grow: 1;">
                    <h5 style="color: var(--color-cian, #00ffff); margin: 0; font-size: 0.95rem;">${producto.nombre}</h5>
                    <p style="margin: 5px 0; color: #fff; font-weight: bold;">$${precioItemFormateado}</p>
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
                        <button class="btn-restar" data-id="${producto.id}" style="background: #333; color: white; border: none; padding: 2px 10px; cursor: pointer; border-radius: 4px; font-weight: bold;">-</button>
                        <span style="color: white; font-size: 0.95rem; min-width: 20px; text-align: center;">${producto.cantidad}</span>
                        <button class="btn-sumar" data-id="${producto.id}" style="background: #333; color: white; border: none; padding: 2px 10px; cursor: pointer; border-radius: 4px; font-weight: bold;">+</button>
                    </div>
                </div>
                <button class="btn-eliminar-item" data-id="${producto.id}" style="background: none; border: none; color: #ff4c4c; cursor: pointer; font-size: 1.2rem; margin-left: 10px;" title="Eliminar">🗑️</button>
            `;

            contenedorCarrito.appendChild(item);
            total += subtotalItem;
            cantidadTotalItems += producto.cantidad;
        });

        if (contadorCarrito) contadorCarrito.innerText = cantidadTotalItems;
        if (totalCarrito) totalCarrito.innerText = `$${total.toLocaleString("es-AR")}`;

        // Eventos internos de los items
        document.querySelectorAll('.btn-sumar').forEach(btn => btn.addEventListener('click', (e) => cambiarCantidad(parseInt(e.target.dataset.id), 1)));
        document.querySelectorAll('.btn-restar').forEach(btn => btn.addEventListener('click', (e) => cambiarCantidad(parseInt(e.target.dataset.id), -1)));
        document.querySelectorAll('.btn-eliminar-item').forEach(btn => btn.addEventListener('click', (e) => eliminarItem(parseInt(e.target.dataset.id))));
    }

    function cambiarCantidad(idProducto, delta) {
        const producto = carrito.find(item => item.id === idProducto);
        if (producto) {
            producto.cantidad += delta;
            if (producto.cantidad <= 0) {
                carrito = carrito.filter(item => item.id !== idProducto);
            }
            guardarEnMemoria();
            renderizarCarrito();
        }
    }

    function eliminarItem(idProducto) {
        carrito = carrito.filter(item => item.id !== idProducto);
        guardarEnMemoria();
        renderizarCarrito();
    }

    // Botón WhatsApp
    const btnPagar = document.getElementById("btn-pagar");
    if (btnPagar) {
        btnPagar.addEventListener("click", () => {
            if (carrito.length === 0) {
                alert("¡Tu carrito está vacío!");
                return;
            }
            const numeroWhatsApp = "5492613132991";
            let mensaje = "¡Hola Tech Marea! 🌊 Quiero realizar el siguiente pedido:\n\n";
            let totalPedido = 0;

            carrito.forEach((producto) => {
                let subtotal = producto.precio * producto.cantidad;
                mensaje += `- ${producto.cantidad}x ${producto.nombre} ($${subtotal.toLocaleString("es-AR")})\n`;
                totalPedido += subtotal;
            });

            mensaje += `\n*Total a pagar: $${totalPedido.toLocaleString("es-AR")}*`;
            window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`, "_blank");
        });
    }

    // Botón Mercado Pago conectado al EMULADOR LOCAL
    const btnMercadoPago = document.getElementById("btn-mercadopago");
    if (btnMercadoPago) {
        btnMercadoPago.addEventListener("click", async () => {
            if (carrito.length === 0) {
                alert("El carrito está vacío.");
                return;
            }

            try {
                const respuesta = await fetch("http://127.0.0.1:5001/tech-marea-db/us-central1/crearPreferencia", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ items: carrito })
                });

                const datos = await respuesta.json();

                if (datos.init_point) {
                    window.location.href = datos.init_point;
                } else {
                    alert("Hubo un error al generar el pago.");
                }
            } catch (error) {
                console.error("Error al conectar con el servidor de pago:", error);
                alert("No se pudo conectar con el servidor local de pagos (verificá que el emulador esté corriendo).");
            }
        });
    }

    // Vaciar carrito
    const btnVaciarCarrito = document.getElementById("btn-vaciar-carrito");
    if (btnVaciarCarrito) {
        btnVaciarCarrito.addEventListener("click", () => {
            if (carrito.length === 0) return;
            if (confirm("¿Estás seguro de vaciar el carrito?")) {
                carrito = [];
                guardarEnMemoria();
                renderizarCarrito();
            }
        });
    }
}