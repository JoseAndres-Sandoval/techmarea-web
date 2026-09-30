// Se usa en exito.html: como la compra ya se pagó, vaciamos el carrito.
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { db, auth } from "./config.js";

try { localStorage.removeItem("carritoTechMarea"); } catch (_) {}

const cancelar = onAuthStateChanged(auth, async (user) => {
    cancelar();
    if (user) {
        try {
            await setDoc(doc(db, "carritos", user.uid), { items: [] });
        } catch (error) {
            console.error("No se pudo vaciar el carrito en la nube:", error);
        }
    }
});
