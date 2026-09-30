// =========================================
// INICIALIZACIÓN DE FIREBASE (MAIN)
// =========================================
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { db, auth, pagarConMercadoPago, WHATSAPP, escaparHTML } from "./config.js";

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
                    <h5 style="color: var(--color-cian, #00ffff); margin: 0; font-size: 0.95rem;">${escaparHTML(producto.nombre)}</h5>
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
            const numeroWhatsApp = WHATSAPP;
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

    // Botón Mercado Pago
    const btnMercadoPago = document.getElementById("btn-mercadopago");
    if (btnMercadoPago) {
        btnMercadoPago.addEventListener("click", () => pagarConMercadoPago(carrito, btnMercadoPago));
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

// =========================================
// 3. REGISTRO, INGRESO Y SALIDA DE CLIENTES
// =========================================
function mensajeErrorAuth(error) {
    const mensajes = {
        "auth/email-already-in-use": "Ese correo ya tiene una cuenta. Probá iniciar sesión.",
        "auth/invalid-email": "El correo no es válido.",
        "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
        "auth/invalid-credential": "Correo o contraseña incorrectos.",
        "auth/too-many-requests": "Demasiados intentos. Esperá unos minutos y probá de nuevo."
    };
    return mensajes[error.code] || "Ocurrió un error. Probá de nuevo.";
}

document.addEventListener("DOMContentLoaded", () => {
    const modalRegistro = document.getElementById("modal-registro");
    const modalLogin = document.getElementById("modal-login");
    if (!modalRegistro || !modalLogin) return;

    const abrirRegistro = () => { modalLogin.style.display = "none"; modalRegistro.classList.add("modal-abierto"); };
    const abrirLogin = () => { modalRegistro.classList.remove("modal-abierto"); modalLogin.style.display = "flex"; };
    const cerrarTodo = () => { modalRegistro.classList.remove("modal-abierto"); modalLogin.style.display = "none"; };

    document.getElementById("btn-abrir-registro")?.addEventListener("click", (e) => { e.preventDefault(); abrirRegistro(); });
    document.getElementById("link-ir-login")?.addEventListener("click", (e) => { e.preventDefault(); abrirLogin(); });
    document.getElementById("link-ir-registro")?.addEventListener("click", (e) => { e.preventDefault(); abrirRegistro(); });
    document.getElementById("btn-cerrar-registro")?.addEventListener("click", cerrarTodo);
    document.getElementById("btn-cerrar-login")?.addEventListener("click", cerrarTodo);
    [modalRegistro, modalLogin].forEach(m => m.addEventListener("click", (e) => { if (e.target === m) cerrarTodo(); }));

    document.getElementById("form-registro-auth")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nombre = document.getElementById("reg-nombre").value.trim();
        const email = document.getElementById("reg-email").value.trim();
        const password = document.getElementById("reg-password").value;
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(cred.user, { displayName: nombre });
            await setDoc(doc(db, "usuarios", cred.user.uid), { nombre, email, creado: new Date().toISOString() });
            mostrarUsuario(cred.user);
            e.target.reset();
            cerrarTodo();
        } catch (error) {
            console.error(error);
            alert(mensajeErrorAuth(error));
        }
    });

    document.getElementById("form-login-auth")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            e.target.reset();
            cerrarTodo();
        } catch (error) {
            console.error(error);
            alert(mensajeErrorAuth(error));
        }
    });

    document.getElementById("btn-cerrar-sesion")?.addEventListener("click", async (e) => {
        e.preventDefault();
        await signOut(auth);
        localStorage.removeItem("carritoTechMarea");
    });

    onAuthStateChanged(auth, (user) => mostrarUsuario(user));
});

function mostrarUsuario(user) {
    const menuRegistro = document.getElementById("menu-registro");
    const menuUsuario = document.getElementById("menu-usuario");
    const menuSalir = document.getElementById("menu-salir");
    const btnPerfil = document.getElementById("btn-perfil");
    if (!menuRegistro || !menuUsuario || !menuSalir) return;

    if (user) {
        const nombre = (user.displayName || user.email || "").split(" ")[0];
        if (btnPerfil) btnPerfil.textContent = `¡Hola, ${nombre}!`;
        menuRegistro.style.display = "none";
        menuUsuario.style.display = "";
        menuSalir.style.display = "";
    } else {
        menuRegistro.style.display = "";
        menuUsuario.style.display = "none";
        menuSalir.style.display = "none";
    }
}

// =========================================
// 4. SEGUIMIENTO DE REPARACIONES
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("input-orden");
    const boton = document.getElementById("btn-consultar-orden");
    const resultado = document.getElementById("resultado-reparacion");
    const titulo = document.getElementById("estado-titulo");
    const detalle = document.getElementById("estado-detalle");
    if (!input || !boton || !resultado) return;

    async function consultar() {
        const orden = input.value.trim().replace(/^#/, "");
        if (!/^[0-9]{1,10}$/.test(orden)) {
            alert("Ingresá solo el número de orden (ej: 1001).");
            return;
        }

        boton.disabled = true;
        boton.textContent = "Buscando...";
        try {
            const snap = await getDoc(doc(db, "reparaciones", orden));
            resultado.style.display = "block";
            if (snap.exists()) {
                const d = snap.data();
                titulo.textContent = `Orden #${orden} · ${d.estado}`;
                detalle.innerHTML = `<strong>Equipo:</strong> ${escaparHTML(d.equipo)}<br>${escaparHTML(d.detalle)}`;
                resultado.style.borderLeftColor = d.estado === "Listo para retirar" ? "#25d366" : "var(--color-cian)";
            } else {
                titulo.textContent = "No encontramos esa orden";
                detalle.textContent = "Revisá el número o escribinos por WhatsApp y te ayudamos.";
                resultado.style.borderLeftColor = "#ff4757";
            }
        } catch (error) {
            console.error(error);
            alert("No se pudo consultar en este momento. Probá de nuevo.");
        }
        boton.disabled = false;
        boton.textContent = "Consultar Estado";
    }

    boton.addEventListener("click", consultar);
    input.addEventListener("keypress", (e) => { if (e.key === "Enter") consultar(); });
});
