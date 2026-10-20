// js/cotizador.js
// Cotizador de reparaciones: busca el repuesto en las listas de los proveedores
// y calcula el precio para el cliente (repuesto + ganancia + mano de obra).

import { getDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { db, auth, escaparHTML } from "./config.js";
import { cargarListas, buscar, CATALOGOS } from "./cotizador-listas.js";

const TIPOS = {
    modulo:  "Cambio de módulo",
    bateria: "Cambio de batería",
    placa:   "Cambio de pin / placa de carga",
    flex:    "Cambio de flex",
    tapa:    "Cambio de tapa trasera",
    glass:   "Cambio de glass",
};

// Valores de ejemplo: el admin los cambia en "Precios del servicio"
const AJUSTES_INICIALES = {
    ganancia: 30,
    mano: { modulo: 15000, bateria: 10000, placa: 12000, flex: 12000, tapa: 8000, glass: 20000 },
};

let ajustes = structuredClone(AJUSTES_INICIALES);
let repuestos = [];
let esAdmin = false;

const $ = id => document.getElementById(id);
const pesos = n => "$" + Math.round(n).toLocaleString("es-AR");
const precioCliente = it => Math.ceil((it.costo * (1 + ajustes.ganancia / 100) + (ajustes.mano[it.tipo] || 0)) / 500) * 500;

// ---------- ACCESO ----------
$("form-login").addEventListener("submit", async e => {
    e.preventDefault();
    $("mensaje-login").textContent = "";
    try {
        await signInWithEmailAndPassword(auth, $("input-email").value.trim(), $("input-password").value);
    } catch {
        $("mensaje-login").textContent = "Correo o contraseña incorrectos.";
    }
});
$("btn-salir").addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, async user => {
    if (!user) {
        $("seccion-cotizador").style.display = "none";
        $("seccion-login").style.display = "block";
        return;
    }
    const existe = async col => (await getDoc(doc(db, col, user.uid)).catch(() => null))?.exists();
    esAdmin = await existe("admins");
    const esTecnico = esAdmin || await existe("tecnicos");
    if (!esTecnico) {
        $("mensaje-login").textContent = "Esta cuenta no tiene acceso al cotizador.";
        await signOut(auth);
        return;
    }
    $("seccion-login").style.display = "none";
    $("seccion-cotizador").style.display = "block";
    $("cot-ajustes").style.display = esAdmin ? "block" : "none";

    const guardado = await getDoc(doc(db, "config", "cotizador")).catch(() => null);
    if (guardado?.exists()) {
        const d = guardado.data();
        ajustes = { ganancia: d.ganancia ?? AJUSTES_INICIALES.ganancia, mano: { ...AJUSTES_INICIALES.mano, ...(d.mano || {}) } };
    }
    if (esAdmin) dibujarAjustes();
    actualizarListas();
    $("cot-buscar").focus();
});

// ---------- LISTAS ----------
async function actualizarListas() {
    $("cot-estado").textContent = "Cargando listas de proveedores…";
    const { items, fallas } = await cargarListas();
    repuestos = items;
    const hora = new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    $("cot-estado").textContent = `${items.length.toLocaleString("es-AR")} repuestos · actualizado ${hora}` +
        (fallas.length ? ` · ⚠️ no cargó: ${fallas.join(", ")}` : "");
    mostrar();
}
$("btn-recargar").addEventListener("click", actualizarListas);

// ---------- BÚSQUEDA ----------
let espera;
$("cot-buscar").addEventListener("input", () => { clearTimeout(espera); espera = setTimeout(mostrar, 200); });
$("cot-tipo").addEventListener("change", mostrar);
$("cot-disponibles").addEventListener("change", mostrar);

function mostrar() {
    const texto = $("cot-buscar").value.trim();
    const tipo = $("cot-tipo").value;
    const soloDisp = $("cot-disponibles").checked;

    $("cot-links").innerHTML = texto
        ? "<span style='color:#888;font-size:.85rem;align-self:center;'>Ver también en:</span>" +
          CATALOGOS.map(c => `<a href="${c.url(texto)}" target="_blank" rel="noopener">${c.nombre} ↗</a>`).join("")
        : "";

    if (!texto) { $("cot-resultados").innerHTML = "<p style='color:#888;'>Escribí el modelo del equipo para ver los repuestos.</p>"; return; }

    let lista = buscar(repuestos, texto);
    if (tipo) lista = lista.filter(it => it.tipo === tipo);
    if (soloDisp) lista = lista.filter(it => !it.stock.startsWith("AGOTADO"));
    const peso = it => it.stock.startsWith("AGOTADO") ? 1 : 0;
    const orden = Object.keys(TIPOS);
    lista.sort((a, b) => orden.indexOf(a.tipo) - orden.indexOf(b.tipo) || peso(a) - peso(b) || a.costo - b.costo);

    if (!lista.length) { $("cot-resultados").innerHTML = "<p style='color:#888;'>No encontré ese modelo en las listas. Probá con menos palabras (ej: \"A15\") o mirá en Byte / JM.</p>"; return; }

    $("cot-resultados").innerHTML = lista.slice(0, 150).map((it, i) => {
        const st = it.stock;
        const etiqueta = !st ? "" : st.startsWith("AGOTADO") ? `<span class="cot-tag no">Agotado</span>`
            : st.startsWith("OFERTA") ? `<span class="cot-tag of">Oferta</span>` : `<span class="cot-tag ok">Disponible</span>`;
        return `<div class="cot-item ${st.startsWith("AGOTADO") ? "agotado" : ""}">
            <div>
                <div class="cot-modelo">${escaparHTML(it.modelo)}</div>
                <div class="cot-det">${escaparHTML(it.detalle || "")}</div>
                <div class="cot-tags"><span class="cot-tag">${TIPOS[it.tipo]}</span><span class="cot-tag">${escaparHTML(it.prov)}</span>${etiqueta}</div>
            </div>
            <div class="cot-precio">
                <div class="cot-final">${pesos(precioCliente(it))}</div>
                <div class="cot-costo">repuesto ${pesos(it.costo)}</div>
            </div>
            <button class="cot-wa" data-i="${i}">📲 Enviar presupuesto</button>
        </div>`;
    }).join("") + (lista.length > 150 ? `<p style="color:#888;">Hay ${lista.length} resultados: escribí más precisión para ver menos.</p>` : "");

    $("cot-resultados").querySelectorAll(".cot-wa").forEach(b => b.addEventListener("click", () => {
        const it = lista[+b.dataset.i];
        const texto = `Hola! 👋 Te paso el presupuesto de *TechMarea* 🔧\n\n` +
            `📱 Equipo: ${it.modelo}\n🛠️ Reparación: ${TIPOS[it.tipo]}${it.detalle ? ` (${it.detalle})` : ""}\n` +
            `💲 Precio: *${pesos(precioCliente(it))}* (repuesto + mano de obra)\n\n` +
            `Precio sujeto a disponibilidad del repuesto. Sarmiento 15, Maipú.`;
        window.open("https://wa.me/?text=" + encodeURIComponent(texto), "_blank");
    }));
}

// ---------- AJUSTES (solo admin) ----------
function dibujarAjustes() {
    const fila = (id, txt, val) => `<div class="fila"><label for="${id}">${txt}</label><input type="number" min="0" step="500" id="${id}" value="${val}"></div>`;
    $("cot-campos").innerHTML =
        `<div class="fila"><label for="aj-ganancia">Ganancia sobre el repuesto (%)</label><input type="number" min="0" step="5" id="aj-ganancia" value="${ajustes.ganancia}"></div>` +
        Object.entries(TIPOS).map(([k, t]) => fila("aj-" + k, "Mano de obra · " + t.replace("Cambio de ", ""), ajustes.mano[k])).join("");
}

$("btn-guardar-ajustes").addEventListener("click", async () => {
    const nuevo = { ganancia: Number($("aj-ganancia").value) || 0, mano: {} };
    for (const k of Object.keys(TIPOS)) nuevo.mano[k] = Number($("aj-" + k).value) || 0;
    try {
        await setDoc(doc(db, "config", "cotizador"), nuevo);
        ajustes = nuevo;
        $("msg-ajustes").textContent = "✔ Guardado";
        mostrar();
    } catch (e) {
        console.error(e);
        $("msg-ajustes").textContent = "No se pudo guardar (¿publicaste las reglas?)";
    }
    setTimeout(() => $("msg-ajustes").textContent = "", 3000);
});
