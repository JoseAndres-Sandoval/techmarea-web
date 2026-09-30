const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { MercadoPagoConfig, Preference } = require("mercadopago");
const admin = require("firebase-admin");
const catalogo = require("./catalogo.json");

admin.initializeApp();
const db = admin.firestore();

// El token de Mercado Pago YA NO va escrito acá.
// Se guarda como secreto en Firebase con:
//   firebase functions:secrets:set MP_ACCESS_TOKEN
const MP_ACCESS_TOKEN = defineSecret("MP_ACCESS_TOKEN");

const CANTIDAD_MAXIMA = 20;

// Adónde vuelve el cliente después de pagar (la misma web/carpeta desde donde compró)
function armarUrlsDeVuelta(origen) {
    let base = new URL("https://techmarea.com.ar/");
    try {
        const url = new URL(origen);
        if (url.protocol === "https:" || url.hostname === "localhost" || url.hostname === "127.0.0.1") {
            base = url;
        }
    } catch (_) { /* origen inválido: usamos el dominio por defecto */ }

    return {
        success: new URL("exito.html", base).href,
        failure: new URL("fallo.html", base).href,
        pending: new URL("pendiente.html", base).href
    };
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

        const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN.value() });
        const preference = new Preference(client);

        const respuesta = await preference.create({
            body: {
                items: itemsParaMP,
                back_urls: armarUrlsDeVuelta(origen),
                auto_return: "approved",
                statement_descriptor: "TECH MAREA"
            }
        });

        return res.status(200).json({ init_point: respuesta.init_point });

    } catch (error) {
        console.error("Error al crear la preferencia de pago:", error);
        return res.status(500).json({ error: "Error interno al procesar el pago." });
    }
});

// =========================================
// WEBHOOK DE VENTAS / STOCK (tu código, sin cambios)
// =========================================
// Webhook para procesar la venta y actualizar stock en Firestore de forma transaccional
exports.procesarVentaWebhook = onRequest(async (req, res) => {
  // Asegurarnos de que sea una petición POST
  if (req.method !== "POST") {
    return res.status(405).send({ error: "Método no permitido" });
  }

  const { items } = req.body; 
  // Se espera un array de items, por ejemplo: 
  // items: [{ id: "id_producto_1", quantity: 2 }, ...]

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).send({ error: "No se recibieron productos en la venta." });
  }

  try {
    // Ejecutamos una transacción de Firestore para garantizar consistencia en el stock
    await db.runTransaction(async (transaction) => {
      // 1. Leer todos los productos involucrados en la transacción
      const productRefs = items.map((item) => db.collection("productos").doc(item.id));
      const productDocs = await Promise.all(productRefs.map((ref) => transaction.get(ref)));

      for (let i = 0; i < productDocs.length; i++) {
        const doc = productDocs[i];
        const orderedQty = items[i].quantity;

        if (!doc.exists) {
          throw new Error(`El producto con ID ${items[i].id} no existe.`);
        }

        const currentStock = doc.data().stock || 0;

        if (currentStock < orderedQty) {
          throw new Error(`Stock insuficiente para el producto ${doc.data().nombre || doc.id}. Stock actual: ${currentStock}, solicitado: ${orderedQty}`);
        }

        // 2. Actualizar el stock restando la cantidad vendida
        transaction.update(doc.ref, { stock: currentStock - orderedQty });
      }
    });

    return res.status(200).json({ success: true, message: "Venta procesada y stock actualizado correctamente." });
  } catch (error) {
    console.error("Error al procesar la venta:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});