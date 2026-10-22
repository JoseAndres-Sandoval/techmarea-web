// Genera functions/catalogo.json a partir de los catálogos de la web (js/*.js).
// El servidor de pagos usa ese archivo para saber el precio REAL de cada producto.
// Se ejecuta solo antes de cada "firebase deploy --only functions"
// (y a mano con: node scripts/generar-catalogo.js)
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const raiz = path.join(__dirname, "..");
const archivos = ["parlantes", "auriculares", "cables", "cargador", "powerbank", "relojes", "computacion", "vidrios", "fundas", "accesorios"];
const catalogo = {};

// Fotos de las páginas que muestran una sola imagen para todos los modelos
const IMAGEN_GENERICA = { vidrios: "assets/img/vidrios-templados-local.webp", fundas: "assets/img/fundas-local.webp" };
// "<li><strong>Potencia:</strong> 30W</li>..." -> "Potencia: 30W. ..."
const textoPlano = html => (html || "").replace(/<\/li>/g, ". ").replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/\s+/g, " ").replace(/\.\s*\./g, ".").trim();

for (const nombre of archivos) {
    const codigo = fs.readFileSync(path.join(raiz, "js", `${nombre}.js`), "utf8");
    const match = codigo.match(/const\s+(catalogo\w+)\s*=\s*(\[[\s\S]*?\n\]);/);
    if (!match) throw new Error(`No encontré el catálogo en js/${nombre}.js`);

    const productos = vm.runInNewContext(match[2]);
    for (const p of productos) {
        if (p.agotado) continue; // sin stock: no se puede cobrar
        if (catalogo[p.id]) {
            throw new Error(`ID repetido: ${p.id} (en ${nombre} y ${catalogo[p.id].archivo})`);
        }
        if (typeof p.precio !== "number" || p.precio <= 0) {
            throw new Error(`Precio inválido en ${nombre}, id ${p.id}`);
        }
        catalogo[p.id] = {
            nombre: p.color ? `${p.nombre} - ${p.color}` : p.nombre,
            precio: p.precio,
            archivo: nombre,
            // Datos extra para la lista de Google Shopping (functions: feedGoogle)
            base: p.nombre,
            color: p.color || "",
            imagen: p.imagen || IMAGEN_GENERICA[nombre] || "",
            descripcion: textoPlano(p.specs) || [p.modelo && `Modelo: ${p.modelo}`, p.detalle].filter(Boolean).join(". ")
        };
    }
}

fs.writeFileSync(path.join(raiz, "functions", "catalogo.json"), JSON.stringify(catalogo, null, 2));

// Lista pública de productos (id, nombre y precio) para el panel de admin (stock)
fs.mkdirSync(path.join(raiz, "datos"), { recursive: true });
const lista = Object.entries(catalogo).map(([id, p]) => ({ id, nombre: p.nombre, precio: p.precio, categoria: p.archivo }));
fs.writeFileSync(path.join(raiz, "datos", "productos.json"), JSON.stringify(lista));
console.log(`Catálogo generado: ${Object.keys(catalogo).length} productos.`);
