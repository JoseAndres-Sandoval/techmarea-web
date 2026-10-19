// =========================================
// INICIALIZACIÓN DE FIREBASE
// =========================================
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { db, auth, pagarConMercadoPago, WHATSAPP } from "./config.js";

// =========================================
// 1. BASE DE DATOS DE PRODUCTOS (POWERBANKS: 400 - 499)
// =========================================
const catalogoVidrios = [
    { id: 700, nombre: "Vidrio Templado Común - Motorola E13", tipo: "comun", modelo: "Motorola E13", precio: 7000 },
    { id: 701, nombre: "Vidrio Templado Común - Motorola E20", tipo: "comun", modelo: "Motorola E20", precio: 7000 },
    { id: 702, nombre: "Vidrio Templado Común - Motorola E22 / E22I", tipo: "comun", modelo: "Motorola E22 / E22I", precio: 7000 },
    { id: 703, nombre: "Vidrio Templado Común - Motorola E6S / E6I", tipo: "comun", modelo: "Motorola E6S / E6I", precio: 7000 },
    { id: 704, nombre: "Vidrio Templado Común - Motorola G04 / G24", tipo: "comun", modelo: "Motorola G04 / G24", precio: 7000 },
    { id: 705, nombre: "Vidrio Templado Común - Motorola G06", tipo: "comun", modelo: "Motorola G06", precio: 7000 },
    { id: 706, nombre: "Vidrio Templado Común - Motorola G10 / G20 / G30", tipo: "comun", modelo: "Motorola G10 / G20 / G30", precio: 7000 },
    { id: 707, nombre: "Vidrio Templado Común - Motorola G84", tipo: "comun", modelo: "Motorola G84", precio: 7000 },
    { id: 708, nombre: "Vidrio Templado Común - Samsung A15", tipo: "comun", modelo: "Samsung A15", precio: 7000 },
    { id: 709, nombre: "Vidrio Templado Común - Samsung A21S", tipo: "comun", modelo: "Samsung A21S", precio: 7000 },
    { id: 710, nombre: "Vidrio Templado Común - Samsung A23 4G / 5G", tipo: "comun", modelo: "Samsung A23 4G / 5G", precio: 7000 },
    { id: 711, nombre: "Vidrio Templado Común - Samsung S23", tipo: "comun", modelo: "Samsung S23", precio: 7000 },
    { id: 712, nombre: "Vidrio Templado Común - Xiaomi Redmi Note 14", tipo: "comun", modelo: "Xiaomi Redmi Note 14", precio: 7000 },
    { id: 713, nombre: "Vidrio Templado Común - Xiaomi Redmi 15C", tipo: "comun", modelo: "Xiaomi Redmi 15C", precio: 7000 },
    { id: 714, nombre: "Vidrio Templado Común - Xiaomi Redmi Note 13", tipo: "comun", modelo: "Xiaomi Redmi Note 13", precio: 7000 },
    { id: 715, nombre: "Vidrio Templado Común - Xiaomi Redmi Note 15 Pro", tipo: "comun", modelo: "Xiaomi Redmi Note 15 Pro", precio: 7000 },
    { id: 716, nombre: "Vidrio Templado Común - iPhone 11 Pro Max", tipo: "comun", modelo: "iPhone 11 Pro Max", precio: 7000 },
    { id: 717, nombre: "Vidrio Templado Común - iPhone 12 / 12 Pro", tipo: "comun", modelo: "iPhone 12 / 12 Pro", precio: 7000 },
    { id: 718, nombre: "Vidrio Templado Común - iPhone 13 / 13 Pro", tipo: "comun", modelo: "iPhone 13 / 13 Pro", precio: 7000 },
    { id: 719, nombre: "Vidrio Templado Común - iPhone 14 Pro Max", tipo: "comun", modelo: "iPhone 14 Pro Max", precio: 7000 },
    { id: 720, nombre: "Vidrio Templado Premium - Motorola E14", tipo: "premium", modelo: "Motorola E14", precio: 7000 },
    { id: 721, nombre: "Vidrio Templado Premium - Motorola G75 5G", tipo: "premium", modelo: "Motorola G75 5G", precio: 7000 },
    { id: 722, nombre: "Vidrio Templado Premium - Motorola G86", tipo: "premium", modelo: "Motorola G86", precio: 7000 },
    { id: 723, nombre: "Vidrio Templado Premium - Samsung A05", tipo: "premium", modelo: "Samsung A05", precio: 7000 },
    { id: 724, nombre: "Vidrio Templado Premium - Samsung A07", tipo: "premium", modelo: "Samsung A07", precio: 7000 },
    { id: 725, nombre: "Vidrio Templado Premium - Samsung A14", tipo: "premium", modelo: "Samsung A14", precio: 7000 },
    { id: 726, nombre: "Vidrio Templado Premium - Samsung A16", tipo: "premium", modelo: "Samsung A16", precio: 7000 },
    { id: 727, nombre: "Vidrio Templado Premium - Samsung A17", tipo: "premium", modelo: "Samsung A17", precio: 7000 },
    { id: 728, nombre: "Vidrio Templado Premium - Samsung A25", tipo: "premium", modelo: "Samsung A25", precio: 7000 },
    { id: 729, nombre: "Vidrio Templado Premium - Samsung A35", tipo: "premium", modelo: "Samsung A35", precio: 7000 },
    { id: 730, nombre: "Vidrio Templado Premium - Samsung A55", tipo: "premium", modelo: "Samsung A55", precio: 7000 },
    { id: 731, nombre: "Vidrio Templado Premium - Samsung S25", tipo: "premium", modelo: "Samsung S25", precio: 7000 },
    { id: 732, nombre: "Vidrio Templado Premium - Samsung S25 Plus", tipo: "premium", modelo: "Samsung S25 Plus", precio: 7000 },
    { id: 733, nombre: "Vidrio Templado Premium - Samsung S25 Ultra", tipo: "premium", modelo: "Samsung S25 Ultra", precio: 7000 },
    { id: 734, nombre: "Vidrio Templado Premium - Xiaomi Redmi 14C", tipo: "premium", modelo: "Xiaomi Redmi 14C", precio: 7000 },
    { id: 735, nombre: "Vidrio Templado Premium - iPhone 13", tipo: "premium", modelo: "iPhone 13", precio: 7000 },
    { id: 736, nombre: "Vidrio Templado Premium - iPhone 15 Pro", tipo: "premium", modelo: "iPhone 15 Pro", precio: 7000 },
    { id: 737, nombre: "Vidrio Templado Premium - iPhone 15 Pro Max", tipo: "premium", modelo: "iPhone 15 Pro Max", precio: 7000 },
    { id: 738, nombre: "Vidrio Templado Premium - iPhone 16", tipo: "premium", modelo: "iPhone 16", precio: 7000 },
    { id: 739, nombre: "Vidrio Templado Premium - iPhone 16 Pro", tipo: "premium", modelo: "iPhone 16 Pro", precio: 7000 },
    { id: 740, nombre: "Vidrio Templado Premium - iPhone 16 Pro Max", tipo: "premium", modelo: "iPhone 16 Pro Max", precio: 7000 },
    { id: 741, nombre: "Vidrio Templado Premium - iPhone 17", tipo: "premium", modelo: "iPhone 17", precio: 7000 },
    { id: 742, nombre: "Vidrio Templado Premium - iPhone 17 Air", tipo: "premium", modelo: "iPhone 17 Air", precio: 7000 },
    { id: 743, nombre: "Vidrio Templado Premium - iPhone 17 Pro", tipo: "premium", modelo: "iPhone 17 Pro", precio: 7000 },
    { id: 744, nombre: "Vidrio Templado Premium - iPhone 17 Pro Max", tipo: "premium", modelo: "iPhone 17 Pro Max", precio: 7000 }
];

// =========================================
// 2. TARJETAS DE VIDRIOS (una por tipo, con selector de modelo)
// =========================================
const contenedor = document.getElementById("contenedor-productos");
const TIPOS = {
    comun: {
        titulo: "Vidrio Templado Común",
        specs: "<li><strong>Protección:</strong> Contra golpes y rayones</li><li><strong>Acabado:</strong> Transparente, no afecta el táctil</li><li><strong>Compatibilidad:</strong> Elegí el modelo exacto de tu celular</li>"
    },
    premium: {
        titulo: "Vidrio Templado Premium",
        specs: "<li><strong>Protección:</strong> Mayor resistencia contra golpes</li><li><strong>Calidad:</strong> Línea premium OG</li><li><strong>Compatibilidad:</strong> Elegí el modelo exacto de tu celular</li>"
    }
};

function cargarProductos(productosAMostrar = catalogoVidrios) {
    let htmlGenerado = "";
    for (const [tipo, info] of Object.entries(TIPOS)) {
        const modelos = productosAMostrar.filter(p => p.tipo === tipo);
        if (modelos.length === 0) continue;
        const opciones = modelos.map(p => `<option value="${p.id}">${p.modelo}</option>`).join("");
        htmlGenerado += `
            <article class="tarjeta-articulo">
                <img src="assets/img/vidrios-templados-local.webp" alt="${info.titulo}" class="imagen-articulo img-producto">
                <div class="info-articulo">
                    <h3>${info.titulo}</h3>
                    <ul class="lista-specs">${info.specs}</ul>
                    <select class="select-categoria select-modelo" data-tipo="${tipo}" style="width: 100%; margin: 10px 0;">
                        <option value="">Elegí tu modelo (${modelos.length})</option>${opciones}
                    </select>
                    <span class="precio">$${modelos[0].precio.toLocaleString("es-AR")}</span>
                    <button class="btn-neon-pequeno btn-agregar" data-tipo="${tipo}" style="width: 100%; border: none; cursor: pointer; font-family: inherit;">
                        Agregar al carrito
                    </button>
                </div>
            </article>`;
    }
    if (!htmlGenerado) {
        htmlGenerado = '<p style="color: white; grid-column: 1 / -1; text-align: center; padding: 20px;">No tenemos ese modelo en stock. Consultanos por WhatsApp.</p>';
    }
    contenedor.innerHTML = htmlGenerado;

    contenedor.querySelectorAll(".btn-agregar").forEach(boton => {
        boton.addEventListener("click", () => {
            const select = contenedor.querySelector(`.select-modelo[data-tipo="${boton.dataset.tipo}"]`);
            if (!select.value) {
                alert("Primero elegí el modelo de tu celular.");
                select.focus();
                return;
            }
            agregarAlCarrito(parseInt(select.value));
        });
    });
}

// =========================================
// 3. BÚSQUEDA POR MODELO Y FILTRO POR TIPO
// =========================================
const inputBuscador = document.getElementById("buscador-productos");
const selectCategoria = document.getElementById("filtro-categorias");

function filtrarCatalogo() {
    const textoBusqueda = inputBuscador ? inputBuscador.value.toLowerCase().trim() : "";
    const tipoElegido = selectCategoria ? selectCategoria.value : "todos";
    cargarProductos(catalogoVidrios.filter(p =>
        p.modelo.toLowerCase().includes(textoBusqueda) &&
        (tipoElegido === "todos" || p.tipo === tipoElegido)));
}

if (inputBuscador) inputBuscador.addEventListener("input", filtrarCatalogo);
if (selectCategoria) selectCategoria.addEventListener("change", filtrarCatalogo);

cargarProductos();

// =========================================
// 4. LÓGICA DEL PANEL DEL CARRITO (ABRIR/CERRAR)
// =========================================
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

// =========================================
// 5. MOTOR DE COMPRAS (NUBE FIREBASE)
// =========================================
let carrito = [];
let usuarioActual = null; 

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

function agregarAlCarrito(idProducto) {
    const productoEnCarrito = carrito.find(item => item.id === idProducto);
    
    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        const productoElegido = catalogoVidrios.find(producto => producto.id === idProducto);
        if (productoElegido) {
            carrito.push({ ...productoElegido, cantidad: 1 });
        }
    }
    
    guardarEnMemoria(); 
    renderizarCarrito();
    if (ventanaCarrito) ventanaCarrito.classList.add("carrito-abierto");
}

function renderizarCarrito() {
    const contenedorCarrito = document.getElementById("lista-carrito-items");
    const contadorCarrito = document.getElementById("contador-carrito");
    const totalCarrito = document.getElementById("total-carrito");

    if (!contenedorCarrito) return;

    contenedorCarrito.innerHTML = ""; 

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = '<p class="carrito-vacio">El carrito está vacío.</p>';
        if (contadorCarrito) contadorCarrito.innerText = "0";
        if (totalCarrito) totalCarrito.innerText = "$0";
        return;
    }

    let total = 0;
    let cantidadTotalItems = 0;

    carrito.forEach((producto) => {
        const item = document.createElement("div");
        item.style.display = "flex";
        item.style.justifyContent = "space-between";
        item.style.alignItems = "center";
        item.style.marginBottom = "15px";
        item.style.borderBottom = "1px solid #333";
        item.style.paddingBottom = "10px";

        let subtotalItem = producto.precio * producto.cantidad;
        let precioItemFormateado = subtotalItem.toLocaleString("es-AR");

        item.innerHTML = `
            <div style="flex-grow: 1;">
                <h5 style="color: var(--color-cian); margin: 0; font-size: 0.95rem;">${producto.nombre}</h5>
                <p style="margin: 5px 0; color: #fff; font-weight: bold;">$${precioItemFormateado}</p>
                
                <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
                    <button class="btn-restar" data-id="${producto.id}" style="background: #333; color: white; border: none; padding: 2px 10px; cursor: pointer; border-radius: 4px; font-weight: bold;">-</button>
                    <span style="color: white; font-size: 0.95rem; min-width: 20px; text-align: center;">${producto.cantidad}</span>
                    <button class="btn-sumar" data-id="${producto.id}" style="background: #333; color: white; border: none; padding: 2px 10px; cursor: pointer; border-radius: 4px; font-weight: bold;">+</button>
                </div>
            </div>
            <button class="btn-eliminar" data-id="${producto.id}" style="background: none; border: none; color: #ff4c4c; cursor: pointer; font-size: 1.2rem; margin-left: 10px;" title="Eliminar producto">🗑️</button>
        `;
        
        contenedorCarrito.appendChild(item);
        
        total += subtotalItem;
        cantidadTotalItems += producto.cantidad;
    });

    if (contadorCarrito) contadorCarrito.innerText = cantidadTotalItems;
    if (totalCarrito) totalCarrito.innerText = `$${total.toLocaleString("es-AR")}`;

    document.querySelectorAll('.btn-sumar').forEach(btn => btn.addEventListener('click', (e) => sumarCantidad(parseInt(e.target.dataset.id))));
    document.querySelectorAll('.btn-restar').forEach(btn => btn.addEventListener('click', (e) => restarCantidad(parseInt(e.target.dataset.id))));
    document.querySelectorAll('.btn-eliminar').forEach(btn => btn.addEventListener('click', (e) => eliminarDelCarrito(parseInt(e.target.dataset.id))));
}

function sumarCantidad(idProducto) {
    const producto = carrito.find(item => item.id === idProducto);
    if (producto) {
        producto.cantidad++;
        guardarEnMemoria();
        renderizarCarrito();
    }
}

function restarCantidad(idProducto) {
    const producto = carrito.find(item => item.id === idProducto);
    if (producto) {
        if (producto.cantidad > 1) {
            producto.cantidad--;
        } else {
            eliminarDelCarrito(idProducto);
            return; 
        }
        guardarEnMemoria();
        renderizarCarrito();
    }
}

function eliminarDelCarrito(idProducto) {
    carrito = carrito.filter(item => item.id !== idProducto);
    guardarEnMemoria(); 
    renderizarCarrito(); 
}

// =========================================
// 6. ENVIAR PEDIDO POR WHATSAPP / MERCADO PAGO
// =========================================
const btnPagar = document.getElementById("btn-pagar");
const btnMercadoPago = document.getElementById("btn-mercadopago"); 

if (btnPagar) {
    btnPagar.addEventListener("click", () => {
        if (carrito.length === 0) {
            alert("¡Tu carrito está vacío! Agrega algunos productos antes de pagar.");
            return;
        }

        const numeroWhatsApp = WHATSAPP; 
        let mensaje = "¡Hola Tech Marea! 🌊 Quiero realizar el siguiente pedido:\n\n";
        let totalPedido = 0;

        carrito.forEach((producto) => {
            let subtotal = producto.precio * producto.cantidad;
            let precioFormateado = subtotal.toLocaleString("es-AR");
            mensaje += `- ${producto.cantidad}x ${producto.nombre} ($${precioFormateado})\n`;
            totalPedido += subtotal;
        });

        mensaje += `\n*Total a pagar: $${totalPedido.toLocaleString("es-AR")}*`;

        const mensajeCodificado = encodeURIComponent(mensaje);
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
        window.open(urlWhatsApp, "_blank");
    });
}

if (btnMercadoPago) {
    btnMercadoPago.addEventListener("click", () => pagarConMercadoPago(carrito, btnMercadoPago));
}

// =========================================
// 7. VACIAR TODO EL CARRITO
// =========================================
const btnVaciarCarrito = document.getElementById("btn-vaciar-carrito");

if (btnVaciarCarrito) {
    btnVaciarCarrito.addEventListener("click", () => {
        if (carrito.length === 0) {
            alert("El carrito ya está vacío.");
            return;
        }

        const confirmar = confirm("¿Estás seguro de que quieres vaciar todo el carrito?");
        
        if (confirmar) {
            carrito = []; 
            guardarEnMemoria(); 
            renderizarCarrito(); 
        }
    });
}

// =========================================
// 8. LÓGICA DEL MODAL DE IMÁGENES (ZOOM Y GALERÍA)
// =========================================
let imagenesModalActual = [];
let indiceModalActual = 0;

document.addEventListener("click", function(e) {
    const modal = document.getElementById("modalImagen");
    const imgModal = document.getElementById("imgAmpliacion");
    const flechaIzq = document.getElementById("flechaIzq");
    const flechaDer = document.getElementById("flechaDer");

    // 1. Abrir el modal si se hace clic en una imagen de producto
    if (e.target.classList.contains("img-producto")) {
        if (modal && imgModal) {
            const contenedorPadre = e.target.closest('.carrusel-hover');
            
            if (contenedorPadre) {
                const imgs = contenedorPadre.querySelectorAll('.img-producto');
                imagenesModalActual = Array.from(imgs).map(img => img.src);
                indiceModalActual = imagenesModalActual.indexOf(e.target.src);
                
                if (flechaIzq) flechaIzq.style.display = "block";
                if (flechaDer) flechaDer.style.display = "block";
            } else {
                imagenesModalActual = [e.target.src];
                indiceModalActual = 0;
                
                if (flechaIzq) flechaIzq.style.display = "none";
                if (flechaDer) flechaDer.style.display = "none";
            }

            imgModal.src = imagenesModalActual[indiceModalActual];
            modal.style.display = "block"; 
        }
    }
    
    // 2. Cerrar el modal
    if (e.target.classList.contains("cerrar-modal") || e.target.id === "modalImagen") {
        if (modal) {
            modal.style.display = "none";
        }
    }

    // 3. Navegar con la flecha Izquierda
    if (e.target.id === "flechaIzq") {
        if (imagenesModalActual.length > 1) {
            indiceModalActual = (indiceModalActual === 0) ? imagenesModalActual.length - 1 : indiceModalActual - 1;
            imgModal.src = imagenesModalActual[indiceModalActual];
        }
    }

    // 4. Navegar con la flecha Derecha
    if (e.target.id === "flechaDer") {
        if (imagenesModalActual.length > 1) {
            indiceModalActual = (indiceModalActual === imagenesModalActual.length - 1) ? 0 : indiceModalActual + 1;
            imgModal.src = imagenesModalActual[indiceModalActual];
        }
    }
});