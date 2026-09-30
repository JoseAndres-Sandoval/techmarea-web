// =========================================
// INICIALIZACIÓN DE FIREBASE
// =========================================
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { db, auth, pagarConMercadoPago, WHATSAPP } from "./config.js";

// =========================================
// 1. BASE DE DATOS DE PRODUCTOS (CABLES: 200 - 299)
// =========================================
const catalogoCables = [
    {
        id: 200,
        nombre: "Cable Sync-C Plus MODX-008S XAEA (Blanco)",
        categoria: "usb-c",
        color: "Blanco",
        imagen: "assets/img/cable-sync-c-008s.webp",
        imagenHover: "assets/img/cable-sync-c-008s-blanco.webp",
        specs: "<li><strong>Conexión:</strong> USB-C a USB-C</li><li><strong>Carga:</strong> Rápida hasta 3A</li><li><strong>Construcción:</strong> Tecnología 5 Core (Cobre 100% puro)</li><li><strong>Protección:</strong> Doble mallado premium resistente</li><li><strong>Largo:</strong> 0.95 m (Grosor: 3.5 mm)</li>",
        precio: 2475
    },
    {
        id: 201,
        nombre: "Cable TC-TC AX MODX-002B XAEA (Violeta)",
        categoria: "usb-c",
        color: "Violeta",
        imagen: "assets/img/CABLE TC-TC AX MODX-002B – XAEA – VIOLETA.webp",
        imagenHover: "assets/img/CABLE TC-TC AX MODX-002B – XAEA – VIOLETA1.webp",
        specs: "<li><strong>Conexión:</strong> Tipo C a Tipo C (Conector 90°)</li><li><strong>Carga:</strong> Rápida y estable (5-Core)</li><li><strong>Construcción:</strong> 100% Cobre (90 filamentos de 0.1mm)</li><li><strong>Cubierta:</strong> PVC de doble inyección</li><li><strong>Largo:</strong> 1.5 metros</li>",
        precio: 1751
    },
        {
        id: 202,
        nombre: "Cable Tipo C - Lightning MODX-098 Athenea XAEA (Celeste)",
        categoria: "lightning",
        color: "Celeste",
        imagen: "assets/img/CABLE TIPO C – LIGHTNING MODX-098 – ATHENEA – XAEA-CELESTE.webp",
        imagenHover: "assets/img/CABLE TIPO C – LIGHTNING MODX-098 – ATHENEA – XAEA – CELESTE1.webp",
        specs: "<li><strong>Conexión:</strong> Tipo C a Lightning</li><li><strong>Tecnología:</strong> Core 5 (100% cobre)</li><li><strong>Material:</strong> Cubierta TPE doble inyección ignífuga</li><li><strong>Largo:</strong> 1 metro</li>",
        precio: 3865
    },
    {
        id: 203,
        nombre: "Cable Tipo C - Tipo C MODX-097 Athenea XAEA (Beige)",
        categoria: "usb-c",
        color: "Beige",
        imagen: "assets/img/CABLE TIPO C – TIPO C MODX-097 – ATHENEA – XAEA.webp",
        imagenHover: "assets/img/CABLE TIPO C – TIPO C MODX-097 – ATHENEA – XAEA – AZUL METAL.webp",
        specs: "<li><strong>Conexión:</strong> Tipo C a Tipo C</li><li><strong>Tecnología:</strong> Core 5 (100% cobre)</li><li><strong>Material:</strong> Cubierta TPE doble inyección ignífuga</li><li><strong>Largo:</strong> 1 metro</li>",
        precio: 3042
    },
    {
        id: 204,
        nombre: "Cable Tipo C - Tipo C MODX-097 Athenea XAEA (Negro)",
        categoria: "usb-c",
        color: "Negro",
        imagen: "assets/img/CABLE TIPO C – TIPO C MODX-097 – ATHENEA – XAEA.webp",
        imagenHover: "assets/img/CABLE TIPO C – TIPO C MODX-097 – ATHENEA – XAEA - NEGRO.webp",
        specs: "<li><strong>Conexión:</strong> Tipo C a Tipo C</li><li><strong>Tecnología:</strong> Core 5 (100% cobre)</li><li><strong>Material:</strong> Cubierta TPE doble inyección ignífuga</li><li><strong>Largo:</strong> 1 metro</li>",
        precio: 3042
    },
    {
        id: 205,
        nombre: "Cable Tipo C - Tipo C MODX-097 Athenea XAEA (Azul Metal)",
        categoria: "usb-c",
        color: "Azul Metal",
        imagen: "assets/img/CABLE TIPO C – TIPO C MODX-097 – ATHENEA – XAEA.webp",
        imagenHover: "assets/img/CABLE TIPO C – TIPO C MODX-097 – ATHENEA – XAEA – AZUL METAL.webp",
        specs: "<li><strong>Conexión:</strong> Tipo C a Tipo C</li><li><strong>Tecnología:</strong> Core 5 (100% cobre)</li><li><strong>Material:</strong> Cubierta TPE doble inyección ignífuga</li><li><strong>Largo:</strong> 1 metro</li>",
        precio: 3042
    },
    {
        id: 206,
        nombre: "Cable Tipo C - Tipo C MODX-097 Athenea XAEA (Celeste)",
        categoria: "usb-c",
        color: "Celeste",
        imagen: "assets/img/CABLE TIPO C – TIPO C MODX-097 – ATHENEA – XAEA.webp",
        imagenHover: "assets/img/CABLE TIPO C – TIPO C MODX-097 – ATHENEA – XAEA - CELESTE.webp",
        specs: "<li><strong>Conexión:</strong> Tipo C a Tipo C</li><li><strong>Tecnología:</strong> Core 5 (100% cobre)</li><li><strong>Material:</strong> Cubierta TPE doble inyección ignífuga</li><li><strong>Largo:</strong> 1 metro</li>",
        precio: 3042
    },
    {
        id: 207,
        nombre: "Cable Tipo C - Tipo C MODX-097 Athenea XAEA (Lila)",
        categoria: "usb-c",
        color: "Lila",
        imagen: "assets/img/CABLE TIPO C – TIPO C MODX-097 – ATHENEA – XAEA.webp",
        imagenHover: "assets/img/CABLE TIPO C – TIPO C MODX-097 – ATHENEA – XAEA - LILA.webp",
        specs: "<li><strong>Conexión:</strong> Tipo C a Tipo C</li><li><strong>Tecnología:</strong> Core 5 (100% cobre)</li><li><strong>Material:</strong> Cubierta TPE doble inyección ignífuga</li><li><strong>Largo:</strong> 1 metro</li>",
        precio: 3042
    },
    {
        id: 208,
        nombre: "Cable Tipo C - Tipo C MODX-105 Hera XAEA (Azul)",
        categoria: "usb-c",
        color: "Azul",
        imagen: "assets/img/CABLE TIPO C TIPO C MODX-105 – HERA – XAEA – AZUL.webp",
        imagenHover: "assets/img/CABLE TIPO C TIPO C MODX-105 – HERA – XAEA – AZUL1.webp",
        specs: "<li><strong>Conexión:</strong> Tipo C a Tipo C</li><li><strong>Amperaje:</strong> 3A</li><li><strong>Material:</strong> 100% Cobre y TPE doble inyección ignífugo</li><li><strong>Largo:</strong> 1.5 metros</li>",
        precio: 2667
    },
    {
        id: 209,
        nombre: "Cable Tipo C - Tipo C MODX-105 Hera XAEA (Champagne)",
        categoria: "usb-c",
        color: "Champagne",
        imagen: "assets/img/CABLE TIPO C TIPO C MODX-105 – HERA – XAEA – DORADO CHAMPAGNE.webp",
        imagenHover: "assets/img/CABLE TIPO C TIPO C MODX-105 – HERA – XAEA – DORADO CHAMPAGNE1.webp",
        specs: "<li><strong>Conexión:</strong> Tipo C a Tipo C</li><li><strong>Amperaje:</strong> 3A</li><li><strong>Material:</strong> 100% Cobre y TPE doble inyección ignífugo</li><li><strong>Largo:</strong> 1.5 metros</li>",
        precio: 2667
    },
    {
        id: 210,
        nombre: "Cable USB Lightning MODX-104 Zeus XAEA (Dorado)",
        categoria: "lightning",
        color: "Dorado",
        imagen: "assets/img/CABLE USB LIGHTNING MODX-104 – ZEUS – XAEA – DORADO.webp",
        imagenHover: "assets/img/CABLE USB LIGHTNING MODX-104 – ZEUS – XAEA – DORADO1.webp",
        specs: "<li><strong>Conexión:</strong> USB a Lightning</li><li><strong>Construcción:</strong> 80 hilos de cobre puro</li><li><strong>Material:</strong> TPE resistente con doble inyección</li><li><strong>Largo:</strong> 1 metro</li>",
        precio: 2518
    },
    {
        id: 211,
        nombre: "Cable USB Lightning MODX-104 Zeus XAEA (Plata)",
        categoria: "lightning",
        color: "Plata",
        imagen: "assets/img/CABLE USB LIGHTNING MODX-104 – ZEUS – XAEA – PLATEADO.webp",
        imagenHover: "assets/img/CABLE USB LIGHTNING MODX-104 – ZEUS – XAEA – PLATEADO1.webp",
        specs: "<li><strong>Conexión:</strong> USB a Lightning</li><li><strong>Construcción:</strong> 80 hilos de cobre puro</li><li><strong>Material:</strong> TPE resistente con doble inyección</li><li><strong>Largo:</strong> 1 metro</li>",
        precio: 2518
    },
    {
        id: 212,
        nombre: "Cable USB Lightning MODX-104 Zeus XAEA (Marrón)",
        categoria: "lightning",
        color: "Marrón",
        imagen: "assets/img/CABLE USB LIGHTNING MODX-104 – ZEUS – XAEA – MARRON.webp",
        imagenHover: "assets/img/CABLE USB LIGHTNING MODX-104 – ZEUS – XAEA – MARRON1.webp",
        specs: "<li><strong>Conexión:</strong> USB a Lightning</li><li><strong>Construcción:</strong> 80 hilos de cobre puro</li><li><strong>Material:</strong> TPE resistente con doble inyección</li><li><strong>Largo:</strong> 1 metro</li>",
        precio: 2518
    },
    {
        id: 213,
        nombre: "Cable USB Lightning MODX-104 Zeus XAEA (Verde)",
        categoria: "lightning",
        color: "Verde",
        imagen: "assets/img/CABLE USB LIGHTNING MODX-104 – ZEUS – XAEA – VERDE.webp",
        imagenHover: "assets/img/CABLE USB LIGHTNING MODX-104 – ZEUS – XAEA – VERDE1.webp",
        specs: "<li><strong>Conexión:</strong> USB a Lightning</li><li><strong>Construcción:</strong> 80 hilos de cobre puro</li><li><strong>Material:</strong> TPE resistente con doble inyección</li><li><strong>Largo:</strong> 1 metro</li>",
        precio: 2518
    },
    {
        id: 214,
        nombre: "Cable USB V8 MOD 73 Qualy 4.4 AMP XAEA (Blanco)",
        categoria: "micro-usb",
        color: "Blanco",
        imagen: "assets/img/CABLE USB MOD 73 QUALY 4.4 AMP – XAEA – V8 – 1 MTS - BLANCO.webp",
        imagenHover: "assets/img/CABLE USB MOD 73 QUALY 4.4 AMP – XAEA – V8 – 1 MTS - BLANCO1.webp",
        specs: "<li><strong>Conexión:</strong> USB a V8 (Micro-USB)</li><li><strong>Amperaje:</strong> 4.4A</li><li><strong>Construcción:</strong> 120 hilos de cobre</li><li><strong>Material:</strong> TPE con puntas doble inyección</li><li><strong>Largo:</strong> 1 metro</li>",
        precio: 1363
    },
    {
        id: 215,
        nombre: "Cable USB Tipo C MOD 74 Qualy 4.4 AMP XAEA (Blanco)",
        categoria: "usb-c",
        color: "Blanco",
        imagen: "assets/img/CABLE USB MOD 74 QUALY 4.4 AMP – XAEA – TIPO C – 1 MTS - BLANCO.webp",
        imagenHover: "assets/img/CABLE USB MOD 74 QUALY 4.4 AMP – XAEA – TIPO C – 1 MTS - BLANCO1.webp",
        specs: "<li><strong>Conexión:</strong> USB a Tipo C</li><li><strong>Amperaje:</strong> 4.4A</li><li><strong>Construcción:</strong> 120 hilos de cobre</li><li><strong>Material:</strong> TPE con puntas doble inyección</li><li><strong>Largo:</strong> 1 metro</li>",
        precio: 1363
    },
    {
        id: 216,
        nombre: "Cable USB Lightning MOD96 Wolverine XAEA (Negro)",
        categoria: "lightning",
        color: "Negro",
        imagen: "assets/img/CABLE USB MOD96 WOLVERINE – XAEA – LIGHTNING – 4.4 AMP – NEGRO.webp",
        imagenHover: "assets/img/CABLE USB MOD96 WOLVERINE – XAEA – LIGHTNING – 4.4 AMP – NEGRO1.webp",
        specs: "<li><strong>Conexión:</strong> USB a Lightning</li><li><strong>Amperaje:</strong> 4.4A</li><li><strong>Construcción:</strong> 120 hilos de cobre (Grosor 4.5 mm)</li><li><strong>Material:</strong> Puntas reforzadas con doble inyección</li><li><strong>Largo:</strong> 1 metro</li>",
        precio: 2116
    },
    {
        id: 217,
        nombre: "Cable USB MODX-026 Thor Tipo C XAEA (Rojo)",
        categoria: "usb-c",
        color: "Rojo",
        imagen: "assets/img/CABLE USB MODX-026 THOR TIPO C – XAEA – ROJO.webp",
        imagenHover: "assets/img/CABLE USB MODX-026 THOR TIPO C – XAEA – ROJO1.webp",
        specs: "<li><strong>Conexión:</strong> USB a Tipo C</li><li><strong>Construcción:</strong> 100 hilos de cobre puro</li><li><strong>Material:</strong> Malla metálica exterior y puntas de metal</li><li><strong>Largo:</strong> 1 metro (Grosor 4.5 mm)</li>",
        precio: 2237
    },
    {
        id: 218,
        nombre: "Cable USB MODX-026 Thor Tipo C XAEA (Negro)",
        categoria: "usb-c",
        color: "Negro",
        imagen: "assets/img/CABLE USB MODX-026 THOR TIPO C – XAEA – NEGRO.webp",
        imagenHover: "assets/img/CABLE USB MODX-026 THOR TIPO C – XAEA – NEGRO1.webp",
        specs: "<li><strong>Conexión:</strong> USB a Tipo C</li><li><strong>Construcción:</strong> 100 hilos de cobre puro</li><li><strong>Material:</strong> Malla metálica exterior y puntas de metal</li><li><strong>Largo:</strong> 1 metro (Grosor 4.5 mm)</li>",
        precio: 2237
    }
];

// =========================================
// 2. INYECTAR PRODUCTOS EN EL HTML
// =========================================
const contenedor = document.getElementById("contenedor-productos");

function cargarProductos(productosAMostrar = catalogoCables) {
    let htmlGenerado = ""; 

    if (productosAMostrar.length === 0) {
        contenedor.innerHTML = '<p style="color: white; grid-column: 1 / -1; text-align: center; padding: 20px;">No se encontraron cables con esa búsqueda.</p>';
        return;
    }

    productosAMostrar.forEach(producto => {
        let bloqueImagen = "";

        if (producto.imagenHover) {
            bloqueImagen = `
                <div class="carrusel-hover">
                    <img src="${producto.imagen}" alt="${producto.nombre} - Foto 1" class="img-deslizante img-1 img-producto">
                    <img src="${producto.imagenHover}" alt="${producto.nombre} - Foto 2" class="img-deslizante img-2 img-producto">
                </div>
            `;
        } else {
            bloqueImagen = `<img src="${producto.imagen}" alt="${producto.nombre}" class="imagen-articulo img-producto">`;
        }

        let precioFormateado = producto.precio.toLocaleString("es-AR");

        htmlGenerado += `
            <article class="tarjeta-articulo">
                ${bloqueImagen}
                <div class="info-articulo">
                    <h3>${producto.nombre}</h3>
                    <ul class="lista-specs">
                        ${producto.specs}
                    </ul>
                    <span class="precio">$${precioFormateado}</span>
                    <button class="btn-neon-pequeno btn-agregar" data-id="${producto.id}" style="width: 100%; border: none; cursor: pointer; font-family: inherit;">
                        Agregar al carrito
                    </button>
                </div>
            </article>
        `;
    });

    contenedor.innerHTML = htmlGenerado;

    // Asignar eventos a los botones recién creados
    const botonesAgregar = document.querySelectorAll('.btn-agregar');
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            agregarAlCarrito(id);
        });
    });
}

// =========================================
// 3. LÓGICA DE BÚSQUEDA Y FILTROS
// =========================================
const inputBuscador = document.getElementById("buscador-productos");
const selectCategoria = document.getElementById("filtro-categorias");

function filtrarCatalogo() {
    const textoBusqueda = inputBuscador ? inputBuscador.value.toLowerCase() : "";
    const categoriaElegida = selectCategoria ? selectCategoria.value : "todos";

    const productosFiltrados = catalogoCables.filter(producto => {
        const coincideNombre = producto.nombre.toLowerCase().includes(textoBusqueda);
        const coincideCategoria = categoriaElegida === "todos" || producto.categoria === categoriaElegida;
        return coincideNombre && coincideCategoria;
    });

    cargarProductos(productosFiltrados);
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
        const productoElegido = catalogoCables.find(producto => producto.id === idProducto);
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