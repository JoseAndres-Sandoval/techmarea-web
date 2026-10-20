// js/cotizador-listas.js
// Lee las listas de precios de los proveedores (Google Sheets públicos) y las
// convierte en una lista de repuestos: { prov, tipo, seccion, modelo, detalle, costo, stock }.

const TECNI = "1bXzml7I5grDxY9f-Z4opKdE09Sn4q1vjrmCmxe0S6pA";
const MUNDO = "2PACX-1vToiT9OfYalWlx7IRR_V1xGhM-Y_DyBMfgImEohED4JWcsydp34dz2pc2lOHMc199Z0ShNEyglsPzud";

// Cada hoja: proveedor, tipo de reparación y dirección del CSV
export const HOJAS = [
    { prov: "TecniShop", tipo: "modulo",  url: `https://docs.google.com/spreadsheets/d/${TECNI}/export?format=csv&gid=348069199` },
    { prov: "TecniShop", tipo: "bateria", url: `https://docs.google.com/spreadsheets/d/${TECNI}/export?format=csv&gid=1043432666` },
    { prov: "TecniShop", tipo: "placa",   url: `https://docs.google.com/spreadsheets/d/${TECNI}/export?format=csv&gid=79850991` },
    { prov: "TecniShop", tipo: "flex",    url: `https://docs.google.com/spreadsheets/d/${TECNI}/export?format=csv&gid=1476951579` },
    { prov: "TecniShop", tipo: "tapa",    url: `https://docs.google.com/spreadsheets/d/${TECNI}/export?format=csv&gid=1000603352` },
    { prov: "TecniShop", tipo: "glass",   url: `https://docs.google.com/spreadsheets/d/${TECNI}/export?format=csv&gid=269410896` },
    { prov: "MundoSim",  tipo: "bateria", url: `https://docs.google.com/spreadsheets/d/e/${MUNDO}/pub?single=true&output=csv&gid=525076416` },
    { prov: "MundoSim",  tipo: "modulo",  url: `https://docs.google.com/spreadsheets/d/e/${MUNDO}/pub?single=true&output=csv&gid=1867582402` },
    { prov: "MundoSim",  tipo: "modulo",  url: `https://docs.google.com/spreadsheets/d/e/${MUNDO}/pub?single=true&output=csv&gid=1879066283` },
    { prov: "MundoSim",  tipo: "modulo",  url: `https://docs.google.com/spreadsheets/d/e/${MUNDO}/pub?single=true&output=csv&gid=1084880804` },
    { prov: "MundoSim",  tipo: "modulo",  url: `https://docs.google.com/spreadsheets/d/e/${MUNDO}/pub?single=true&output=csv&gid=832320919` },
    { prov: "MundoSim",  tipo: "glass",   url: `https://docs.google.com/spreadsheets/d/e/${MUNDO}/pub?single=true&output=csv&gid=1403650382` },
    { prov: "MundoSim",  tipo: "placa",   url: `https://docs.google.com/spreadsheets/d/e/${MUNDO}/pub?single=true&output=csv&gid=1022844298` },
];

// Proveedores que no tienen planilla: se abren con el modelo ya buscado
export const CATALOGOS = [
    { nombre: "Byte Catamarca", url: q => `https://catalogo.duxsoftware.com.ar/byterepuestos?productSearch=${encodeURIComponent(q)}&page=1` },
    { nombre: "Byte Lavalle",   url: q => `https://catalogo.duxsoftware.com.ar/byterepuestoslavalle?productSearch=${encodeURIComponent(q)}&page=1` },
    { nombre: "JM Celulares",   url: () => "https://jmcelulares.com.ar/lista" },
];

// ---------- CSV ----------
export function leerCSV(texto) {
    const filas = []; let fila = []; let celda = ""; let comillas = false;
    for (let i = 0; i < texto.length; i++) {
        const c = texto[i];
        if (comillas) {
            if (c === '"') { if (texto[i + 1] === '"') { celda += '"'; i++; } else comillas = false; }
            else celda += c;
        } else if (c === '"') comillas = true;
        else if (c === ',') { fila.push(celda); celda = ""; }
        else if (c === '\n' || c === '\r') {
            if (c === '\r' && texto[i + 1] === '\n') i++;
            fila.push(celda); filas.push(fila); fila = []; celda = "";
        } else celda += c;
    }
    if (celda || fila.length) { fila.push(celda); filas.push(fila); }
    return filas;
}

const esPrecio = s => /^\$\s*\d{1,3}(\.\d{3})+$|^\$\s*\d+$/.test(s);
const esStock = s => /^(DISPONIBLE|AGOTADO|OFERTA|SIN STOCK|PROXIMAMENTE|CONSULTAR)/i.test(s);
const sinPrecio = s => /^-+$/.test(s) || /^PROXIMAMENTE$/i.test(s);
const ETIQUETAS = /^(MODELO|CALIDAD|PRECIO|VALOR|COLOR|STOCK|MUESTRA)$/i;
const VARIANTE = /ORIG|MARCO|OLED|INCELL|AMOLED|BLACK|PLUG|CORE/i;
const aNumero = s => parseInt(s.replace(/[^\d]/g, ""), 10);

// Convierte una hoja (filas del CSV) en repuestos
export function leerHoja(filas, prov, tipo) {
    const items = [];
    let encabezado = [];
    let seccion = "";
    const ultimo = {}; // por columna de precio: { col, modelo } para filas que siguen con el mismo modelo

    for (const filaCruda of filas) {
        const celdas = filaCruda.map(c => (c || "").replace(/\s+/g, " ").trim());
        const precios = celdas.map((c, i) => esPrecio(c) ? i : -1).filter(i => i >= 0);

        if (!precios.length) {
            if (celdas.some(sinPrecio)) continue;           // modelo sin precio: se saltea
            const llenas = celdas.filter(Boolean);
            if (!llenas.length) continue;
            if (llenas.length === 1) { if (llenas[0].length <= 40 && !ETIQUETAS.test(llenas[0])) { seccion = llenas[0]; encabezado = []; } }
            else if (llenas.every(c => c.length <= 40)) encabezado = celdas;
            continue;
        }

        let inicio = 0, modeloFila = null;
        for (const p of precios) {
            const tramo = [];
            let stock = "";
            for (let i = inicio; i < p; i++) {
                const c = celdas[i];
                if (!c) continue;
                if (sinPrecio(c) || esStock(c)) { tramo.length = 0; continue; } // termina el bloque de al lado
                tramo.push([i, c]);
            }
            // Si hay un hueco, el texto de la izquierda es de otro bloque: queda solo el último grupo
            for (let k = tramo.length - 1; k > 0; k--) {
                if (tramo[k][0] - tramo[k - 1][0] > 1) { tramo.splice(0, k); break; }
            }
            let modelo, detalle = [];
            const previo = ultimo[p];
            if (!tramo.length) {
                modelo = modeloFila;
            } else if (tramo.length === 1 && previo && tramo[0][0] > previo.col) {
                modelo = previo.modelo; detalle.push(tramo[0][1]);
            } else {
                modelo = tramo[0][1]; detalle = tramo.slice(1).map(t => t[1]);
                ultimo[p] = { col: tramo[0][0], modelo };
            }
            if (modelo && ETIQUETAS.test(modelo) && detalle.length) modelo = detalle.shift();
            if (!modelo) { inicio = p + 1; continue; }
            modeloFila = modelo;

            const cab = encabezado[p] || "";
            if (VARIANTE.test(cab)) detalle.push(cab);
            if (celdas[p + 1] && esStock(celdas[p + 1])) stock = celdas[p + 1];

            const colModelo = ultimo[p]?.col ?? inicio;
            const marca = encabezado[colModelo] && !ETIQUETAS.test(encabezado[colModelo]) ? encabezado[colModelo] : seccion;

            items.push({ prov, tipo, seccion: marca, modelo, detalle: detalle.join(" · "), costo: aNumero(celdas[p]), stock: stock.toUpperCase() });
            inicio = stock ? p + 2 : p + 1;
        }
    }
    return items;
}

export async function cargarListas() {
    const resultados = await Promise.allSettled(HOJAS.map(async h => {
        const r = await fetch(h.url, { cache: "no-store" });
        if (!r.ok) throw new Error(h.prov + " " + r.status);
        return leerHoja(leerCSV(await r.text()), h.prov, h.tipo);
    }));
    const items = resultados.filter(r => r.status === "fulfilled").flatMap(r => r.value);
    const fallas = HOJAS.filter((h, i) => resultados[i].status === "rejected").map(h => h.prov);
    return { items, fallas: [...new Set(fallas)] };
}

// ---------- BÚSQUEDA ----------
const normal = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function buscar(items, texto) {
    const palabras = normal(texto).split(/[^a-z0-9+]+/).filter(Boolean);
    if (!palabras.length) return [];
    const reglas = palabras.map(w => {
        const fin = /\d/.test(w) ? "(?![a-z0-9])" : "";
        return new RegExp("(^|[^a-z0-9])" + w.replace(/\+/g, "\\+") + fin);
    });
    return items.filter(it => {
        const texto = normal(`${it.seccion} ${it.modelo} ${it.detalle}`);
        return reglas.every(r => r.test(texto));
    });
}
