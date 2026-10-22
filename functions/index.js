const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const admin = require("firebase-admin");
const catalogo = require("./catalogo.json");

admin.initializeApp();
const db = admin.firestore();

// El token de Mercado Pago YA NO va escrito acá.
// Se guarda como secreto en Firebase con:
//   firebase functions:secrets:set MP_ACCESS_TOKEN
const MP_ACCESS_TOKEN = defineSecret("MP_ACCESS_TOKEN");

const CANTIDAD_MAXIMA = 20;

// Dirección a la que Mercado Pago avisa cada pago (función de más abajo)
const URL_AVISOS = "https://us-central1-tech-marea-db.cloudfunctions.net/webhookMercadoPago";

// Adónde vuelve el cliente después de pagar (la misma web/carpeta desde donde compró).
// Mercado Pago solo acepta volver automáticamente a direcciones https.
// Si la página se abrió desde la compu (http://127.0.0.1...), no ponemos vuelta
// automática: el cliente paga y vuelve con el botón de Mercado Pago.
function armarVuelta(origen) {
    try {
        const base = new URL(origen);
        if (base.protocol !== "https:") return {};
        return {
            back_urls: {
                success: new URL("exito.html", base).href,
                failure: new URL("fallo.html", base).href,
                pending: new URL("pendiente.html", base).href
            },
            auto_return: "approved"
        };
    } catch (_) {
        return {};
    }
}

exports.crearPreferencia = onRequest({ cors: true, secrets: [MP_ACCESS_TOKEN] }, async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido." });
    }

    try {
        const { items, origen } = req.body || {};

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "El carrito está vacío." });
        }
        if (items.length > 50) {
            return res.status(400).json({ error: "Demasiados productos en el carrito." });
        }

        // El precio y el nombre salen SIEMPRE del catálogo del servidor,
        // nunca de lo que manda el navegador.
        const itemsParaMP = [];
        for (const item of items) {
            const producto = catalogo[String(item.id)];
            const cantidad = Number(item.cantidad);

            if (!producto) {
                return res.status(400).json({ error: "Hay un producto que ya no está disponible. Vaciá el carrito y volvé a agregarlo." });
            }
            if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > CANTIDAD_MAXIMA) {
                return res.status(400).json({ error: `Cantidad inválida (máximo ${CANTIDAD_MAXIMA} por producto).` });
            }

            itemsParaMP.push({
                id: String(item.id),
                title: producto.nombre,
                quantity: cantidad,
                unit_price: producto.precio,
                currency_id: "ARS"
            });
        }

        // Control de stock: si un producto tiene stock cargado y no alcanza, no se cobra
        const docsStock = await Promise.all(itemsParaMP.map(i => db.collection("stock").doc(i.id).get()));
        for (let k = 0; k < itemsParaMP.length; k++) {
            const d = docsStock[k];
            if (d.exists && (d.data().cantidad ?? 0) < itemsParaMP[k].quantity) {
                const quedan = Math.max(0, d.data().cantidad ?? 0);
                return res.status(409).json({ error: quedan === 0
                    ? `"${itemsParaMP[k].title}" se agotó. Sacalo del carrito para seguir.`
                    : `De "${itemsParaMP[k].title}" solo quedan ${quedan}. Cambiá la cantidad para seguir.` });
            }
        }

        const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN.value() });
        const preference = new Preference(client);

        const respuesta = await preference.create({
            body: {
                items: itemsParaMP,
                ...armarVuelta(origen),
                notification_url: URL_AVISOS,
                statement_descriptor: "TECH MAREA"
            }
        });

        return res.status(200).json({ init_point: respuesta.init_point });

    } catch (error) {
        console.error("Error al crear la preferencia de pago:", error?.message, JSON.stringify(error?.cause || error));
        return res.status(500).json({ error: "Error interno al procesar el pago." });
    }
});

// =========================================
// AVISOS DE MERCADO PAGO: registra la venta y descuenta el stock
// =========================================
// Mercado Pago llama a esta dirección cuando cambia un pago.
// Por seguridad NO confiamos en lo que llega: con el número de pago le
// preguntamos a Mercado Pago (con nuestro token) si el pago es real y está aprobado.
// Cada pago se procesa una sola vez (queda guardado en "ventas").
exports.webhookMercadoPago = onRequest({ secrets: [MP_ACCESS_TOKEN] }, async (req, res) => {
    try {
        const q = req.query || {};
        const b = req.body || {};
        const tipo = q.type || b.type || q.topic || b.topic;
        const idPago = String(q["data.id"] || b?.data?.id || (tipo === "payment" ? q.id : "") || "");

        if (tipo !== "payment" || !/^[0-9]{1,20}$/.test(idPago)) {
            return res.status(200).send("ignorado");
        }

        const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN.value() });
        const pago = await new Payment(client).get({ id: idPago });

        if (pago.status !== "approved") {
            return res.status(200).send("pago no aprobado: " + pago.status);
        }

        const items = (pago.additional_info?.items || [])
            .map(i => ({ id: String(i.id), titulo: String(i.title || ""), cantidad: Number(i.quantity) || 0, precio: Number(i.unit_price) || 0 }))
            .filter(i => catalogo[i.id] && i.cantidad > 0);

        await db.runTransaction(async (t) => {
            const refVenta = db.collection("ventas").doc(idPago);
            if ((await t.get(refVenta)).exists) return; // ya procesado

            const refsStock = items.map(i => db.collection("stock").doc(i.id));
            const docsStock = await Promise.all(refsStock.map(r => t.get(r)));

            docsStock.forEach((d, k) => {
                if (d.exists) {
                    const actual = d.data().cantidad ?? 0;
                    t.update(refsStock[k], { cantidad: Math.max(0, actual - items[k].cantidad) });
                }
            });

            t.set(refVenta, {
                fecha: admin.firestore.FieldValue.serverTimestamp(),
                items,
                total: Number(pago.transaction_amount) || 0,
                neto: Number(pago.transaction_details?.net_received_amount) || null,
                medio: pago.payment_method_id || "",
                comprador: pago.payer?.email || "",
                entregado: false
            });
        });

        return res.status(200).send("ok");
    } catch (error) {
        console.error("Error en aviso de Mercado Pago:", error?.message);
        // 500 hace que Mercado Pago reintente más tarde
        return res.status(500).send("error");
    }
});

// ---------------------------------------------------------------------------
// Lista de productos para Google Shopping (Google Merchant Center).
// Google la lee sola cada día desde https://techmarea.com.ar/feed-google.xml
// El stock sale de Firestore, así lo agotado figura como "sin stock".
// ---------------------------------------------------------------------------
const SITIO = "https://techmarea.com.ar";
const xml = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const urlArchivo = ruta => SITIO + "/" + ruta.split("/").map(encodeURIComponent).join("/");

exports.feedGoogle = onRequest({ cors: false }, async (req, res) => {
    try {
        const snap = await db.collection("stock").get();
        const stock = {};
        snap.forEach(d => { stock[d.id] = Number(d.data().cantidad) || 0; });

        // Productos con varios colores: Google los agrupa como variantes
        const grupos = {};
        for (const p of Object.values(catalogo)) grupos[p.base] = (grupos[p.base] || 0) + 1;

        const items = Object.entries(catalogo).map(([id, p]) => {
            const hay = (stock[id] ?? 0) > 0;
            const marca = /xaea/i.test(p.nombre) ? "XAEA" : "";
            const desc = (p.descripcion ? p.descripcion + " " : "") + "Retiro en el local en Maipú, Mendoza, o envío a todo el país.";
            return `<item>
<g:id>${xml(id)}</g:id>
<g:title>${xml(p.nombre.slice(0, 150))}</g:title>
<g:description>${xml(desc.slice(0, 5000))}</g:description>
<g:link>${xml(SITIO + "/" + p.archivo + ".html")}</g:link>
<g:image_link>${xml(urlArchivo(p.imagen))}</g:image_link>
<g:availability>${hay ? "in_stock" : "out_of_stock"}</g:availability>
<g:price>${p.precio.toFixed(2)} ARS</g:price>
<g:condition>new</g:condition>
${marca ? `<g:brand>${marca}</g:brand>\n` : ""}<g:identifier_exists>no</g:identifier_exists>
${grupos[p.base] > 1 ? `<g:item_group_id>${xml((p.archivo + "-" + p.base).slice(0, 50))}</g:item_group_id>\n` : ""}${p.color ? `<g:color>${xml(p.color)}</g:color>\n` : ""}</item>`;
        });

        const cuerpo = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>TechMarea</title>
<link>${SITIO}</link>
<description>Accesorios para celular, audio y computación en Maipú, Mendoza</description>
${items.join("\n")}
</channel>
</rss>`;
        res.set("Content-Type", "application/xml; charset=utf-8");
        res.set("Cache-Control", "public, max-age=3600");
        res.status(200).send(cuerpo);
    } catch (e) {
        console.error("feedGoogle", e);
        res.status(500).send("error");
    }
});
