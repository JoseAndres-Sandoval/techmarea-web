// js/admin.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCHV9m2iYtx70sqT0C5AlSiRQIrP2AL6zI",
  authDomain: "tech-marea-db.firebaseapp.com",
  projectId: "tech-marea-db",
  storageBucket: "tech-marea-db.firebasestorage.app",
  messagingSenderId: "120154130587",
  appId: "1:120154130587:web:390fd3c12fc7b3460cde3e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const PASSWORD_ADMIN = "42320017"; 

document.addEventListener('DOMContentLoaded', () => {
    const seccionLogin = document.getElementById('seccion-login');
    const seccionPanel = document.getElementById('seccion-panel');
    const inputPassword = document.getElementById('input-password');
    const btnLogin = document.getElementById('btn-login');
    const inputOrdenAdmin = document.getElementById('admin-orden');
    const listaOrdenesContainer = document.getElementById('lista-ordenes-admin');

    async function actualizarPanel() {
        try {
            const querySnapshot = await getDocs(collection(db, "reparaciones"));
            let maxOrden = 1000;
            let arrayOrdenes = [];

            querySnapshot.forEach((documento) => {
                const data = documento.data();
                arrayOrdenes.push({
                    id: documento.id,
                    orden: data.orden,
                    equipo: data.equipo,
                    estado: data.estado,
                    detalle: data.detalle
                });
            });

            // Ordena de menor a mayor prolijamente
            arrayOrdenes.sort((a, b) => parseInt(a.orden, 10) - parseInt(b.orden, 10));

            let htmlLista = "";

            if (arrayOrdenes.length === 0) {
                listaOrdenesContainer.innerHTML = `<p style="color: #777; font-size: 0.9rem;">No hay reparaciones cargadas actualmente.</p>`;
            } else {
                arrayOrdenes.forEach((item) => {
                    const numOrden = parseInt(item.orden, 10);
                    if (!isNaN(numOrden) && numOrden > maxOrden) {
                        maxOrden = numOrden;
                    }

                    htmlLista += `
                        <div style="display: flex; justify-content: space-between; align-items: center; background: #222; padding: 12px 15px; border-radius: 8px; border: 1px solid #333;">
                            <div>
                                <strong style="color: var(--color-cian);">#${item.orden}</strong> - ${item.equipo} 
                                <span style="display: block; font-size: 0.8rem; color: #aaa; margin-top: 3px;">Estado: ${item.estado}</span>
                            </div>
                            <button class="btn-eliminar" data-id="${item.id}" style="background: #ff4c4c; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem;">Eliminar</button>
                        </div>
                    `;
                });
                listaOrdenesContainer.innerHTML = htmlLista;

                document.querySelectorAll('.btn-eliminar').forEach(boton => {
                    boton.addEventListener('click', async (e) => {
                        const idDoc = e.target.getAttribute('data-id');
                        if (confirm("¿Estás seguro de eliminar esta orden? El número volverá a quedar disponible.")) {
                            try {
                                await deleteDoc(doc(db, "reparaciones", idDoc));
                                actualizarPanel(); 
                            } catch (err) {
                                console.error("Error al eliminar:", err);
                                alert("No se pudo eliminar el registro.");
                            }
                        }
                    });
                });
            }

            if (inputOrdenAdmin) {
                inputOrdenAdmin.value = maxOrden + 1;
            }
        } catch (error) {
            console.error("Error al actualizar panel:", error);
        }
    }

    btnLogin.addEventListener('click', () => {
        if (inputPassword.value === PASSWORD_ADMIN) {
            seccionLogin.style.display = 'none';
            seccionPanel.style.display = 'block';
            actualizarPanel(); 
        } else {
            alert('Contraseña incorrecta.');
            inputPassword.value = '';
        }
    });

    inputPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            btnLogin.click();
        }
    });

    const formReparacion = document.getElementById('form-reparacion');
    const mensajeExito = document.getElementById('mensaje-exito');

    formReparacion.addEventListener('submit', async (e) => {
        e.preventDefault();

        const orden = document.getElementById('admin-orden').value.trim();
        const equipo = document.getElementById('admin-equipo').value.trim();
        const estado = document.getElementById('admin-estado').value;
        const detalle = document.getElementById('admin-detalle').value.trim();

        try {
            const querySnapshot = await getDocs(collection(db, "reparaciones"));
            let ordenDuplicada = false;

            querySnapshot.forEach((doc) => {
                if (doc.data().orden === orden) {
                    ordenDuplicada = true;
                }
            });

            if (ordenDuplicada) {
                alert(`¡Atención! El número de orden #${orden} ya existe en la base de datos.`);
                return;
            }

            await addDoc(collection(db, "reparaciones"), {
                orden: orden,
                equipo: equipo,
                estado: estado,
                detalle: detalle
            });

            mensajeExito.style.display = 'block';
            formReparacion.reset();
            actualizarPanel(); 

            setTimeout(() => {
                mensajeExito.style.display = 'none';
            }, 4000);

        } catch (error) {
            console.error("Error al guardar en Firebase: ", error);
            alert("Hubo un error al guardar la orden.");
        }
    });
});