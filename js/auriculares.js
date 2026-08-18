// =========================================
// INICIALIZACIÓN DE FIREBASE
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
// 1. BASE DE DATOS DE PRODUCTOS (AURICULARES: 100 - 199)
// =========================================
const catalogoAuriculares = [
    {
        id: 100,
        nombre: "Auricular Xaea MODX-701 M103",
        categoria: "auricular", 
        color: "Verde",
        imagen: "assets/img/AURICULAR BT MODX-707 KIDS - VERDE.png", 
        imagenHover: "assets/img/AURICULAR BT MODX-707 KIDS - VERDE2.png",
        specs: "<li><strong>Conectividad:</strong> Bluetooth V5.0 (10m)</li><li><strong>Funciones:</strong> Lector TF, Radio FM, MP3</li><li><strong>Color:</strong> Verde</li><li><strong>Batería:</strong> 150mAh (3hs de uso) - Entrada V8</li><li><strong>Controles:</strong> Volumen, canciones y llamadas</li><li><strong>Extras:</strong> Cable de carga y cable auxiliar incluidos</li>",
        precio: 15000 
    },
    {
        id: 101,
        nombre: "Auricular Xaea MODX-701 M103",
        categoria: "auricular", 
        color: "Celeste",
        imagen: "assets/img/AURICULAR BT MODX-707 KIDS - CELESTE.png", 
        imagenHover: "assets/img/AURICULAR BT MODX-707 KIDS - CELESTE2.png", 
        specs: "<li><strong>Conectividad:</strong> Bluetooth V5.0 (10m)</li><li><strong>Funciones:</strong> Lector TF, Radio FM, MP3</li><li><strong>Color:</strong> Celeste</li><li><strong>Batería:</strong> 150mAh (3hs de uso) - Entrada V8</li><li><strong>Controles:</strong> Volumen, canciones y llamadas</li><li><strong>Extras:</strong> Cable de carga y cable auxiliar incluidos</li>",
        precio: 15000 
    },
    {
        id: 102,
        nombre: "Auricular BT MODX-708 Orejas de Gato",
        categoria: "auricular", 
        color: "Rosa",
        imagen: "assets/img/AURICULAR BT MODX-708-ROSA.png", 
        imagenHover: "assets/img/AURICULAR BT MODX-708-ROSA2.png", 
        specs: "<li><strong>Diseño:</strong> Infantil con orejitas de gato</li><li><strong>Conectividad:</strong> Bluetooth (10m)</li><li><strong>Funciones:</strong> TF, Auxiliar, Radio FM</li><li><strong>Batería:</strong> 150mAh (3hs de uso) - Puerto V8</li><li><strong>Micrófono y Controles:</strong> Sí</li><li><strong>Extras:</strong> Cable de carga y cable auxiliar (0,80m)</li>",
        precio: 7124
    },
    {
        id: 103,
        nombre: "Auricular BT MODX-708 Orejas de Gato",
        categoria: "auricular", 
        color: "Violeta",
        imagen: "assets/img/AURICULAR BT MODX-708-VIOLETA.png", 
        imagenHover: "assets/img/AURICULAR BT MODX-708-VIOLETA2.png", 
        specs: "<li><strong>Diseño:</strong> Infantil con orejitas de gato</li><li><strong>Conectividad:</strong> Bluetooth (10m)</li><li><strong>Funciones:</strong> TF, Auxiliar, Radio FM</li><li><strong>Batería:</strong> 150mAh (3hs de uso) - Puerto V8</li><li><strong>Micrófono y Controles:</strong> Sí</li><li><strong>Extras:</strong> Cable de carga y cable auxiliar (0,80m)</li>",
        precio: 7124
    },
    {
        id: 104,
        nombre: "Auricular TWS ANC MODX-00AI XAEA (Beige)",
        categoria: "in-ear",
        color: "Beige",
        imagen: "assets/img/MANOS LIBRES TWS ANC SIMIL CUERO MODX-00AI – XAEA – BEIGE.png",
        imagenHover: "assets/img/MANOS LIBRES TWS ANC SIMIL CUERO MODX-00AI – XAEA – BEIGE1.png",
        specs: "<li><strong>Conectividad:</strong> Bluetooth V5.4 (Rango 10m)</li><li><strong>Tecnología:</strong> ANC y ENC con 4 micrófonos integrados</li><li><strong>Batería:</strong> 8 horas (Estuche de carga 400mAh)</li><li><strong>Material:</strong> Diseño premium con textura símil cuero</li>",
        precio: 17423
    },
    {
        id: 105,
        nombre: "Auricular TWS ANC MODX-00AI XAEA (Negro)",
        categoria: "in-ear",
        color: "Negro",
        imagen: "assets/img/MANOS LIBRES TWS ANC SIMIL CUERO MODX-00AI – XAEA – NEGRO.png",
        imagenHover: "assets/img/MANOS LIBRES TWS ANC SIMIL CUERO MODX-00AI – XAEA – NEGRO1.png",
        specs: "<li><strong>Conectividad:</strong> Bluetooth V5.4 (Rango 10m)</li><li><strong>Tecnología:</strong> ANC y ENC con 4 micrófonos integrados</li><li><strong>Batería:</strong> 8 horas (Estuche de carga 400mAh)</li><li><strong>Material:</strong> Diseño premium con textura símil cuero</li>",
        precio: 17423
    },
    {
        id: 106,
        nombre: "Auricular TWS ANC MODX-00AI XAEA (Blanco)",
        categoria: "in-ear",
        color: "Blanco",
        imagen: "assets/img/MANOS LIBRES TWS ANC SIMIL CUERO MODX-00AI – XAEA – BLANCO.png",
        imagenHover: "assets/img/MANOS LIBRES TWS ANC SIMIL CUERO MODX-00AI – XAEA – BLANCO1.png",
        specs: "<li><strong>Conectividad:</strong> Bluetooth V5.4 (Rango 10m)</li><li><strong>Tecnología:</strong> ANC y ENC con 4 micrófonos integrados</li><li><strong>Batería:</strong> 8 horas (Estuche de carga 400mAh)</li><li><strong>Material:</strong> Diseño premium con textura símil cuero</li>",
        precio: 17423
    },
    {
        id: 107,
        nombre: "Auricular TWS MODX-056 Runbeat XAEA (Naranja)",
        categoria: "in-ear",
        color: "Naranja",
        imagen: "assets/img/MANOS LIBRES TWS MODX-056 RUNBEAT – XAEA.png",
        imagenHover: "assets/img/MANOS LIBRES TWS MODX-056 RUNBEAT – XAEA - NARANJA.png",
        specs: "<li><strong>Diseño:</strong> In-Ear con control táctil y micrófono</li><li><strong>Batería:</strong> 4 horas de reproducción (Estuche 200mAh, Auricular 30mAh)</li><li><strong>Carga:</strong> Puerto Tipo C</li><li><strong>Accesorios:</strong> Pulsera (modo reloj), funda de silicona y cable</li>",
        precio: 25174
    },
    {
        id: 108,
        nombre: "Auricular TWS MODX-056 Runbeat XAEA (Negro)",
        categoria: "in-ear",
        color: "Negro",
        imagen: "assets/img/MANOS LIBRES TWS MODX-056 RUNBEAT – XAEA.png",
        imagenHover: "assets/img/MANOS LIBRES TWS MODX-056 RUNBEAT – XAEA - NEGRO.png",
        specs: "<li><strong>Diseño:</strong> In-Ear con control táctil y micrófono</li><li><strong>Batería:</strong> 4 horas de reproducción (Estuche 200mAh, Auricular 30mAh)</li><li><strong>Carga:</strong> Puerto Tipo C</li><li><strong>Accesorios:</strong> Pulsera (modo reloj), funda de silicona y cable</li>",
        precio: 25174
    },
    {
        id: 109,
        nombre: "Auricular TWS MODX-056 Runbeat XAEA (Azul)",
        categoria: "in-ear",
        color: "Azul",
        imagen: "assets/img/MANOS LIBRES TWS MODX-056 RUNBEAT – XAEA.png",
        imagenHover: "assets/img/MANOS LIBRES TWS MODX-056 RUNBEAT – XAEA - AZUL.png",
        specs: "<li><strong>Diseño:</strong> In-Ear con control táctil y micrófono</li><li><strong>Batería:</strong> 4 horas de reproducción (Estuche 200mAh, Auricular 30mAh)</li><li><strong>Carga:</strong> Puerto Tipo C</li><li><strong>Accesorios:</strong> Pulsera (modo reloj), funda de silicona y cable</li>",
        precio: 25174
    },
    {
        id: 110,
        nombre: "Auricular TWS MODX-056 Runbeat XAEA (Verde)",
        categoria: "in-ear",
        color: "Verde",
        imagen: "assets/img/MANOS LIBRES TWS MODX-056 RUNBEAT – XAEA.png",
        imagenHover: "assets/img/MANOS LIBRES TWS MODX-056 RUNBEAT – XAEA - VERDE.png",
        specs: "<li><strong>Diseño:</strong> In-Ear con control táctil y micrófono</li><li><strong>Batería:</strong> 4 horas de reproducción (Estuche 200mAh, Auricular 30mAh)</li><li><strong>Carga:</strong> Puerto Tipo C</li><li><strong>Accesorios:</strong> Pulsera (modo reloj), funda de silicona y cable</li>",
        precio: 25174
    },
    {
        id: 111,
        nombre: "Auricular TWS MODX-056 Runbeat XAEA (Lila)",
        categoria: "in-ear",
        color: "Lila",
        imagen: "assets/img/MANOS LIBRES TWS MODX-056 RUNBEAT – XAEA.png",
        imagenHover: "assets/img/MANOS LIBRES TWS MODX-056 RUNBEAT – XAEA – LILA.png",
        specs: "<li><strong>Diseño:</strong> In-Ear con control táctil y micrófono</li><li><strong>Batería:</strong> 4 horas de reproducción (Estuche 200mAh, Auricular 30mAh)</li><li><strong>Carga:</strong> Puerto Tipo C</li><li><strong>Accesorios:</strong> Pulsera (modo reloj), funda de silicona y cable</li>",
        precio: 25174
    },
    {
        id: 112,
        nombre: "Auricular TWS ANC MODX-0024 XAEA (Negro)",
        categoria: "in-ear",
        color: "Negro",
        imagen: "assets/img/MANOS LIBRES TWS ANC MODX-0024 – XAEA – NEGRO.png",
        imagenHover: "assets/img/MANOS LIBRES TWS ANC MODX-0024 – XAEA – NEGRO1.png",
        specs: "<li><strong>Conectividad:</strong> Bluetooth 5.4 con control táctil</li><li><strong>Audio:</strong> Cancelación Activa de Ruido (ANC) y altavoces de 10mm</li><li><strong>Batería:</strong> Hasta 8 horas de reproducción (Estuche 380mAh, Auricular 40mAh)</li><li><strong>Extras:</strong> Pantalla indicadora LED y carga rápida (1 hora)</li>",
        precio: 14966
    },
    {
        id: 113,
        nombre: "Auricular TWS ANC MODX-0023 XAEA (Negro)",
        categoria: "in-ear",
        color: "Negro",
        imagen: "assets/img/MANOS LIBRES TWS ANC MODX-0023 – XAEA – NEGRO.png",
        imagenHover: "assets/img/MANOS LIBRES TWS ANC MODX-0023 – XAEA – NEGRO1.png",
        specs: "<li><strong>Conectividad:</strong> Bluetooth 5.4 con control táctil</li><li><strong>Audio:</strong> Cancelación Activa de Ruido (ANC) y parlantes dinámicos de 10mm</li><li><strong>Batería:</strong> 8 horas de autonomía (Estuche 380mAh, Auricular 40mAh)</li><li><strong>Extras:</strong> Luces LED y carga rápida Tipo C (1 hora)</li>",
        precio: 13301
    },
    {
        id: 114,
        nombre: "Auricular TWS ANC MODX-0023 XAEA (Blanco)",
        categoria: "in-ear",
        color: "Blanco",
        imagen: "assets/img/MANOS LIBRES TWS ANC MODX-0023 – XAEA – NEGRO.png",
        imagenHover: "assets/img/MANOS LIBRES TWS ANC MODX-0023 – XAEA – BLANCO.PNG",
        specs: "<li><strong>Conectividad:</strong> Bluetooth 5.4 con control táctil</li><li><strong>Audio:</strong> Cancelación Activa de Ruido (ANC) y parlantes dinámicos de 10mm</li><li><strong>Batería:</strong> 8 horas de autonomía (Estuche 380mAh, Auricular 40mAh)</li><li><strong>Extras:</strong> Luces LED y carga rápida Tipo C (1 hora)</li>",
        precio: 13301
    },
    {
        id: 115,
        nombre: "Auricular TWS NOX MODX-051 XAEA (Negro)",
        categoria: "in-ear",
        color: "Negro",
        imagen: "assets/img/MANOS LIBRES TWS – NOX – MODX-051 – XAEA – NEGRO.png",
        imagenHover: "assets/img/MANOS LIBRES TWS – NOX – MODX-051 – XAEA – NEGRO1.png",
        specs: "<li><strong>Conectividad:</strong> Bluetooth 5.4 con pantalla táctil multifunción</li><li><strong>Audio:</strong> Doble cancelación de ruido (ANC + ENC + EQ) y parlantes de 13mm</li><li><strong>Batería:</strong> 8 horas de reproducción (Estuche 400mAh, Auricular 40mAh)</li><li><strong>Carga:</strong> Rápida en 1 hora (Puerto Tipo C)</li>",
        precio: 21156
    },
    {
        id: 116,
        nombre: "Auricular TWS NOX MODX-051 XAEA (Blanco)",
        categoria: "in-ear",
        color: "Blanco",
        imagen: "assets/img/MANOS LIBRES TWS – NOX – MODX-051 – XAEA – BLANCO.png",
        imagenHover: "assets/img/MANOS LIBRES TWS – NOX – MODX-051 – XAEA – BLANCO1.png",
        specs: "<li><strong>Conectividad:</strong> Bluetooth 5.4 con pantalla táctil multifunción</li><li><strong>Audio:</strong> Doble cancelación de ruido (ANC + ENC + EQ) y parlantes de 13mm</li><li><strong>Batería:</strong> 8 horas de reproducción (Estuche 400mAh, Auricular 40mAh)</li><li><strong>Carga:</strong> Rápida en 1 hora (Puerto Tipo C)</li>",
        precio: 21156
    },
    {
        id: 117,
        nombre: "Auricular Manos Libres MODX-045 Thunder-C XAEA (Negro)",
        categoria: "cableado",
        color: "Negro",
        imagen: "assets/img/MANOS LIBRES – MODX-045 THUNDER-C – XAEA - NEGRO.png",
        imagenHover: "assets/img/MANOS LIBRES – MODX-045 THUNDER-C – XAEA - NEGRO1.png",
        specs: "<li><strong>Conectividad:</strong> Cable con ficha Tipo C (1 metro)</li><li><strong>Audio:</strong> Cancelación de sonido y micrófono integrado</li><li><strong>Controles:</strong> Mando integrado para volumen, canciones y llamadas</li><li><strong>Material:</strong> Plástico ABS resistente</li>",
        precio: 4441
    }
];

// =========================================
// 2. INYECTAR PRODUCTOS EN EL HTML
// =========================================
const contenedor = document.getElementById("contenedor-productos");

function cargarProductos(productosAMostrar = catalogoAuriculares) {
    let htmlGenerado = ""; 

    if (productosAMostrar.length === 0) {
        contenedor.innerHTML = '<p style="color: white; grid-column: 1 / -1; text-align: center; padding: 20px;">No se encontraron auriculares con esa búsqueda.</p>';
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
    const textoBusqueda = inputBuscador ? inputBuscador.value.toLowerCase() : "";
    const categoriaElegida = selectCategoria ? selectCategoria.value : "todos";

    const productosFiltrados = catalogoAuriculares.filter(producto => {
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
        const productoElegido = catalogoAuriculares.find(producto => producto.id === idProducto);
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
            alert("¡Tu carrito está vacío! Agrega algunos auriculares u otros productos antes de pagar.");
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
        if (modal) {
            modal.style.display = "none";
        }
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