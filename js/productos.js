// =========================================
// 1. BASE DE DATOS DE PRODUCTOS
// =========================================
const catalogoParlantes = [
    {
        id: 1, 
        nombre: "Xaea Vibe Box 30W",
        categoria: "portatil", 
        imagen: "assets/img/parlante-30W.jpeg",
        specs: "<li><strong>Potencia:</strong> 30W (2 altavoces de 15W)</li><li><strong>Conectividad:</strong> Bluetooth y función TWS</li><li><strong>Puertos:</strong> USB, Micro SD, AUX, Tipo-C</li><li><strong>Batería:</strong> 2000 mAh recargable</li><li><strong>Extras:</strong> LED RGB y protección agua IPX5</li>",
        precio: 45000 
    },
    {
        id: 2,
        nombre: "Xaea Dual Storm",
        categoria: "modular", 
        imagen: "assets/img/Parlante Inalambrico Xaea Dual.png",
        specs: "<li><strong>Diseño:</strong> Modular 2 en 1 (se puede separar)</li><li><strong>Potencia:</strong> 10W total (5W por cada módulo)</li><li><strong>Conectividad:</strong> Bluetooth 5.3, FM, MicroSD y TWS</li><li><strong>Batería:</strong> 1200 mAh por módulo (Tipo-C)</li><li><strong>Extras:</strong> RGB dinámico, IPX6 y micrófono</li>",
        precio: 68500
    },
    {
        id: 3,
        nombre: "Xaea Bloomline",
        categoria: "portatil", 
        color: "Azul", 
        imagen: "assets/img/PARLANTE 3” BLOOMLINE – MODX-0051 – XAEA – AZUL.png", 
        imagenHover: "assets/img/PARLANTE 3” BLOOMLINE – MODX-0051 – XAEA – AZUL (2).png", 
        specs: "<li><strong>Potencia:</strong> 10W (Estéreo, 2 parlantes)</li><li><strong>Conectividad:</strong> Bluetooth y Sintonizador de Radio</li><li><strong>Color:</strong> Azul</li><li><strong>Batería:</strong> Recargable (Tiempo de carga: 1h)</li><li><strong>Voltaje:</strong> 5V</li><li><strong>Extras:</strong> Luces LED integradas y diseño portátil</li>",
        precio: 35000
    },
    {
        id: 4, 
        nombre: "Xaea Bloomline",
        categoria: "portatil", 
        color: "Rojo",
        imagen: "assets/img/PARLANTE 3” BLOOMLINE – MODX-0051 – XAEA – ROJO.png", 
        imagenHover: "assets/img/PARLANTE 3” BLOOMLINE – MODX-0051 – XAEA – ROJO - 1.png", 
        specs: "<li><strong>Potencia:</strong> 10W (Estéreo, 2 parlantes)</li><li><strong>Conectividad:</strong> Bluetooth y Sintonizador de Radio</li><li><strong>Color:</strong> Rojo</li><li><strong>Batería:</strong> Recargable (Tiempo de carga: 1h)</li><li><strong>Voltaje:</strong> 5V</li><li><strong>Extras:</strong> Luces LED integradas y diseño portátil</li>",
        precio: 35000
    },
    {
        id: 5, 
        nombre: "Xaea Bloomline",
        categoria: "portatil", 
        color: "Negro",
        imagen: "assets/img/PARLANTE 3” BLOOMLINE – MODX-0051 – XAEA – NEGRO.png", 
        imagenHover: "assets/img/PARLANTE 3” BLOOMLINE – MODX-0051 – XAEA – NEGRO -1.png", 
        specs: "<li><strong>Potencia:</strong> 10W (Estéreo, 2 parlantes)</li><li><strong>Conectividad:</strong> Bluetooth y Sintonizador de Radio</li><li><strong>Color:</strong> Negro</li><li><strong>Batería:</strong> Recargable (Tiempo de carga: 1h)</li><li><strong>Voltaje:</strong> 5V</li><li><strong>Extras:</strong> Luces LED integradas y diseño portátil</li>",
        precio: 35000
    },
    {
        id: 6,
        nombre: "Parlante Torre Xaea",
        categoria: "torre", 
        imagen: "assets/img/PARLANTE TORRE 5”X2 MODX-003S – XAEA – NEGRO.png",
        specs: "<li><strong>Tipo:</strong> Torre (Ideal para living o quincho)</li><li><strong>Potencia:</strong> 10W (2 parlantes integrados)</li><li><strong>Conectividad:</strong> Bluetooth y radio FM</li><li><strong>Energía:</strong> Batería recargable (Voltaje 220V)</li><li><strong>Extras:</strong> Luces LED y micrófono interno</li>",
        precio: 46531
    },
    {
        id: 7,
        nombre: "Parlante Halo 3\"",
        categoria: "portatil", 
        imagen: "assets/img/Parlante 3'' Modx-004r - Xaea - Negro-1.png",
        imagenHover: "assets/img/Parlante 3'' Modx-004r - Xaea - Negro2.png", 
        specs: "<li><strong>Potencia:</strong> 8W (Altavoz compacto de 3 pulgadas)</li><li><strong>Conectividad:</strong> Bluetooth, FM, USB, MicroSD (TF) y TWS</li><li><strong>Batería:</strong> 1200 mAh (Hasta 4hs de reproducción)</li><li><strong>Carga:</strong> Rápida mediante puerto USB Tipo-C</li><li><strong>Extras:</strong> Iluminación LED integrada</li>",
        precio: 28000
    },
    {
        id: 8,
        nombre: "Parlante BT 3\"x2 MODV-003U",
        categoria: "portatil",
        imagen: "assets/img/PARLANTE 3”X2 CH5 MODV-003U – VARIOS – NEGRO.png",
        specs: "<li><strong>Potencia:</strong> 10W (Doble parlante de 3\")</li><li><strong>Conectividad:</strong> Bluetooth, FM, USB, MicroSD (TF), AUX y TWS</li><li><strong>Batería:</strong> 1200mAh (Carga rápida Tipo-C)</li><li><strong>Medidas:</strong> 21 x 8 x 10 cm</li><li><strong>Extras:</strong> Luces LED RGB y sonido envolvente</li>",
        precio: 22321
    },
    {
        id: 9,
        nombre: "Parlante Xaea MODX0050 5W GRIS",
        categoria: "portatil",
        imagen: "assets/img/Parlante Xaea Modx-0050 3 5w gris.png", 
        specs: "<li><strong>Potencia:</strong> 5W</li><li><strong>Conectividad:</strong> Bluetooth y Sintonizador de Radio</li><li><strong>Batería:</strong> Recargable (Carga en 1.5h) vía Tipo-C</li><li><strong>Voltaje:</strong> 3.7V</li><li><strong>Extras:</strong> Luces LED y diseño portátil (Gris Oscuro)</li>",
        precio: 33000
    },
    {
        id: 10,
        nombre: "Parlante Xaea MODX0050 5W ROJO",
        categoria: "portatil",
        imagen: "assets/img/Parlante Xaea Modx-0050 3 5w gris rojo.png", 
        specs: "<li><strong>Potencia:</strong> 5W</li><li><strong>Conectividad:</strong> Bluetooth y Sintonizador de Radio</li><li><strong>Batería:</strong> Recargable (Carga en 1.5h) vía Tipo-C</li><li><strong>Voltaje:</strong> 3.7V</li><li><strong>Extras:</strong> Luces LED y diseño portátil (Gris Oscuro)</li>",
        precio: 33000
    },
    {
        id: 11, 
        nombre: "Xaea Dot Mini 3\"",
        categoria: "portatil", 
        color: "Negro",
        imagen: "assets/img/PARLANTE 3” DOT MINI – MODX-004X – XAEA.png", 
        imagenHover: "assets/img/PARLANTE 3” DOT MINI – MODX-004X – XAEA - NEGRO.png", 
        specs: "<li><strong>Potencia:</strong> 10W (Altavoz de 3 pulgadas)</li><li><strong>Conectividad:</strong> Bluetooth, FM, USB, MicroSD (TF) y TWS</li><li><strong>Color:</strong> Negro</li><li><strong>Batería:</strong> 1800mAh (Hasta 6hs de autonomía) vía Tipo-C</li><li><strong>Medidas:</strong> 13 x 8.7 x 10.5 cm</li><li><strong>Extras:</strong> Iluminación LED y diseño ultra compacto</li>",
        precio: 17291
    },
    {
        id: 12,
        nombre: "Xaea Dot Mini 3\"",
        categoria: "portatil", 
        color: "Rojo",
        imagen: "assets/img/PARLANTE 3” DOT MINI – MODX-004X – XAEA.png", 
        imagenHover: "assets/img/PARLANTE 3” DOT MINI – MODX-004X – XAEA - ROJO.png", 
        specs: "<li><strong>Potencia:</strong> 10W (Altavoz de 3 pulgadas)</li><li><strong>Conectividad:</strong> Bluetooth, FM, USB, MicroSD (TF) y TWS</li><li><strong>Color:</strong> Rojo</li><li><strong>Batería:</strong> 1800mAh (Hasta 6hs de autonomía) vía Tipo-C</li><li><strong>Medidas:</strong> 13 x 8.7 x 10.5 cm</li><li><strong>Extras:</strong> Iluminación LED y diseño ultra compacto</li>",
        precio: 17291
    },
    {
        id: 13,
        nombre: "Xaea Dot Mini 3\"",
        categoria: "portatil", 
        color: "Verde",
        imagen: "assets/img/PARLANTE 3” DOT MINI – MODX-004X – XAEA.png", 
        imagenHover: "assets/img/PARLANTE 3” DOT MINI – MODX-004X – XAEA - VERDE.png", 
        specs: "<li><strong>Potencia:</strong> 10W (Altavoz de 3 pulgadas)</li><li><strong>Conectividad:</strong> Bluetooth, FM, USB, MicroSD (TF) y TWS</li><li><strong>Color:</strong> Verde</li><li><strong>Batería:</strong> 1800mAh (Hasta 6hs de autonomía) vía Tipo-C</li><li><strong>Medidas:</strong> 13 x 8.7 x 10.5 cm</li><li><strong>Extras:</strong> Iluminación LED y diseño ultra compacto</li>",
        precio: 17291
    },
    {
        id: 14, 
        nombre: "Xaea Exo Mini 3\"",
        categoria: "portatil", 
        color: "Azul",
        imagen: "assets/img/PARLANTE 3” EXO MINI – MODX-004W – XAEA.png", 
        imagenHover: "assets/img/PARLANTE 3” EXO MINI – MODX-004W – XAEA - AZUL.png", 
        specs: "<li><strong>Potencia:</strong> 8W (Altavoz de 3 pulgadas)</li><li><strong>Conectividad:</strong> Bluetooth, FM, USB, MicroSD (TF) y TWS</li><li><strong>Color:</strong> Azul</li><li><strong>Batería:</strong> 1200mAh (Hasta 5hs de autonomía) vía Tipo-C</li><li><strong>Medidas:</strong> 17 x 10 x 7 cm</li><li><strong>Extras:</strong> Luces LED y cable de carga incluido</li>",
        precio: 17307
    },
    {
        id: 15,
        nombre: "Xaea Exo Mini 3\"",
        categoria: "portatil", 
        color: "Camuflado",
        imagen: "assets/img/PARLANTE 3” DOT MINI – MODX-004X – XAEA.png", 
        imagenHover: "assets/img/PARLANTE 3” EXO MINI – MODX-004W – XAEA - CAMUFLADO.png", 
        specs: "<li><strong>Potencia:</strong> 8W (Altavoz de 3 pulgadas)</li><li><strong>Conectividad:</strong> Bluetooth, FM, USB, MicroSD (TF) y TWS</li><li><strong>Color:</strong> Camuflado</li><li><strong>Batería:</strong> 1200mAh (Hasta 5hs de autonomía) vía Tipo-C</li><li><strong>Medidas:</strong> 17 x 10 x 7 cm</li><li><strong>Extras:</strong> Luces LED y cable de carga incluido</li>",
        precio: 17307
    },
    {
        id: 16,
        nombre: "Xaea Exo Mini 3\"",
        categoria: "portatil", 
        color: "Negro",
        imagen: "assets/img/PARLANTE 3” DOT MINI – MODX-004X – XAEA.png", 
        imagenHover: "assets/img/PARLANTE 3” EXO MINI – MODX-004W – XAEA - NEGRO.png", 
        specs: "<li><strong>Potencia:</strong> 8W (Altavoz de 3 pulgadas)</li><li><strong>Conectividad:</strong> Bluetooth, FM, USB, MicroSD (TF) y TWS</li><li><strong>Color:</strong> Negro</li><li><strong>Batería:</strong> 1200mAh (Hasta 5hs de autonomía) vía Tipo-C</li><li><strong>Medidas:</strong> 17 x 10 x 7 cm</li><li><strong>Extras:</strong> Luces LED y cable de carga incluido</li>",
        precio: 17307
    },
    {
        id: 17,
        nombre: "Xaea Exo Mini 3\"",
        categoria: "portatil", 
        color: "Rojo",
        imagen: "assets/img/PARLANTE 3” DOT MINI – MODX-004X – XAEA.png", 
        imagenHover: "assets/img/PARLANTE 3” EXO MINI – MODX-004W – XAEA - ROJO.png", 
        specs: "<li><strong>Potencia:</strong> 8W (Altavoz de 3 pulgadas)</li><li><strong>Conectividad:</strong> Bluetooth, FM, USB, MicroSD (TF) y TWS</li><li><strong>Color:</strong> Rojo</li><li><strong>Batería:</strong> 1200mAh (Hasta 5hs de autonomía) vía Tipo-C</li><li><strong>Medidas:</strong> 17 x 10 x 7 cm</li><li><strong>Extras:</strong> Luces LED y cable de carga incluido</li>",
        precio: 17307
    }
    ,{
        id: 18,
        nombre: "Xaea Groove 3\"",
        categoria: "portatil", 
        color: "Negro",
        imagen: "assets/img/PARLANTE 3” GROOVE – MODX-101 – XAEA.png", /* Recuerda renombrar tu imagen a esto */
        imagenHover: "assets/img/PARLANTE 3” GROOVE – MODX-101 – XAEA - NEGRO.png", /* Reemplaza si tienes una foto de la caja, sino bórralo */
        specs: "<li><strong>Potencia:</strong> 800W (Altavoz 3\" BT LED)</li><li><strong>Conectividad:</strong> USB, AUX 3.5mm, Radio FM, MicroSD y TWS</li><li><strong>Color:</strong> Negro</li><li><strong>Batería:</strong> 800mAh 3.7V (Carga Tipo-C)</li><li><strong>Medidas:</strong> 11.5 x 8.5 x 8.5 cm</li><li><strong>Extras:</strong> Guía para celular, cable de carga y manual</li>",
        precio: 12673
    },
    {
        id: 19,
        nombre: "Xaea Groove 3\"",
        categoria: "portatil", 
        color: "Azul",
        imagen: "assets/img/PARLANTE 3” GROOVE – MODX-101 – XAEA.png", 
        imagenHover: "assets/img/PARLANTE 3” GROOVE – MODX-101 – XAEA - AZUL.png", 
        specs: "<li><strong>Potencia:</strong> 800W (Altavoz 3\" BT LED)</li><li><strong>Conectividad:</strong> USB, AUX 3.5mm, Radio FM, MicroSD y TWS</li><li><strong>Color:</strong> Azul</li><li><strong>Batería:</strong> 800mAh 3.7V (Carga Tipo-C)</li><li><strong>Medidas:</strong> 11.5 x 8.5 x 8.5 cm</li><li><strong>Extras:</strong> Guía para celular, cable de carga y manual</li>",
        precio: 12673
    },
    {
        id: 20,
        nombre: "Xaea Groove 3\"",
        categoria: "portatil", 
        color: "Rojo",
        imagen: "assets/img/PARLANTE 3” GROOVE – MODX-101 – XAEA.png", 
        imagenHover: "assets/img/PARLANTE 3” GROOVE – MODX-101 – XAEA - ROJO.png", 
        specs: "<li><strong>Potencia:</strong> 800W (Altavoz 3\" BT LED)</li><li><strong>Conectividad:</strong> USB, AUX 3.5mm, Radio FM, MicroSD y TWS</li><li><strong>Color:</strong> Rojo</li><li><strong>Batería:</strong> 800mAh 3.7V (Carga Tipo-C)</li><li><strong>Medidas:</strong> 11.5 x 8.5 x 8.5 cm</li><li><strong>Extras:</strong> Guía para celular, cable de carga y manual</li>",
        precio: 12673
    },
    {
        id: 21,
        nombre: "Xaea Groove 3\"",
        categoria: "portatil", 
        color: "Verde",
        imagen: "assets/img/PARLANTE 3” GROOVE – MODX-101 – XAEA.png", 
        imagenHover: "assets/img/PARLANTE 3” GROOVE – MODX-101 – XAEA - VERDE.png", 
        specs: "<li><strong>Potencia:</strong> 800W (Altavoz 3\" BT LED)</li><li><strong>Conectividad:</strong> USB, AUX 3.5mm, Radio FM, MicroSD y TWS</li><li><strong>Color:</strong> Verde</li><li><strong>Batería:</strong> 800mAh 3.7V (Carga Tipo-C)</li><li><strong>Medidas:</strong> 11.5 x 8.5 x 8.5 cm</li><li><strong>Extras:</strong> Guía para celular, cable de carga y manual</li>",
        precio: 12673
    }
    ,{
        id: 22,
        nombre: "Xaea MODX-004J 3\"",
        categoria: "portatil", 
        color: "Celeste",
        imagen: "assets/img/PARLANTE 3” MODX-004J – XAEA.png", 
        imagenHover: "assets/img/PARLANTE 3” MODX-004J – XAEA - CELESTE.png", /* Reemplaza si tienes una foto de la caja, sino bórralo */
        specs: "<li><strong>Potencia:</strong> 8W Reales</li><li><strong>Conectividad:</strong> Inalámbrica, USB, MicroSD (TF), FM y TWS</li><li><strong>Color:</strong> Celeste</li><li><strong>Batería:</strong> 1200mAh (3hs de uso) vía Tipo-C</li><li><strong>Extras:</strong> Iluminación LED RGB dinámica y cable incluido</li>",
        precio: 15000 /* ¡ACTUALIZAR PRECIO! */
    },
    {
        id: 23,
        nombre: "Xaea MODX-004J 3\"",
        categoria: "portatil", 
        color: "Negro",
        imagen: "assets/img/PARLANTE 3” MODX-004J – XAEA.png", 
        imagenHover: "assets/img/PARLANTE 3” MODX-004J – XAEA - NEGRO.png", 
        specs: "<li><strong>Potencia:</strong> 8W Reales</li><li><strong>Conectividad:</strong> Inalámbrica, USB, MicroSD (TF), FM y TWS</li><li><strong>Color:</strong> Negro</li><li><strong>Batería:</strong> 1200mAh (3hs de uso) vía Tipo-C</li><li><strong>Extras:</strong> Iluminación LED RGB dinámica y cable incluido</li>",
        precio: 15000 /* ¡ACTUALIZAR PRECIO! */
    },
    {
        id: 24,
        nombre: "Xaea MODX-004J 3\"",
        categoria: "portatil", 
        color: "Rosado",
        imagen: "assets/img/PARLANTE 3” MODX-004J – XAEA.png", 
        imagenHover: "assets/img/PARLANTE 3” MODX-004J – XAEA - ROSADO.png", 
        specs: "<li><strong>Potencia:</strong> 8W Reales</li><li><strong>Conectividad:</strong> Inalámbrica, USB, MicroSD (TF), FM y TWS</li><li><strong>Color:</strong> Rosado</li><li><strong>Batería:</strong> 1200mAh (3hs de uso) vía Tipo-C</li><li><strong>Extras:</strong> Iluminación LED RGB dinámica y cable incluido</li>",
        precio: 15000 /* ¡ACTUALIZAR PRECIO! */
    },
    {
        id: 25,
        nombre: "Xaea MODX-004J 3\"",
        categoria: "portatil", 
        color: "Verde",
        imagen: "assets/img/PARLANTE 3” MODX-004J – XAEA.png", 
        imagenHover: "assets/img/PARLANTE 3” MODX-004J – XAEA - VERDE.png", 
        specs: "<li><strong>Potencia:</strong> 8W Reales</li><li><strong>Conectividad:</strong> Inalámbrica, USB, MicroSD (TF), FM y TWS</li><li><strong>Color:</strong> Verde</li><li><strong>Batería:</strong> 1200mAh (3hs de uso) vía Tipo-C</li><li><strong>Extras:</strong> Iluminación LED RGB dinámica y cable incluido</li>",
        precio: 15000 /* ¡ACTUALIZAR PRECIO! */
    },
    {
        id: 26,
        nombre: "Xaea Blade MODX-106 3\"",
        categoria: "portatil", 
        color: "Azul",
        imagen: "assets/img/PARLANTE 3” MODX-106 BLADE – XAEA.png", 
        imagenHover: "assets/img/PARLANTE 3” MODX-106 BLADE – XAEA - AZUL.png", /* Reemplaza si tienes una foto de la caja */
        specs: "<li><strong>Potencia:</strong> 500W (Altavoz 3\" BT LED)</li><li><strong>Conectividad:</strong> USB, AUX 3.5mm, Radio FM, MicroSD y TWS</li><li><strong>Color:</strong> Azul</li><li><strong>Batería:</strong> 1200mAh 3.7V (Carga Tipo-C)</li><li><strong>Medidas:</strong> 12.8 x 9 x 9 cm</li><li><strong>Extras:</strong> Cable de carga y manual incluidos</li>",
        precio: 11441 
    },
    {
        id: 27,
        nombre: "Xaea Blade MODX-106 3\"",
        categoria: "portatil", 
        color: "Camuflado",
        imagen: "assets/img/PARLANTE 3” MODX-106 BLADE – XAEA.png", 
        imagenHover: "assets/img/PARLANTE 3” MODX-106 BLADE – XAEA - CAMUFLADO.png", 
        specs: "<li><strong>Potencia:</strong> 500W (Altavoz 3\" BT LED)</li><li><strong>Conectividad:</strong> USB, AUX 3.5mm, Radio FM, MicroSD y TWS</li><li><strong>Color:</strong> Camuflado</li><li><strong>Batería:</strong> 1200mAh 3.7V (Carga Tipo-C)</li><li><strong>Medidas:</strong> 12.8 x 9 x 9 cm</li><li><strong>Extras:</strong> Cable de carga y manual incluidos</li>",
        precio: 11441 
    },
    {
        id: 28,
        nombre: "Xaea Blade MODX-106 3\"",
        categoria: "portatil", 
        color: "Negro",
        imagen: "assets/img/PARLANTE 3” MODX-106 BLADE – XAEA.png", 
        imagenHover: "assets/img/PARLANTE 3” MODX-106 BLADE – XAEA - NEGRO.png", 
        specs: "<li><strong>Potencia:</strong> 500W (Altavoz 3\" BT LED)</li><li><strong>Conectividad:</strong> USB, AUX 3.5mm, Radio FM, MicroSD y TWS</li><li><strong>Color:</strong> Negro</li><li><strong>Batería:</strong> 1200mAh 3.7V (Carga Tipo-C)</li><li><strong>Medidas:</strong> 12.8 x 9 x 9 cm</li><li><strong>Extras:</strong> Cable de carga y manual incluidos</li>",
        precio: 11441 
    },
    {
        id: 29,
        nombre: "Xaea Blade MODX-106 3\"",
        categoria: "portatil", 
        color: "Rojo",
        imagen: "assets/img/PARLANTE 3” MODX-106 BLADE – XAEA.png", 
        imagenHover: "assets/img/PARLANTE 3” MODX-106 BLADE – XAEA - ROJO.png", 
        specs: "<li><strong>Potencia:</strong> 500W (Altavoz 3\" BT LED)</li><li><strong>Conectividad:</strong> USB, AUX 3.5mm, Radio FM, MicroSD y TWS</li><li><strong>Color:</strong> Rojo</li><li><strong>Batería:</strong> 1200mAh 3.7V (Carga Tipo-C)</li><li><strong>Medidas:</strong> 12.8 x 9 x 9 cm</li><li><strong>Extras:</strong> Cable de carga y manual incluidos</li>",
        precio: 11441 
    },

];

// =========================================
// 2. INYECTAR PRODUCTOS EN EL HTML
// =========================================
const contenedor = document.getElementById("contenedor-productos");

function cargarProductos(productosAMostrar = catalogoParlantes) {
    let htmlGenerado = ""; 

    if (productosAMostrar.length === 0) {
        contenedor.innerHTML = '<p style="color: white; grid-column: 1 / -1; text-align: center; padding: 20px;">No se encontraron parlantes con esa búsqueda.</p>';
        return;
    }

    productosAMostrar.forEach(producto => {
        let bloqueImagen = "";

        if (producto.imagenHover) {
            bloqueImagen = `
                <div class="carrusel-hover">
                    <img src="${producto.imagen}" alt="${producto.nombre} - Foto 1" class="img-deslizante img-1">
                    <img src="${producto.imagenHover}" alt="${producto.nombre} - Foto 2" class="img-deslizante img-2">
                </div>
            `;
        } else {
            bloqueImagen = `<img src="${producto.imagen}" alt="${producto.nombre}" class="imagen-articulo">`;
        }

        let precioFormateado = producto.precio.toLocaleString("es-AR");

        htmlGenerado += `
            <article class="tarjeta-articulo">
                ${bloqueImagen}
                <div class="info-articulo">
                    <h3>${producto.nombre}</h3>
                    <ul class="lista-specs">
                        ${producto.specs}
                    </ul>
                    <span class="precio">$${precioFormateado}</span>
                    <button class="btn-neon-pequeno" onclick="agregarAlCarrito(${producto.id})" style="width: 100%; border: none; cursor: pointer; font-family: inherit;">
                        Agregar al carrito
                    </button>
                </div>
            </article>
        `;
    });

    contenedor.innerHTML = htmlGenerado;
}

// =========================================
// 3. LÓGICA DE BÚSQUEDA Y FILTROS
// =========================================
const inputBuscador = document.getElementById("buscador-productos");
const selectCategoria = document.getElementById("filtro-categorias");

function filtrarCatalogo() {
    const textoBusqueda = inputBuscador.value.toLowerCase();
    const categoriaElegida = selectCategoria.value;

    const productosFiltrados = catalogoParlantes.filter(producto => {
        const coincideNombre = producto.nombre.toLowerCase().includes(textoBusqueda);
        const coincideCategoria = categoriaElegida === "todos" || producto.categoria === categoriaElegida;
        return coincideNombre && coincideCategoria;
    });

    cargarProductos(productosFiltrados);
}

inputBuscador.addEventListener("input", filtrarCatalogo);
selectCategoria.addEventListener("change", filtrarCatalogo);

cargarProductos();

// =========================================
// 4. LÓGICA DEL PANEL DEL CARRITO (ABRIR/CERRAR)
// =========================================
const btnAbrirCarrito = document.getElementById("btn-abrir-carrito");
const ventanaCarrito = document.getElementById("ventana-carrito");
const btnCerrarCarrito = document.getElementById("btn-cerrar-carrito");

btnAbrirCarrito.addEventListener("click", (e) => {
    e.preventDefault(); 
    ventanaCarrito.classList.add("carrito-abierto");
});

btnCerrarCarrito.addEventListener("click", () => {
    ventanaCarrito.classList.remove("carrito-abierto");
});

// =========================================
// 5. MOTOR DE COMPRAS (AGREGAR, ELIMINAR, SUMAR, GUARDAR)
// =========================================
let carrito = JSON.parse(localStorage.getItem("carritoTechMarea")) || [];

function guardarEnMemoria() {
    localStorage.setItem("carritoTechMarea", JSON.stringify(carrito));
}

function agregarAlCarrito(idProducto) {
    const productoEnCarrito = carrito.find(item => item.id === idProducto);
    
    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        const productoElegido = catalogoParlantes.find(producto => producto.id === idProducto);
        carrito.push({ ...productoElegido, cantidad: 1 });
    }
    
    guardarEnMemoria(); 
    renderizarCarrito();
    ventanaCarrito.classList.add("carrito-abierto");
}

function renderizarCarrito() {
    const contenedorCarrito = document.getElementById("lista-carrito-items");
    const contadorCarrito = document.getElementById("contador-carrito");
    const totalCarrito = document.getElementById("total-carrito");

    contenedorCarrito.innerHTML = ""; 

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = '<p class="carrito-vacio">El carrito está vacío.</p>';
        contadorCarrito.innerText = "0";
        totalCarrito.innerText = "$0";
        return;
    }

    let total = 0;
    let cantidadTotalItems = 0;

    carrito.forEach((producto) => {
        const item = document.createElement("div");
        item.style.display = "flex";
        item.style.justifyContent = "space-between";
        item.style.alignItems = "center";
        item.style.marginBottom = "15px";
        item.style.borderBottom = "1px solid #333";
        item.style.paddingBottom = "10px";

        let subtotalItem = producto.precio * producto.cantidad;
        let precioItemFormateado = subtotalItem.toLocaleString("es-AR");

        item.innerHTML = `
            <div style="flex-grow: 1;">
                <h5 style="color: var(--color-cian); margin: 0; font-size: 0.95rem;">${producto.nombre}</h5>
                <p style="margin: 5px 0; color: #fff; font-weight: bold;">$${precioItemFormateado}</p>
                
                <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
                    <button onclick="restarCantidad(${producto.id})" style="background: #333; color: white; border: none; padding: 2px 10px; cursor: pointer; border-radius: 4px; font-weight: bold;">-</button>
                    <span style="color: white; font-size: 0.95rem; min-width: 20px; text-align: center;">${producto.cantidad}</span>
                    <button onclick="sumarCantidad(${producto.id})" style="background: #333; color: white; border: none; padding: 2px 10px; cursor: pointer; border-radius: 4px; font-weight: bold;">+</button>
                </div>
            </div>
            <button onclick="eliminarDelCarrito(${producto.id})" style="background: none; border: none; color: #ff4c4c; cursor: pointer; font-size: 1.2rem; margin-left: 10px;" title="Eliminar producto">🗑️</button>
        `;
        
        contenedorCarrito.appendChild(item);
        
        total += subtotalItem;
        cantidadTotalItems += producto.cantidad;
    });

    contadorCarrito.innerText = cantidadTotalItems;
    totalCarrito.innerText = `$${total.toLocaleString("es-AR")}`;
}

function sumarCantidad(idProducto) {
    const producto = carrito.find(item => item.id === idProducto);
    if (producto) {
        producto.cantidad++;
        guardarEnMemoria();
        renderizarCarrito();
    }
}

function restarCantidad(idProducto) {
    const producto = carrito.find(item => item.id === idProducto);
    if (producto) {
        if (producto.cantidad > 1) {
            producto.cantidad--;
        } else {
            eliminarDelCarrito(idProducto);
            return; 
        }
        guardarEnMemoria();
        renderizarCarrito();
    }
}

function eliminarDelCarrito(idProducto) {
    carrito = carrito.filter(item => item.id !== idProducto);
    guardarEnMemoria(); 
    renderizarCarrito(); 
}

renderizarCarrito();

// =========================================
// 6. ENVIAR PEDIDO POR WHATSAPP
// =========================================
const btnPagar = document.getElementById("btn-pagar");

btnPagar.addEventListener("click", () => {
    if (carrito.length === 0) {
        alert("¡Tu carrito está vacío! Agrega algunos parlantes antes de pagar.");
        return;
    }

    const numeroWhatsApp = "5492613132991"; 
    let mensaje = "¡Hola Tech Marea! 🌊 Quiero realizar el siguiente pedido:\n\n";
    let totalPedido = 0;

    carrito.forEach((producto) => {
        let subtotal = producto.precio * producto.cantidad;
        let precioFormateado = subtotal.toLocaleString("es-AR");
        mensaje += `- ${producto.cantidad}x ${producto.nombre} ($${precioFormateado})\n`;
        totalPedido += subtotal;
    });

    mensaje += `\n*Total a pagar: $${totalPedido.toLocaleString("es-AR")}*`;

    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
    window.open(urlWhatsApp, "_blank");
});

// =========================================
// 7. VACIAR TODO EL CARRITO
// =========================================
const btnVaciarCarrito = document.getElementById("btn-vaciar-carrito");

btnVaciarCarrito.addEventListener("click", () => {
    if (carrito.length === 0) {
        alert("El carrito ya está vacío.");
        return;
    }

    const confirmar = confirm("¿Estás seguro de que quieres vaciar todo el carrito?");
    
    if (confirmar) {
        carrito = []; 
        guardarEnMemoria(); 
        renderizarCarrito(); 
    }
});