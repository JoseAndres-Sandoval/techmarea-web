const { onRequest } = require("firebase-functions/v2/https");
const { MercadoPagoConfig, Preference } = require("mercadopago");

// CONFIGURÁ ACÁ TU TOKEN PRIVADO DE MERCADO PAGO
// (Reemplazá 'TU_ACCESS_TOKEN_REAL' por tu credencial de producción/test de Mercado Pago)
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-2079372539822015-080221-fb1a58093318c42e70ab27891ed2a801-3587266924' });

exports.crearPreferencia = onRequest({ cors: true }, async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: "El carrito está vacío." });
        }

        // Transformamos los productos al formato que exige Mercado Pago
        const itemsParaMP = items.map(producto => ({
            title: producto.nombre,
            quantity: Number(producto.cantidad),
            unit_price: Number(producto.precio),
            currency_id: "ARS"
        }));

        const preference = new Preference(client);
        
        const respuesta = await preference.create({
            body: {
                items: itemsParaMP,
                back_urls: {
                    success: "https://tuweb.com/exito.html", // Podes cambiarlo por tu página de inicio o éxito
                    failure: "https://tuweb.com/fallo.html",
                    pending: "https://tuweb.com/pendiente.html"
                },
                auto_return: "approved",
            }
        });

        // Devolvemos el link de pago seguro hacia el frontend
        return res.status(200).json({ init_point: respuesta.init_point });

    } catch (error) {
        console.error("Error al crear la preferencia de pago:", error);
        return res.status(500).json({ error: "Error interno al procesar el pago." });
    }
});