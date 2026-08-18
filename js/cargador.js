// =========================================
// INICIALIZACIÓN DE FIREBASE (NUEVO)
// =========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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
// 1. BASE DE DATOS DE PRODUCTOS (CARGADORES: 300 - 399)
// =========================================
const catalogoCargadores = [
    {
        id: 300,
        nombre: "Adaptador Cargador 220V MODX-507 Raptor 45W XAEA (Blanco)",
        categoria: "cargador-pared",
        color: "Blanco",
        imagen: "assets/img/ADAPTADOR-CARGADOR 220V MODX-507 RAPTOR – 5,1A – 45W – 1TC + PD – XAEA – BLANCO.png",
        imagenHover: "assets/img/ADAPTADOR-CARGADOR 220V MODX-507 RAPTOR – 5,1A – 45W – 1TC + PD – XAEA – BLANCO1.png",
        specs: "<li><strong>Potencia:</strong> 45W de salida máxima</li><li><strong>Amperaje y Voltaje:</strong> 5.1A / 9VCC</li><li><strong>Conexión:</strong> 1 Puerto Tipo C (Power Delivery)</li><li><strong>Material:</strong> Plástico ABS resistente</li>",
        precio: 4479
    },
    {
        id: 301,
        nombre: "Adaptador Cargador 220V MODX-516 Hyper 55W XAEA (Blanco)",
        categoria: "cargador-pared",
        color: "Blanco",
        imagen: "assets/img/ADAPTADOR-CARGADOR 220V MODX-516 HYPER – 5,4A – 1USB + 1TC – XAEA – BLANCO.png",
        imagenHover: "assets/img/ADAPTADOR-CARGADOR 220V MODX-516 HYPER – 5,4A – 1USB + 1TC – XAEA – BLANCO1.png",
        specs: "<li><strong>Potencia:</strong> 55W Total (USB-C: 55W / USB-A: 18W)</li><li><strong>Amperaje:</strong> 5.4A</li><li><strong>Conexión:</strong> 1 Puerto Tipo C + 1 Puerto USB-A</li><li><strong>Tensión de Entrada:</strong> AC 100-220V</li>",
        precio: 10518
    },
    {
        id: 302,
        nombre: "Adaptador Cargador 220V MODX-616 Extreme 65W XAEA (Blanco)",
        categoria: "cargador-pared",
        color: "Blanco",
        imagen: "assets/img/ADAPTADOR-CARGADOR 220V MODX-616 EXTREME – 6,2A – 1USB + 2TC – XAEA – BLANCO.png",
        imagenHover: "assets/img/ADAPTADOR-CARGADOR 220V MODX-616 EXTREME – 6,2A – 1USB + 2TC – XAEA – BLANCO1.png",
        specs: "<li><strong>Potencia:</strong> 65W Total (USB-C: 65W / USB-A: 18W)</li><li><strong>Amperaje:</strong> 6.2A</li><li><strong>Conexión:</strong> 2 Puertos Tipo C + 1 Puerto USB-A</li><li><strong>Material:</strong> Plástico ABS resistente</li>",
        precio: 13655
    },
    {
        id: 303,
        nombre: "Adaptador Cargador 220V MODX-A016 Optimum 45W XAEA (Blanco)",
        categoria: "cargador-pared",
        color: "Blanco",
        imagen: "assets/img/ADAPTADOR-CARGADOR 220V MODX-A016 OPTIMUM – 5A – TIPO C – XAEA.png",
        imagenHover: "assets/img/ADAPTADOR-CARGADOR 220V MODX-A016 OPTIMUM – 5A – TIPO C – XAEA1.png",
        specs: "<li><strong>Potencia:</strong> 45W (Power Delivery)</li><li><strong>Amperaje y Voltaje:</strong> 5A / 9VCC</li><li><strong>Conexión:</strong> 1 Puerto Tipo C</li><li><strong>Material:</strong> Plástico ABS resistente</li>",
        precio: 5289
    },
    {
        id: 304,
        nombre: "Cargador Intensify 30W 1USB 1TC + Cable USB a Tipo C XAEA (Blanco)",
        categoria: "cargador-pared",
        color: "Blanco",
        imagen: "assets/img/CARGADOR 220V MODX-C015 – INTENSIFY – 1USB 1TC + CABLE USB A TIPO C – XAEA – BLANCO.png",
        imagenHover: "assets/img/CARGADOR 220V MODX-C015 – INTENSIFY – 1USB 1TC + CABLE USB A TIPO C – XAEA – BLANCO1.png",
        specs: "<li><strong>Potencia:</strong> 30W</li><li><strong>Conexión:</strong> 1 Puerto Tipo C + 1 Puerto USB-A</li><li><strong>Tensión y Salida:</strong> AC 100-220V / 5VCC</li><li><strong>Extras:</strong> Incluye cable USB a Tipo C (1 metro, 2A)</li>",
        precio: 5303
    },
    {
        id: 305,
        nombre: "Adaptador Cargador Auto 12V Voltair MODX-00C4 45W 2 Tipo C XAEA",
        categoria: "cargador-auto",
        color: "Negro", 
        imagen: "assets/img/ADAPTADOR CARGADOR 12V VOLTAIR 2 TIPO C MODX-00C4 – XAEA – NEGRO.png",
        imagenHover: "assets/img/ADAPTADOR CARGADOR 12V VOLTAIR 2 TIPO C MODX-00C4 – XAEA – NEGRO1.png",
        specs: "<li><strong>Potencia:</strong> 45W (Carga rápida Power Delivery)</li><li><strong>Conexión:</strong> 2 Puertos Tipo C</li><li><strong>Entrada:</strong> 12-24V (Ideal para autos)</li><li><strong>Material:</strong> Aleación de aluminio resistente</li>",
        precio: 9268
    },
    {
        id: 306,
        nombre: "Adaptador Cargador Auto 12V Voltair MODX-517 3A 1USB + 1TC XAEA (Verde)",
        categoria: "cargador-auto",
        color: "Verde",
        imagen: "assets/img/ADAPTADOR-CARGADOR 12V VOLTAIR MODX-517 – 3A – 1USB + 1TC – XAEA – VERDE.png",
        imagenHover: "assets/img/ADAPTADOR-CARGADOR 12V VOLTAIR MODX-517 – 3A – 1USB + 1TC – XAEA – VERDE1.png",
        specs: "<li><strong>Potencia:</strong> 45W (Carga rápida Power Delivery)</li><li><strong>Conexión:</strong> 1 Puerto USB-A + 1 Puerto Tipo C</li><li><strong>Entrada:</strong> 12-24V (Ideal para autos)</li><li><strong>Material:</strong> Aleación de aluminio (Verde militar)</li>",
        precio: 7125
    }
];

// =========================================
// 2. INYECTAR PRODUCTOS EN EL HTML
// =========================================
const contenedor = document.getElementById("contenedor-productos");

function cargarProductos(productosAMostrar = catalogoCargadores) {
    let htmlGenerado = ""; 

    if (productosAMostrar.length === 0) {
        contenedor.innerHTML = '<p style="color: white; grid-column: 1 / -1; text-align: center; padding: 20px;">No se encontraron cargadores con esa búsqueda.</p>';
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
    const textoBusqueda = inputBuscador.value.toLowerCase();
    const categoriaElegida = selectCategoria.value;

    const productosFiltrados = catalogoCargadores.filter(producto => {
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
// 5. MOTOR DE COMPRAS (FIREBASE)
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
        const productoElegido = catalogoCargadores.find(producto => producto.id === idProducto);
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

        const numeroWhatsApp = "5492613132991"; 
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
    btnMercadoPago.addEventListener("click", async () => {
        if (carrito.length === 0) {
            alert("El carrito está vacío.");
            return;
        }

        try {
            // Conexión directa al emulador local en ejecución
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
            alert("No se pudo conectar con el servidor local de pagos.");
        }
    });
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
    
    if (e.target.classList.contains("cerrar-modal") || e.target.id === "modalImagen") {
        if (modal) modal.style.display = "none";
    }

    if (e.target.id === "flechaIzq") {
        if (imagenesModalActual.length > 1) {
            indiceModalActual = (indiceModalActual === 0) ? imagenesModalActual.length - 1 : indiceModalActual - 1;
            imgModal.src = imagenesModalActual[indiceModalActual];
        }
    }

    if (e.target.id === "flechaDer") {
        if (imagenesModalActual.length > 1) {
            indiceModalActual = (indiceModalActual === imagenesModalActual.length - 1) ? 0 : indiceModalActual + 1;
            imgModal.src = imagenesModalActual[indiceModalActual];
        }
    }
});