// =========================================
// INICIALIZACIÓN DE FIREBASE
// =========================================
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { db, auth, pagarConMercadoPago, WHATSAPP } from "./config.js";

// =========================================
// 1. BASE DE DATOS DE PRODUCTOS (POWERBANKS: 400 - 499)
// =========================================
const catalogoFundas = [
    { id: 800, nombre: "Funda iPhone 13 Pro - 2 Colores (Lila / Rosa)", marca: "iPhone", modelo: "13 Pro", detalle: "2 Colores · Lila / Rosa", precio: 9000 },
    { id: 801, nombre: "Funda iPhone 14 - Cuadrado MagSafe (Dorado)", marca: "iPhone", modelo: "14", detalle: "Cuadrado MagSafe · Dorado", precio: 17000 },
    { id: 802, nombre: "Funda iPhone 15 - Cuadrado MagSafe (Blanco)", marca: "iPhone", modelo: "15", detalle: "Cuadrado MagSafe · Blanco", precio: 17000 },
    { id: 803, nombre: "Funda iPhone 15 - Cuadrado MagSafe (Dorado)", marca: "iPhone", modelo: "15", detalle: "Cuadrado MagSafe · Dorado", precio: 17000 },
    { id: 804, nombre: "Funda iPhone 15 - MagSafe Urban Play (Blanco)", marca: "iPhone", modelo: "15", detalle: "MagSafe Urban Play · Blanco", precio: 15000 },
    { id: 805, nombre: "Funda iPhone 15 - MagSafe Urban Play (Violeta)", marca: "iPhone", modelo: "15", detalle: "MagSafe Urban Play · Violeta", precio: 15000 },
    { id: 806, nombre: "Funda iPhone 15 - Ondulado Transparente (Negro)", marca: "iPhone", modelo: "15", detalle: "Ondulado Transparente · Negro", precio: 11000 },
    { id: 807, nombre: "Funda iPhone 15 - Ondulado Transparente (Violeta)", marca: "iPhone", modelo: "15", detalle: "Ondulado Transparente · Violeta", precio: 11000 },
    { id: 808, nombre: "Funda iPhone 15 Pro - Brilloso (Transparente)", marca: "iPhone", modelo: "15 Pro", detalle: "Brilloso · Transparente", precio: 10000 },
    { id: 809, nombre: "Funda iPhone 15 Pro - Silicon Pro (Rosa)", marca: "iPhone", modelo: "15 Pro", detalle: "Silicon Pro · Rosa", precio: 9000 },
    { id: 810, nombre: "Funda iPhone 15 Pro Max - Cuadrado MagSafe (Blanco)", marca: "iPhone", modelo: "15 Pro Max", detalle: "Cuadrado MagSafe · Blanco", precio: 17000 },
    { id: 811, nombre: "Funda iPhone 15 Pro Max - Cuadrado MagSafe (Negro)", marca: "iPhone", modelo: "15 Pro Max", detalle: "Cuadrado MagSafe · Negro", precio: 17000 },
    { id: 812, nombre: "Funda iPhone 16 - Cristal X", marca: "iPhone", modelo: "16", detalle: "Cristal X", precio: 9000 },
    { id: 813, nombre: "Funda iPhone 16 - Cuadrado MagSafe (Blanco)", marca: "iPhone", modelo: "16", detalle: "Cuadrado MagSafe · Blanco", precio: 17000 },
    { id: 814, nombre: "Funda iPhone 16 - Cuadrado MagSafe (Dorado)", marca: "iPhone", modelo: "16", detalle: "Cuadrado MagSafe · Dorado", precio: 17000 },
    { id: 815, nombre: "Funda iPhone 16 - Cuadrado MagSafe (Negro)", marca: "iPhone", modelo: "16", detalle: "Cuadrado MagSafe · Negro", precio: 17000 },
    { id: 816, nombre: "Funda iPhone 16 - MagSafe Cosmic (Azul)", marca: "iPhone", modelo: "16", detalle: "MagSafe Cosmic · Azul", precio: 15000 },
    { id: 817, nombre: "Funda iPhone 16 - MagSafe Urban Play (Azul)", marca: "iPhone", modelo: "16", detalle: "MagSafe Urban Play · Azul", precio: 15000 },
    { id: 818, nombre: "Funda iPhone 16 - MagSafe Urban Play (Negro)", marca: "iPhone", modelo: "16", detalle: "MagSafe Urban Play · Negro", precio: 15000 },
    { id: 819, nombre: "Funda iPhone 16 - MagSafe Urban Play (Violeta)", marca: "iPhone", modelo: "16", detalle: "MagSafe Urban Play · Violeta", precio: 15000 },
    { id: 820, nombre: "Funda iPhone 16 - Ondulado Transparente (Rosa)", marca: "iPhone", modelo: "16", detalle: "Ondulado Transparente · Rosa", precio: 11000 },
    { id: 821, nombre: "Funda iPhone 16 - Silicona Lens (Rosa)", marca: "iPhone", modelo: "16", detalle: "Silicona Lens · Rosa", precio: 11000 },
    { id: 822, nombre: "Funda iPhone 16 Pro - Cuadrado MagSafe (Dorado)", marca: "iPhone", modelo: "16 Pro", detalle: "Cuadrado MagSafe · Dorado", precio: 17000 },
    { id: 823, nombre: "Funda iPhone 16 Pro - Espacio MagSafe (Gris)", marca: "iPhone", modelo: "16 Pro", detalle: "Espacio MagSafe · Gris", precio: 15000 },
    { id: 824, nombre: "Funda iPhone 16 Pro - MagSafe Cosmic (Negro)", marca: "iPhone", modelo: "16 Pro", detalle: "MagSafe Cosmic · Negro", precio: 15000 },
    { id: 825, nombre: "Funda iPhone 16 Pro - MagSafe Urban Play (Blanco)", marca: "iPhone", modelo: "16 Pro", detalle: "MagSafe Urban Play · Blanco", precio: 15000 },
    { id: 826, nombre: "Funda iPhone 16 Pro - Silicona Lens (Lila)", marca: "iPhone", modelo: "16 Pro", detalle: "Silicona Lens · Lila", precio: 11000 },
    { id: 827, nombre: "Funda iPhone 16 Pro - Silicona Lens (Negro)", marca: "iPhone", modelo: "16 Pro", detalle: "Silicona Lens · Negro", precio: 11000 },
    { id: 828, nombre: "Funda iPhone 16 Pro - Silicona Lens (Verde)", marca: "iPhone", modelo: "16 Pro", detalle: "Silicona Lens · Verde", precio: 11000 },
    { id: 829, nombre: "Funda iPhone 16 Pro Max - Cuadrado MagSafe (Dorado)", marca: "iPhone", modelo: "16 Pro Max", detalle: "Cuadrado MagSafe · Dorado", precio: 17000 },
    { id: 830, nombre: "Funda iPhone 16 Pro Max - Cuadrado MagSafe (Negro)", marca: "iPhone", modelo: "16 Pro Max", detalle: "Cuadrado MagSafe · Negro", precio: 17000 },
    { id: 831, nombre: "Funda iPhone 16 Pro Max - Shade (Marrón)", marca: "iPhone", modelo: "16 Pro Max", detalle: "Shade · Marrón", precio: 11000 },
    { id: 832, nombre: "Funda iPhone 16 Pro Max - Silicona Lens (Negro)", marca: "iPhone", modelo: "16 Pro Max", detalle: "Silicona Lens · Negro", precio: 11000 },
    { id: 833, nombre: "Funda iPhone 16 Pro Max - Silicone Valley (Azul)", marca: "iPhone", modelo: "16 Pro Max", detalle: "Silicone Valley · Azul", precio: 9000 },
    { id: 834, nombre: "Funda iPhone 17 - Espacio MagSafe (Negro)", marca: "iPhone", modelo: "17", detalle: "Espacio MagSafe · Negro", precio: 15000 },
    { id: 835, nombre: "Funda iPhone 17 - MagSafe Cosmic (Blanco)", marca: "iPhone", modelo: "17", detalle: "MagSafe Cosmic · Blanco", precio: 15000 },
    { id: 836, nombre: "Funda iPhone 17 - MagSafe Cosmic (Negro)", marca: "iPhone", modelo: "17", detalle: "MagSafe Cosmic · Negro", precio: 15000 },
    { id: 837, nombre: "Funda iPhone 17 - MagSafe Urban Play (Blanco)", marca: "iPhone", modelo: "17", detalle: "MagSafe Urban Play · Blanco", precio: 15000 },
    { id: 838, nombre: "Funda iPhone 17 - MagSafe Urban Play (Negro)", marca: "iPhone", modelo: "17", detalle: "MagSafe Urban Play · Negro", precio: 15000 },
    { id: 839, nombre: "Funda iPhone 17 Air - Espacio MagSafe (Gris)", marca: "iPhone", modelo: "17 Air", detalle: "Espacio MagSafe · Gris", precio: 15000 },
    { id: 840, nombre: "Funda iPhone 17 Air - MagSafe Cosmic (Negro)", marca: "iPhone", modelo: "17 Air", detalle: "MagSafe Cosmic · Negro", precio: 15000 },
    { id: 841, nombre: "Funda iPhone 17 Air - MagSafe Urban Play (Negro)", marca: "iPhone", modelo: "17 Air", detalle: "MagSafe Urban Play · Negro", precio: 15000 },
    { id: 842, nombre: "Funda iPhone 17 Pro - Espacio MagSafe (Azul)", marca: "iPhone", modelo: "17 Pro", detalle: "Espacio MagSafe · Azul", precio: 15000 },
    { id: 843, nombre: "Funda iPhone 17 Pro - Espacio MagSafe (Rosa)", marca: "iPhone", modelo: "17 Pro", detalle: "Espacio MagSafe · Rosa", precio: 15000 },
    { id: 844, nombre: "Funda iPhone 17 Pro - MagSafe Cosmic (Azul)", marca: "iPhone", modelo: "17 Pro", detalle: "MagSafe Cosmic · Azul", precio: 15000 },
    { id: 845, nombre: "Funda iPhone 17 Pro - Silicona Lens (Lila)", marca: "iPhone", modelo: "17 Pro", detalle: "Silicona Lens · Lila", precio: 11000 },
    { id: 846, nombre: "Funda iPhone 17 Pro - Silicona Lens (Rosa)", marca: "iPhone", modelo: "17 Pro", detalle: "Silicona Lens · Rosa", precio: 11000 },
    { id: 847, nombre: "Funda iPhone 17 Pro Max - Shade (Azul)", marca: "iPhone", modelo: "17 Pro Max", detalle: "Shade · Azul", precio: 11000 },
    { id: 848, nombre: "Funda iPhone 17 Pro Max - Shade (Marrón)", marca: "iPhone", modelo: "17 Pro Max", detalle: "Shade · Marrón", precio: 11000 },
    { id: 849, nombre: "Funda Samsung A05 - Espacio (Gris)", marca: "Samsung", modelo: "A05", detalle: "Espacio · Gris", precio: 9000 },
    { id: 850, nombre: "Funda Samsung A05 - Silicona Color (Azul)", marca: "Samsung", modelo: "A05", detalle: "Silicona Color · Azul", precio: 9000 },
    { id: 851, nombre: "Funda Samsung A07 - Brilloso (Marrón)", marca: "Samsung", modelo: "A07", detalle: "Brilloso · Marrón", precio: 9000 },
    { id: 852, nombre: "Funda Samsung A07 - Clear", marca: "Samsung", modelo: "A07", detalle: "Clear", precio: 9000 },
    { id: 853, nombre: "Funda Samsung A07 - Silicona Color (Azul)", marca: "Samsung", modelo: "A07", detalle: "Silicona Color · Azul", precio: 9000 },
    { id: 854, nombre: "Funda Samsung A17 - Brilloso (Gris)", marca: "Samsung", modelo: "A17", detalle: "Brilloso · Gris", precio: 9000 },
    { id: 855, nombre: "Funda Samsung A17 - Silicona Wavy (Negro)", marca: "Samsung", modelo: "A17", detalle: "Silicona Wavy · Negro", precio: 6000 },
    { id: 856, nombre: "Funda Samsung A24 - Classic Color (Negro)", marca: "Samsung", modelo: "A24", detalle: "Classic Color · Negro", precio: 9000 },
    { id: 857, nombre: "Funda Samsung A24 - Espacio (Negro mate)", marca: "Samsung", modelo: "A24", detalle: "Espacio · Negro mate", precio: 9000 },
    { id: 858, nombre: "Funda Samsung A24 - Espacio (Rosa)", marca: "Samsung", modelo: "A24", detalle: "Espacio · Rosa", precio: 9000 },
    { id: 859, nombre: "Funda Samsung A24 - Simil Silicone (Negro)", marca: "Samsung", modelo: "A24", detalle: "Simil Silicone · Negro", precio: 9000 },
    { id: 860, nombre: "Funda Samsung A24 - Simil Silicone (Rosa)", marca: "Samsung", modelo: "A24", detalle: "Simil Silicone · Rosa", precio: 9000 },
    { id: 861, nombre: "Funda Samsung A34 - Cristal X", marca: "Samsung", modelo: "A34", detalle: "Cristal X", precio: 9000 },
    { id: 862, nombre: "Funda Samsung A34 - Espacio (Azul)", marca: "Samsung", modelo: "A34", detalle: "Espacio · Azul", precio: 9000 },
    { id: 863, nombre: "Funda Samsung A34 - Espacio (Negro mate)", marca: "Samsung", modelo: "A34", detalle: "Espacio · Negro mate", precio: 9000 },
    { id: 864, nombre: "Funda Samsung A34 - Flat Mate (Rojo)", marca: "Samsung", modelo: "A34", detalle: "Flat Mate · Rojo", precio: 9000 },
    { id: 865, nombre: "Funda Samsung A35 5G - Antishock", marca: "Samsung", modelo: "A35 5G", detalle: "Antishock", precio: 9000 },
    { id: 866, nombre: "Funda Samsung A55 - Silicona Color (Fucsia)", marca: "Samsung", modelo: "A55", detalle: "Silicona Color · Fucsia", precio: 9000 },
    { id: 867, nombre: "Funda Samsung A55 - Silicona Color (Rosa)", marca: "Samsung", modelo: "A55", detalle: "Silicona Color · Rosa", precio: 9000 },
    { id: 868, nombre: "Funda Samsung S23 Plus - Cristal X", marca: "Samsung", modelo: "S23 Plus", detalle: "Cristal X", precio: 9000 },
    { id: 869, nombre: "Funda Samsung S25 - Cristal X", marca: "Samsung", modelo: "S25", detalle: "Cristal X", precio: 9000 },
    { id: 870, nombre: "Funda Samsung S25 - Espacio MagSafe (Gris)", marca: "Samsung", modelo: "S25", detalle: "Espacio MagSafe · Gris", precio: 11000 },
    { id: 871, nombre: "Funda Samsung S25 - Espacio MagSafe (Negro)", marca: "Samsung", modelo: "S25", detalle: "Espacio MagSafe · Negro", precio: 11000 },
    { id: 872, nombre: "Funda Samsung S25 - Ondulado Transparente (Negro)", marca: "Samsung", modelo: "S25", detalle: "Ondulado Transparente · Negro", precio: 11000 },
    { id: 873, nombre: "Funda Samsung S25 Edge - MagSafe Cristal (Transparente)", marca: "Samsung", modelo: "S25 Edge", detalle: "MagSafe Cristal · Transparente", precio: 11000 },
    { id: 874, nombre: "Funda Samsung S25 FE - Ondulado Transparente (Negro)", marca: "Samsung", modelo: "S25 FE", detalle: "Ondulado Transparente · Negro", precio: 11000 },
    { id: 875, nombre: "Funda Samsung S25 Plus - Ondulado Transparente (Negro)", marca: "Samsung", modelo: "S25 Plus", detalle: "Ondulado Transparente · Negro", precio: 11000 },
    { id: 876, nombre: "Funda Samsung S26 - Shade (Marrón)", marca: "Samsung", modelo: "S26", detalle: "Shade · Marrón", precio: 11000 },
    { id: 877, nombre: "Funda Samsung S26 Edge - MagSafe Cristal (Transparente)", marca: "Samsung", modelo: "S26 Edge", detalle: "MagSafe Cristal · Transparente", precio: 11000 },
    { id: 878, nombre: "Funda Motorola Edge 50 Pro - Silicona Color (Fucsia)", marca: "Motorola", modelo: "Edge 50 Pro", detalle: "Silicona Color · Fucsia", precio: 9000 },
    { id: 879, nombre: "Funda Motorola G14 - Cristal X", marca: "Motorola", modelo: "G14", detalle: "Cristal X", precio: 9000 },
    { id: 880, nombre: "Funda Motorola G35 / G35 5G - Silicona Color (Blanco)", marca: "Motorola", modelo: "G35 / G35 5G", detalle: "Silicona Color · Blanco", precio: 9000 },
    { id: 881, nombre: "Funda Motorola G42 - Espacio (Celeste)", marca: "Motorola", modelo: "G42", detalle: "Espacio · Celeste", precio: 9000 },
    { id: 882, nombre: "Funda Motorola G42 - Espacio (Negro mate)", marca: "Motorola", modelo: "G42", detalle: "Espacio · Negro mate", precio: 9000 },
    { id: 883, nombre: "Funda Motorola G72 - Cristal X", marca: "Motorola", modelo: "G72", detalle: "Cristal X", precio: 9000 },
    { id: 884, nombre: "Funda Motorola G72 - Espacio (Negro mate)", marca: "Motorola", modelo: "G72", detalle: "Espacio · Negro mate", precio: 9000 },
    { id: 885, nombre: "Funda Motorola G72 - Silicon Pro (Gris)", marca: "Motorola", modelo: "G72", detalle: "Silicon Pro · Gris", precio: 9000 },
    { id: 886, nombre: "Funda Motorola G84 - Antishock", marca: "Motorola", modelo: "G84", detalle: "Antishock", precio: 9000 },
    { id: 887, nombre: "Funda Motorola G85 - Silicona Color (Rosa)", marca: "Motorola", modelo: "G85", detalle: "Silicona Color · Rosa", precio: 9000 },
    { id: 888, nombre: "Funda Motorola G86 - Brilloso (Gris)", marca: "Motorola", modelo: "G86", detalle: "Brilloso · Gris", precio: 9000 },
    { id: 889, nombre: "Funda Xiaomi Redmi Note 14 - Espacio (Negro)", marca: "Xiaomi", modelo: "Redmi Note 14", detalle: "Espacio · Negro", precio: 9000 },
    { id: 890, nombre: "Funda Xiaomi Redmi Note 14 Pro - Brilloso (Gris)", marca: "Xiaomi", modelo: "Redmi Note 14 Pro", detalle: "Brilloso · Gris", precio: 9000 },
    { id: 891, nombre: "Funda Xiaomi Redmi Note 14 Pro - Espacio (Negro)", marca: "Xiaomi", modelo: "Redmi Note 14 Pro", detalle: "Espacio · Negro", precio: 9000 },
    { id: 892, nombre: "Funda Xiaomi Redmi Note 14 Pro - Textura Rombo (Transparente)", marca: "Xiaomi", modelo: "Redmi Note 14 Pro", detalle: "Textura Rombo · Transparente", precio: 9000 },
    { id: 893, nombre: "Funda Xiaomi Redmi 15C - Brilloso (Gris)", marca: "Xiaomi", modelo: "Redmi 15C", detalle: "Brilloso · Gris", precio: 9000 },
    { id: 894, nombre: "Funda Xiaomi Redmi 15C - Shade (Marrón)", marca: "Xiaomi", modelo: "Redmi 15C", detalle: "Shade · Marrón", precio: 9000 },
    { id: 895, nombre: "Funda Xiaomi Redmi Note 15 - Shade (Azul)", marca: "Xiaomi", modelo: "Redmi Note 15", detalle: "Shade · Azul", precio: 9000 },
    { id: 896, nombre: "Funda Xiaomi Redmi Note 15 Pro - Shade (Marrón)", marca: "Xiaomi", modelo: "Redmi Note 15 Pro", detalle: "Shade · Marrón", precio: 9000 },
    { id: 897, nombre: "Funda Xiaomi Redmi Note 15 Pro - Silicona Color (Negro)", marca: "Xiaomi", modelo: "Redmi Note 15 Pro", detalle: "Silicona Color · Negro", precio: 9000 }
];

// =========================================
// 2. TARJETAS DE FUNDAS (una por marca, con selector de modelo y color)
// =========================================
const contenedor = document.getElementById("contenedor-productos");
const MARCAS = ["iPhone", "Samsung", "Motorola", "Xiaomi"];
const fmt = n => "$" + n.toLocaleString("es-AR");

function cargarProductos(productosAMostrar = catalogoFundas) {
    let htmlGenerado = "";
    for (const marca of MARCAS) {
        const fundas = productosAMostrar.filter(p => p.marca === marca);
        if (fundas.length === 0) continue;
        const minimo = Math.min(...fundas.map(p => p.precio));
        const opciones = fundas.map(p => `<option value="${p.id}">${p.marca === "iPhone" ? "iPhone " : ""}${p.modelo} — ${p.detalle} — ${fmt(p.precio)}</option>`).join("");
        htmlGenerado += `
            <article class="tarjeta-articulo">
                <img src="assets/img/fundas-local.webp" alt="Fundas ${marca}" class="imagen-articulo img-producto">
                <div class="info-articulo">
                    <h3>Fundas ${marca}</h3>
                    <ul class="lista-specs"><li><strong>Disponibles:</strong> ${fundas.length} modelos y colores</li><li><strong>Tip:</strong> sumale un vidrio templado para proteger la pantalla</li></ul>
                    <select class="select-categoria select-modelo" data-marca="${marca}" style="width: 100%; margin: 10px 0;">
                        <option value="">Elegí modelo y color (${fundas.length})</option>${opciones}
                    </select>
                    <span class="precio" data-marca="${marca}">Desde ${fmt(minimo)}</span>
                    <button class="btn-neon-pequeno btn-agregar" data-marca="${marca}" style="width: 100%; border: none; cursor: pointer; font-family: inherit;">
                        Agregar al carrito
                    </button>
                </div>
            </article>`;
    }
    if (!htmlGenerado) {
        htmlGenerado = '<p style="color: white; grid-column: 1 / -1; text-align: center; padding: 20px;">No tenemos funda para ese modelo en stock. Consultanos por WhatsApp.</p>';
    }
    contenedor.innerHTML = htmlGenerado;

    contenedor.querySelectorAll(".select-modelo").forEach(select => {
        select.addEventListener("change", () => {
            const precio = contenedor.querySelector(`.precio[data-marca="${select.dataset.marca}"]`);
            const elegido = catalogoFundas.find(p => p.id === parseInt(select.value));
            if (elegido) precio.textContent = fmt(elegido.precio);
        });
    });

    contenedor.querySelectorAll(".btn-agregar").forEach(boton => {
        boton.addEventListener("click", () => {
            const select = contenedor.querySelector(`.select-modelo[data-marca="${boton.dataset.marca}"]`);
            if (!select.value) {
                alert("Primero elegí el modelo de tu celular y el color.");
                select.focus();
                return;
            }
            agregarAlCarrito(parseInt(select.value));
        });
    });
}

// =========================================
// 3. BÚSQUEDA POR MODELO Y FILTRO POR MARCA
// =========================================
const inputBuscador = document.getElementById("buscador-productos");
const selectCategoria = document.getElementById("filtro-categorias");

function filtrarCatalogo() {
    const textoBusqueda = inputBuscador ? inputBuscador.value.toLowerCase().trim() : "";
    const marcaElegida = selectCategoria ? selectCategoria.value : "todos";
    cargarProductos(catalogoFundas.filter(p =>
        (p.modelo + " " + p.detalle).toLowerCase().includes(textoBusqueda) &&
        (marcaElegida === "todos" || p.marca === marcaElegida)));
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
        const productoElegido = catalogoFundas.find(producto => producto.id === idProducto);
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
        let mensaje = "¡Hola TechMarea! 🌊 Quiero realizar el siguiente pedido:\n\n";
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