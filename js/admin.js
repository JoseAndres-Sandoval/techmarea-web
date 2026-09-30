// js/admin.js
// Panel de administración: el acceso lo controla Firebase (cuenta + lista de admins),
// no una contraseña escrita en el código.

import { collection, getDocs, getDoc, setDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { db, auth, escaparHTML } from "./config.js";

const ESTADOS = ["En revisión", "Esperando repuesto", "Listo para retirar"];

document.addEventListener('DOMContentLoaded', () => {
    const seccionLogin = document.getElementById('seccion-login');
    const seccionPanel = document.getElementById('seccion-panel');
    const formLogin = document.getElementById('form-login-admin');
    const mensajeLogin = document.getElementById('mensaje-login');
    const inputOrdenAdmin = document.getElementById('admin-orden');
    const listaOrdenesContainer = document.getElementById('lista-ordenes-admin');

    // ---------- ACCESO ----------
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        mensajeLogin.textContent = "";
        try {
            await signInWithEmailAndPassword(
                auth,
                document.getElementById('input-email').value.trim(),
                document.getElementById('input-password').value
            );
        } catch (error) {
            console.error(error);
            mensajeLogin.textContent = "Correo o contraseña incorrectos.";
        }
    });

    document.getElementById('btn-salir-admin').addEventListener('click', () => signOut(auth));

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            seccionPanel.style.display = 'none';
            seccionLogin.style.display = 'block';
            return;
        }
        // Solo entran las cuentas cargadas en la colección "admins" de Firestore
        const esAdmin = (await getDoc(doc(db, "admins", user.uid)).catch(() => null))?.exists();
        if (!esAdmin) {
            mensajeLogin.textContent = "Esta cuenta no tiene permiso de administrador.";
            await signOut(auth);
            return;
        }
        seccionLogin.style.display = 'none';
        seccionPanel.style.display = 'block';
        actualizarPanel();
    });

    // ---------- LISTA DE ÓRDENES ----------
    async function actualizarPanel() {
        try {
            const querySnapshot = await getDocs(collection(db, "reparaciones"));
            let maxOrden = 1000;
            const arrayOrdenes = [];

            for (const documento of querySnapshot.docs) {
                const data = documento.data();
                const orden = String(data.orden ?? documento.id);

                // Migración automática: las órdenes viejas tenían un ID al azar.
                // Ahora el ID del documento es el número de orden, así el cliente
                // puede consultar SOLO su orden sin ver la lista completa.
                if (documento.id !== orden) {
                    await setDoc(doc(db, "reparaciones", orden), { ...data, orden });
                    await deleteDoc(documento.ref);
                }

                arrayOrdenes.push({ orden, equipo: data.equipo, estado: data.estado, detalle: data.detalle });
            }

            arrayOrdenes.sort((a, b) => parseInt(a.orden, 10) - parseInt(b.orden, 10));

            if (arrayOrdenes.length === 0) {
                listaOrdenesContainer.innerHTML = `<p style="color: #777; font-size: 0.9rem;">No hay reparaciones cargadas actualmente.</p>`;
            } else {
                listaOrdenesContainer.innerHTML = arrayOrdenes.map((item) => {
                    const numOrden = parseInt(item.orden, 10);
                    if (!isNaN(numOrden) && numOrden > maxOrden) maxOrden = numOrden;

                    const opciones = ESTADOS.map(e =>
                        `<option value="${e}" ${e === item.estado ? "selected" : ""}>${e}</option>`).join("");

                    return `
                        <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; background: #222; padding: 12px 15px; border-radius: 8px; border: 1px solid #333;">
                            <div style="flex: 1; min-width: 180px;">
                                <strong style="color: var(--color-cian);">#${escaparHTML(item.orden)}</strong> - ${escaparHTML(item.equipo)}
                                <select class="select-estado" data-id="${escaparHTML(item.orden)}" style="display: block; margin-top: 6px; padding: 6px; border-radius: 6px; border: 1px solid #444; background: #1a1a1a; color: #ddd; font-family: inherit;">${opciones}</select>
                            </div>
                            <button class="btn-eliminar" data-id="${escaparHTML(item.orden)}" style="background: #ff4c4c; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem;">Eliminar</button>
                        </div>`;
                }).join("");

                listaOrdenesContainer.querySelectorAll('.select-estado').forEach(select => {
                    select.addEventListener('change', async (e) => {
                        try {
                            await updateDoc(doc(db, "reparaciones", e.target.dataset.id), { estado: e.target.value });
                        } catch (err) {
                            console.error(err);
                            alert("No se pudo actualizar el estado.");
                        }
                    });
                });

                listaOrdenesContainer.querySelectorAll('.btn-eliminar').forEach(boton => {
                    boton.addEventListener('click', async (e) => {
                        const id = e.target.dataset.id;
                        if (!confirm(`¿Eliminar la orden #${id}? El número volverá a quedar disponible.`)) return;
                        try {
                            await deleteDoc(doc(db, "reparaciones", id));
                            actualizarPanel();
                        } catch (err) {
                            console.error("Error al eliminar:", err);
                            alert("No se pudo eliminar el registro.");
                        }
                    });
                });
            }

            if (inputOrdenAdmin) inputOrdenAdmin.value = maxOrden + 1;
        } catch (error) {
            console.error("Error al actualizar panel:", error);
            listaOrdenesContainer.innerHTML = `<p style="color: #ff6b6b;">No se pudieron cargar las órdenes.</p>`;
        }
    }

    // ---------- NUEVA ORDEN ----------
    const formReparacion = document.getElementById('form-reparacion');
    const mensajeExito = document.getElementById('mensaje-exito');

    formReparacion.addEventListener('submit', async (e) => {
        e.preventDefault();

        const orden = document.getElementById('admin-orden').value.trim();
        const equipo = document.getElementById('admin-equipo').value.trim();
        const estado = document.getElementById('admin-estado').value;
        const detalle = document.getElementById('admin-detalle').value.trim();

        if (!/^[0-9]{1,10}$/.test(orden)) {
            alert("El número de orden debe tener solo números.");
            return;
        }

        try {
            const existente = await getDoc(doc(db, "reparaciones", orden));
            if (existente.exists()) {
                alert(`¡Atención! El número de orden #${orden} ya existe.`);
                return;
            }

            await setDoc(doc(db, "reparaciones", orden), { orden, equipo, estado, detalle });

            mensajeExito.style.display = 'block';
            formReparacion.reset();
            actualizarPanel();
            setTimeout(() => { mensajeExito.style.display = 'none'; }, 4000);
        } catch (error) {
            console.error("Error al guardar en Firebase: ", error);
            alert("Hubo un error al guardar la orden.");
        }
    });
});
