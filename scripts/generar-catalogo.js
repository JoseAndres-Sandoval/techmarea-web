// Genera functions/catalogo.json a partir de los catálogos de la web (js/*.js).
// El servidor de pagos usa ese archivo para saber el precio REAL de cada producto.
// Se ejecuta solo antes de cada "firebase deploy --only functions"
// (y a mano con: node scripts/generar-catalogo.js)
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const raiz = path.join(__dirname, "..");
const archivos = ["parlantes", "auriculares", "cables", "cargador", "powerbank"];
const catalogo = {};

for (const nombre of archivos) {
    const codigo = fs.readFileSync(path.join(raiz, "js", `${nombre}.js`), "utf8");
    const match = codigo.match(/const\s+(catalogo\w+)\s*=\s*(\[[\s\S]*?\n\]);/);
    if (!match) throw new Error(`No encontré el catálogo en js/${nombre}.js`);

    const productos = vm.runInNewContext(match[2]);
    for (const p of productos) {
        if (catalogo[p.id]) {
            throw new Error(`ID repetido: ${p.id} (en ${nombre} y ${catalogo[p.id].archivo})`);
        }
        if (typeof p.precio !== "number" || p.precio <= 0) {
            throw new Error(`Precio inválido en ${nombre}, id ${p.id}`);
        }
        catalogo[p.id] = {
            nombre: p.color ? `${p.nombre} - ${p.color}` : p.nombre,
            precio: p.precio,
            archivo: nombre
        };
    }
}

fs.writeFileSync(path.join(raiz, "functions", "catalogo.json"), JSON.stringify(catalogo, null, 2));
console.log(`Catálogo generado: ${Object.keys(catalogo).length} productos.`);
