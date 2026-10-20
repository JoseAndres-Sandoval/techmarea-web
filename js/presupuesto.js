// Presupuesto de reparación: arma el mensaje y lo abre en WhatsApp
import { WHATSAPP } from "./config.js";

const form = document.getElementById("form-presupuesto");
const error = document.getElementById("p-error");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const equipo = document.getElementById("p-equipo").value;
    const marca = document.getElementById("p-marca").value;
    const modelo = document.getElementById("p-modelo").value.trim();
    const detalle = document.getElementById("p-detalle").value.trim();
    const nombre = document.getElementById("p-nombre").value.trim();
    const fallas = [...form.querySelectorAll(".pres-fallas input:checked")].map(c => c.value);

    if (!marca || !modelo) {
        error.textContent = "Completá la marca y el modelo de tu equipo.";
        return;
    }
    if (fallas.length === 0 && !detalle) {
        error.textContent = "Marcá qué le pasa o contanos en el detalle.";
        return;
    }
    error.textContent = "";

    const lineas = [
        "¡Hola TechMarea! 🌊 Quiero pedir un presupuesto de reparación:",
        "",
        `📱 Equipo: ${equipo} ${marca} ${modelo}`,
        fallas.length ? `🔧 Falla: ${fallas.join(", ")}` : "",
        detalle ? `📝 Detalle: ${detalle}` : "",
        nombre ? `🙋 Nombre: ${nombre}` : ""
    ].filter((l, i) => l !== "" || i === 1);

    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lineas.join("\n"))}`;
    window.open(url, "_blank", "noopener");
});
