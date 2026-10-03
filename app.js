document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // PRODUCTOS
    // =====================================================

    const productos = [
        {
            id: "cocacola-personal",
            nombre: "Coca-Cola personal",
            grupo: "personal"
        },
        {
            id: "premio-personal",
            nombre: "Premio personal",
            grupo: "personal"
        },
        {
            id: "quatro-personal",
            nombre: "Quatro personal",
            grupo: "personal"
        },
        {
            id: "agua-natural",
            nombre: "Agua natural",
            grupo: "personal"
        },
        {
            id: "agua-gas",
            nombre: "Agua con gas",
            grupo: "personal"
        },
        {
            id: "soda",
            nombre: "Soda",
            grupo: "personal"
        },
        {
            id: "cocacola-15",
            nombre: "Coca-Cola 1.5 L",
            grupo: "15"
        },
        {
            id: "premio-15",
            nombre: "Premio 1.5 L",
            grupo: "15"
        },
        {
            id: "quatro-15",
            nombre: "Quatro 1.5 L",
            grupo: "15"
        },
        {
            id: "cocacola-3",
            nombre: "Coca-Cola 3 L",
            grupo: "3"
        },
        {
            id: "hit-1",
            nombre: "Hit 1 L",
            grupo: "hit"
        }
    ];


    // =====================================================
    // GRUPOS
    // =====================================================

    const grupos = {
        personal: {
            titulo: "Personal"
        },
        "15": {
            titulo: "Gaseosas 1.5 L"
        },
        "3": {
            titulo: "Coca-Cola 3 L"
        },
        hit: {
            titulo: "Hit"
        }
    };


    // =====================================================
    // CLAVE PARA GUARDAR LOS INVENTARIOS
    // =====================================================

    const CLAVE_INVENTARIOS = "inventariosBebidas";


    // =====================================================
    // FECHA
    // =====================================================

    function obtenerFechaActual() {
        const hoy = new Date();

        const año = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, "0");
        const dia = String(hoy.getDate()).padStart(2, "0");

        return `${año}-${mes}-${dia}`;
    }


    function actualizarFechaMostrada() {
        const fechaInput = document.getElementById("fechaInventario");
        const fechaMostrada = document.getElementById("fechaMostrada");

        if (!fechaInput || !fechaMostrada) {
            return;
        }

        if (!fechaInput.value) {
            fechaMostrada.textContent = "--/--/----";
            return;
        }

        const partes = fechaInput.value.split("-");

        fechaMostrada.textContent =
            `${partes[2]}/${partes[1]}/${partes[0]}`;
    }


    function establecerFecha() {
        const fechaInput = document.getElementById("fechaInventario");

        if (!fechaInput) {
            return;
        }

        fechaInput.value = obtenerFechaActual();

        actualizarFechaMostrada();

        fechaInput.addEventListener("change", actualizarFechaMostrada);
    }


    // =====================================================
    // INVENTARIOS GUARDADOS
    // =====================================================

    function obtenerInventariosGuardados() {
        try {
            const datos = localStorage.getItem(CLAVE_INVENTARIOS);

            if (!datos) {
                return {};
            }

            return JSON.parse(datos);
        } catch (error) {
            console.error("Error al leer los inventarios:", error);
            return {};
        }
    }


    function guardarInventariosGuardados(inventarios) {
        localStorage.setItem(
            CLAVE_INVENTARIOS,
            JSON.stringify(inventarios)
        );
    }


    function formatearFecha(fecha) {
        if (!fecha) {
            return "--/--/----";
        }

        const partes = fecha.split("-");

        if (partes.length !== 3) {
            return fecha;
        }

        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }


    // =====================================================
    // OBTENER TODOS LOS DATOS DEL FORMULARIO
    // =====================================================

    function obtenerDatosFormulario() {
        const datos = {};

        document
            .querySelectorAll('input[type="number"]')
            .forEach(function (input) {

                datos[input.id] = input.value;
            });

        return datos;
    }


    // =====================================================
    // CARGAR DATOS EN EL FORMULARIO
    // =====================================================

    function cargarDatosFormulario(datos) {

        document
            .querySelectorAll('input[type="number"]')
            .forEach(function (input) {

                if (
                    datos &&
                    Object.prototype.hasOwnProperty.call(
                        datos,
                        input.id
                    )
                ) {
                    input.value = datos[input.id];
                } else {
                    input.value = 0;
                }
            });
    }


    // =====================================================
    // LIMPIAR RESULTADOS VISUALES
    // =====================================================

    function limpiarResultadosVisuales() {

        const resumen = document.getElementById(
            "resumenInventario"
        );

        if (resumen) {
            resumen.innerHTML = `
                <div class="estado-inicial">
                    <h3>El resumen aparecerá aquí</h3>
                    <p>
                        Cuando registremos las ventas y hagamos
                        los cálculos, esta sección mostrará
                        el inventario disponible, las ventas
                        y el saldo esperado.
                    </p>
                </div>
            `;
        }


        productos.forEach(function (producto) {

            const elemento = document.getElementById(
                `diferencia-${producto.id}`
            );

            if (elemento) {
                elemento.textContent = "Diferencia: 0";
                elemento.className = "diferencia-individual";
            }
        });


        const generales = [
            "generalEsperadoPersonal",
            "generalFisicoPersonal",
            "generalDiferenciaPersonal",

            "generalEsperado15",
            "generalFisico15",
            "generalDiferencia15",

            "generalEsperado3",
            "generalFisico3",
            "generalDiferencia3",

            "generalEsperadoHit",
            "generalFisicoHit",
            "generalDiferenciaHit"
        ];


        generales.forEach(function (id) {

            const elemento = document.getElementById(id);

            if (elemento) {
                elemento.textContent = "0";
                elemento.className = "estado";
            }
        });


        const mensaje = document.getElementById(
            "mensajeFinal"
        );

        if (mensaje) {
            mensaje.innerHTML = "";
            mensaje.className = "mensaje-final";
        }
    }


    // =====================================================
    // ACTUALIZAR HISTORIAL
    // =====================================================

    function actualizarHistorial() {

        const contenedor = document.getElementById(
            "historialInventarios"
        );

        if (!contenedor) {
            return;
        }


        const inventarios = obtenerInventariosGuardados();

        const fechas = Object.keys(inventarios).sort(
            function (a, b) {
                return b.localeCompare(a);
            }
        );


        if (fechas.length === 0) {

            contenedor.innerHTML = `
                <div class="historial-vacio">
                    <strong>Aún no hay inventarios guardados.</strong>
                    <span>
                        Cuando guardes tu primer inventario,
                        aparecerá aquí.
                    </span>
                </div>
            `;

            return;
        }


        let html = "";


        fechas.forEach(function (fecha) {

            const inventario = inventarios[fecha];

            const nombreFecha = formatearFecha(fecha);

            const hora = inventario.hora || "";


            html += `
                <div class="historial-item">

                    <div class="historial-info">

                        <strong>
                            Inventario del ${nombreFecha}
                        </strong>

                        <span>
                            Guardado ${hora ? `a las ${hora}` : ""}
                        </span>

                    </div>


                    <div class="historial-acciones">

                        <button
                            type="button"
                            class="boton-historial boton-abrir"
                            data-fecha="${fecha}"
                        >
                            Abrir
                        </button>

                        <button
                            type="button"
                            class="boton-historial boton-eliminar"
                            data-fecha="${fecha}"
                        >
                            Eliminar
                        </button>

                    </div>

                </div>
            `;
        });


        contenedor.innerHTML = html;


        contenedor
            .querySelectorAll(".boton-abrir")
            .forEach(function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        const fecha =
                            boton.dataset.fecha;

                        const fechaInput =
                            document.getElementById(
                                "fechaInventario"
                            );

                        if (fechaInput) {
                            fechaInput.value = fecha;
                            actualizarFechaMostrada();
                        }

                        cargarInventarioDelDia(fecha);
                    }
                );
            });


        contenedor
            .querySelectorAll(".boton-eliminar")
            .forEach(function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        const fecha =
                            boton.dataset.fecha;

                        eliminarInventario(fecha);
                    }
                );
            });
    }


    // =====================================================
    // ABRIR / CREAR INVENTARIO DEL DÍA
    // =====================================================

    function abrirCrearInventario() {

        const fechaInput = document.getElementById(
            "fechaInventario"
        );

        if (!fechaInput || !fechaInput.value) {

            alert(
                "Primero selecciona una fecha."
            );

            return;
        }


        const fecha = fechaInput.value;

        const inventarios = obtenerInventariosGuardados();


        if (
            Object.prototype.hasOwnProperty.call(
                inventarios,
                fecha
            )
        ) {

            cargarInventarioDelDia(fecha);

            mostrarAviso(
                `Se abrió el inventario del ${formatearFecha(fecha)}.`
            );

        } else {

            cargarDatosFormulario({});

            limpiarResultadosVisuales();

            mostrarAviso(
                `Nuevo inventario creado para el ${formatearFecha(fecha)}.`
            );
        }


        actualizarFechaMostrada();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    // =====================================================
    // CARGAR INVENTARIO DEL DÍA
    // =====================================================

    function cargarInventarioDelDia(fecha) {

        const inventarios = obtenerInventariosGuardados();

        const inventario = inventarios[fecha];


        if (!inventario) {

            cargarDatosFormulario({});

            limpiarResultadosVisuales();

            return;
        }


        cargarDatosFormulario(
            inventario.datos || {}
        );

        limpiarResultadosVisuales();

        mostrarAviso(
            `Inventario del ${formatearFecha(fecha)} cargado correctamente.`
        );
    }


    // =====================================================
    // GUARDAR INVENTARIO DEL DÍA
    // =====================================================

    function guardarInventarioDelDia() {

        const fechaInput = document.getElementById(
            "fechaInventario"
        );

        if (!fechaInput || !fechaInput.value) {

            alert(
                "Selecciona primero la fecha del inventario."
            );

            return;
        }


        const fecha = fechaInput.value;

        const inventarios = obtenerInventariosGuardados();

        const ahora = new Date();

        const hora =
            String(ahora.getHours()).padStart(2, "0") +
            ":" +
            String(ahora.getMinutes()).padStart(2, "0");


        inventarios[fecha] = {
            fecha: fecha,
            hora: hora,
            datos: obtenerDatosFormulario()
        };


        guardarInventariosGuardados(inventarios);

        actualizarHistorial();

        mostrarAviso(
            `Inventario del ${formatearFecha(fecha)} guardado correctamente.`
        );
    }


    // =====================================================
    // ELIMINAR INVENTARIO
    // =====================================================

    function eliminarInventario(fecha) {

        const confirmar = confirm(
            `¿Seguro que quieres eliminar el inventario del ${formatearFecha(fecha)}?`
        );


        if (!confirmar) {
            return;
        }


        const inventarios = obtenerInventariosGuardados();

        delete inventarios[fecha];

        guardarInventariosGuardados(inventarios);

        actualizarHistorial();


        const fechaInput = document.getElementById(
            "fechaInventario"
        );


        if (
            fechaInput &&
            fechaInput.value === fecha
        ) {

            cargarDatosFormulario({});

            limpiarResultadosVisuales();
        }


        mostrarAviso(
            `Inventario del ${formatearFecha(fecha)} eliminado.`
        );
    }


    // =====================================================
    // AVISO
    // =====================================================

    function mostrarAviso(texto) {

        const aviso = document.getElementById(
            "avisoInventario"
        );

        if (!aviso) {
            return;
        }


        aviso.textContent = texto;

        aviso.className =
            "aviso-inventario aviso-visible";


        setTimeout(function () {

            aviso.className =
                "aviso-inventario";

        }, 3500);
    }


    // =====================================================
    // GENERAR VENTAS DE MESAS
    // =====================================================

    function generarVentasMesas() {

        const contenedor =
            document.getElementById("ventasMesas");

        if (!contenedor) {
            return;
        }


        contenedor.innerHTML = "";


        Object.keys(grupos).forEach(function (grupo) {

            const productosGrupo =
                productos.filter(function (producto) {

                    return producto.grupo === grupo;

                });


            const bloque =
                document.createElement("div");

            bloque.className = "grupo-ventas";


            let campos = "";


            productosGrupo.forEach(function (producto) {

                campos += `
                    <div class="campo-venta">

                        <label for="mesa-${producto.id}">
                            ${producto.nombre}
                        </label>

                        <input
                            type="number"
                            id="mesa-${producto.id}"
                            min="0"
                            step="1"
                            value="0"
                        >

                    </div>
                `;
            });


            bloque.innerHTML = `
                <div class="titulo-grupo">

                    <h3>
                        ${grupos[grupo].titulo}
                    </h3>

                </div>

                <div class="ventas-grid">
                    ${campos}
                </div>
            `;


            contenedor.appendChild(bloque);
        });
    }


    // =====================================================
    // GENERAR VENTAS DE DOMICILIOS
    // =====================================================

    function generarVentasDomicilios() {

        const contenedor =
            document.getElementById(
                "ventasDomicilios"
            );

        if (!contenedor) {
            return;
        }


        contenedor.innerHTML = "";


        Object.keys(grupos).forEach(function (grupo) {

            const productosGrupo =
                productos.filter(function (producto) {

                    return producto.grupo === grupo;

                });


            const bloque =
                document.createElement("div");

            bloque.className = "grupo-ventas";


            let campos = "";


            productosGrupo.forEach(function (producto) {

                campos += `
                    <div class="campo-venta">

                        <label for="domicilio-${producto.id}">
                            ${producto.nombre}
                        </label>

                        <input
                            type="number"
                            id="domicilio-${producto.id}"
                            min="0"
                            step="1"
                            value="0"
                        >

                    </div>
                `;
            });


            bloque.innerHTML = `
                <div class="titulo-grupo">

                    <h3>
                        ${grupos[grupo].titulo}
                    </h3>

                </div>

                <div class="ventas-grid">
                    ${campos}
                </div>
            `;


            contenedor.appendChild(bloque);
        });
    }


    // =====================================================
    // GENERAR CONTEO FÍSICO INDIVIDUAL
    // =====================================================

    function generarConteoIndividual() {

        const contenedor =
            document.getElementById(
                "conteoIndividual"
            );

        if (!contenedor) {
            return;
        }


        contenedor.innerHTML = "";


        Object.keys(grupos).forEach(function (grupo) {

            const productosGrupo =
                productos.filter(function (producto) {

                    return producto.grupo === grupo;

                });


            const bloque =
                document.createElement("div");

            bloque.className =
                "conteo-individual-grupo";


            let campos = "";


            productosGrupo.forEach(function (producto) {

                campos += `
                    <div class="conteo-individual-item">

                        <label for="fisico-${producto.id}">
                            ${producto.nombre}
                        </label>

                        <input
                            type="number"
                            id="fisico-${producto.id}"
                            min="0"
                            step="1"
                            value="0"
                        >

                        <div
                            class="diferencia-individual"
                            id="diferencia-${producto.id}"
                        >
                            Diferencia: 0
                        </div>

                    </div>
                `;
            });


            bloque.innerHTML = `
                <div class="titulo-grupo">

                    <h3>
                        ${grupos[grupo].titulo}
                    </h3>

                </div>

                <div class="conteo-individual-grid">
                    ${campos}
                </div>
            `;


            contenedor.appendChild(bloque);
        });
    }


    // =====================================================
    // OBTENER VALOR NUMÉRICO
    // =====================================================

    function obtenerNumero(id) {

        const elemento =
            document.getElementById(id);

        if (!elemento) {
            return 0;
        }


        const valor =
            parseFloat(elemento.value);


        if (isNaN(valor)) {
            return 0;
        }


        return valor;
    }


    // =====================================================
    // CALCULAR INVENTARIO
    // =====================================================

    function calcularInventario() {

        const resultados = {};


        productos.forEach(function (producto) {

            const inicial =
                obtenerNumero(
                    `inicial-${producto.id}`
                );

            const ingreso =
                obtenerNumero(
                    `ingreso-${producto.id}`
                );

            const mesas =
                obtenerNumero(
                    `mesa-${producto.id}`
                );

            const domicilios =
                obtenerNumero(
                    `domicilio-${producto.id}`
                );

            const fisico =
                obtenerNumero(
                    `fisico-${producto.id}`
                );


            const disponible =
                inicial + ingreso;

            const ventas =
                mesas + domicilios;

            const esperado =
                disponible - ventas;

            const diferencia =
                fisico - esperado;


            resultados[producto.id] = {

                producto: producto,

                inicial: inicial,

                ingreso: ingreso,

                disponible: disponible,

                mesas: mesas,

                domicilios: domicilios,

                ventas: ventas,

                esperado: esperado,

                fisico: fisico,

                diferencia: diferencia
            };
        });


        mostrarResumen(resultados);

        actualizarDiferencias(resultados);

        actualizarGenerales(resultados);

        mostrarMensaje(resultados);
    }


    // =====================================================
    // MOSTRAR RESUMEN
    // =====================================================

    function mostrarResumen(resultados) {

        const contenedor =
            document.getElementById(
                "resumenInventario"
            );

        if (!contenedor) {
            return;
        }


        contenedor.innerHTML = "";


        Object.keys(grupos).forEach(function (grupo) {

            const productosGrupo =
                productos.filter(function (producto) {

                    return producto.grupo === grupo;

                });


            const bloque =
                document.createElement("div");

            bloque.className =
                "resumen-grupo";


            let filas = "";


            productosGrupo.forEach(function (producto) {

                const r =
                    resultados[producto.id];


                filas += `
                    <tr>

                        <td>
                            ${producto.nombre}
                        </td>

                        <td class="numero">
                            ${r.inicial}
                        </td>

                        <td class="numero">
                            ${r.ingreso}
                        </td>

                        <td class="numero">
                            ${r.disponible}
                        </td>

                        <td class="numero">
                            ${r.ventas}
                        </td>

                        <td class="numero">
                            ${r.esperado}
                        </td>

                    </tr>
                `;
            });


            bloque.innerHTML = `

                <div class="titulo-grupo">

                    <h3>
                        ${grupos[grupo].titulo}
                    </h3>

                </div>


                <div class="tabla-contenedor">

                    <table class="tabla-inventario">

                        <thead>

                            <tr>

                                <th>
                                    Producto
                                </th>

                                <th>
                                    Inicial
                                </th>

                                <th>
                                    Ingresos
                                </th>

                                <th>
                                    Disponible
                                </th>

                                <th>
                                    Ventas
                                </th>

                                <th>
                                    Saldo esperado
                                </th>

                            </tr>

                        </thead>


                        <tbody>
                            ${filas}
                        </tbody>

                    </table>

                </div>
            `;


            contenedor.appendChild(bloque);
        });
    }


    // =====================================================
    // ACTUALIZAR DIFERENCIAS INDIVIDUALES
    // =====================================================

    function actualizarDiferencias(resultados) {

        productos.forEach(function (producto) {

            const elemento =
                document.getElementById(
                    `diferencia-${producto.id}`
                );


            if (!elemento) {
                return;
            }


            const diferencia =
                resultados[producto.id].diferencia;


            if (diferencia === 0) {

                elemento.textContent =
                    "Diferencia: 0";

                elemento.className =
                    "diferencia-individual estado-ok";

            }

            else if (diferencia < 0) {

                elemento.textContent =
                    `Diferencia: ${diferencia} (faltante)`;

                elemento.className =
                    "diferencia-individual estado-error";

            }

            else {

                elemento.textContent =
                    `Diferencia: +${diferencia} (sobrante)`;

                elemento.className =
                    "diferencia-individual estado-alerta";
            }
        });
    }


    // =====================================================
    // ACTUALIZAR CONTEO GENERAL
    // =====================================================

    function actualizarGenerales(resultados) {

        const configuracion = {

            personal: {

                productos: [
                    "cocacola-personal",
                    "premio-personal",
                    "quatro-personal",
                    "agua-natural",
                    "agua-gas",
                    "soda"
                ],

                esperado: "generalEsperadoPersonal",
                fisico: "generalFisicoPersonal",
                diferencia: "generalDiferenciaPersonal"
            },


            "15": {

                productos: [
                    "cocacola-15",
                    "premio-15",
                    "quatro-15"
                ],

                esperado: "generalEsperado15",
                fisico: "generalFisico15",
                diferencia: "generalDiferencia15"
            },


            "3": {

                productos: [
                    "cocacola-3"
                ],

                esperado: "generalEsperado3",
                fisico: "generalFisico3",
                diferencia: "generalDiferencia3"
            },


            hit: {

                productos: [
                    "hit-1"
                ],

                esperado: "generalEsperadoHit",
                fisico: "generalFisicoHit",
                diferencia: "generalDiferenciaHit"
            }
        };


        Object.keys(configuracion).forEach(function (grupo) {

            const informacion =
                configuracion[grupo];


            let totalEsperado = 0;

            let totalFisico = 0;


            informacion.productos.forEach(function (id) {

                if (!resultados[id]) {
                    return;
                }


                totalEsperado +=
                    resultados[id].esperado;

                totalFisico +=
                    resultados[id].fisico;
            });


            const diferencia =
                totalFisico - totalEsperado;


            const esperadoElemento =
                document.getElementById(
                    informacion.esperado
                );

            const fisicoElemento =
                document.getElementById(
                    informacion.fisico
                );

            const diferenciaElemento =
                document.getElementById(
                    informacion.diferencia
                );


            if (esperadoElemento) {

                esperadoElemento.textContent =
                    totalEsperado;
            }


            if (fisicoElemento) {

                fisicoElemento.textContent =
                    totalFisico;
            }


            if (diferenciaElemento) {

                diferenciaElemento.textContent =
                    diferencia;

                diferenciaElemento.className =
                    "estado";


                if (diferencia === 0) {

                    diferenciaElemento.classList.add(
                        "estado-ok"
                    );

                }

                else if (diferencia < 0) {

                    diferenciaElemento.classList.add(
                        "estado-error"
                    );

                }

                else {

                    diferenciaElemento.classList.add(
                        "estado-alerta"
                    );
                }
            }
        });
    }


    // =====================================================
    // MENSAJE FINAL
    // =====================================================

    function mostrarMensaje(resultados) {

        const mensaje =
            document.getElementById(
                "mensajeFinal"
            );


        if (!mensaje) {
            return;
        }


        let faltantes = 0;

        let sobrantes = 0;


        productos.forEach(function (producto) {

            const diferencia =
                resultados[producto.id].diferencia;


            if (diferencia < 0) {

                faltantes +=
                    Math.abs(diferencia);

            }

            else if (diferencia > 0) {

                sobrantes += diferencia;
            }
        });


        if (
            faltantes === 0 &&
            sobrantes === 0
        ) {

            mensaje.className =
                "mensaje-final mensaje-ok";


            mensaje.innerHTML = `

                <h3>
                    Inventario cuadrado
                </h3>

                <p>
                    El conteo físico coincide con el saldo esperado
                    en todos los productos.
                </p>

            `;

        }

        else {

            mensaje.className =
                "mensaje-final mensaje-error";


            mensaje.innerHTML = `

                <h3>
                    Revisar inventario
                </h3>

                <p>
                    Se encontraron diferencias entre el saldo esperado
                    y el conteo físico individual.
                </p>

                <p>

                    Faltantes:
                    <strong>${faltantes}</strong>

                    &nbsp; | &nbsp;

                    Sobrantes:
                    <strong>${sobrantes}</strong>

                </p>

            `;
        }
    }


    // =====================================================
    // LIMPIAR DATOS
    // =====================================================

    function limpiarDatos() {

        const confirmar =
            confirm(
                "¿Seguro que quieres limpiar los datos de este inventario? Los datos guardados en el historial no se eliminarán."
            );


        if (!confirmar) {
            return;
        }


        document
            .querySelectorAll('input[type="number"]')
            .forEach(function (input) {

                input.value = 0;
            });


        limpiarResultadosVisuales();


        mostrarAviso(
            "Los datos de la pantalla fueron limpiados. El inventario guardado permanece en el historial."
        );
    }


    // =====================================================
    // CONECTAR BOTONES
    // =====================================================

    function conectarBotones() {

        const botonCalcular =
            document.getElementById(
                "btnCalcular"
            );

        const botonLimpiar =
            document.getElementById(
                "btnLimpiar"
            );

        const botonAbrir =
            document.getElementById(
                "btnAbrirInventario"
            );

        const botonGuardar =
            document.getElementById(
                "btnGuardarInventario"
            );


        if (botonCalcular) {

            botonCalcular.addEventListener(
                "click",
                calcularInventario
            );
        }


        if (botonLimpiar) {

            botonLimpiar.addEventListener(
                "click",
                limpiarDatos
            );
        }


        if (botonAbrir) {

            botonAbrir.addEventListener(
                "click",
                abrirCrearInventario
            );
        }


        if (botonGuardar) {

            botonGuardar.addEventListener(
                "click",
                guardarInventarioDelDia
            );
        }
    }


    // =====================================================
    // INICIAR SISTEMA
    // =====================================================

    establecerFecha();

    generarVentasMesas();

    generarVentasDomicilios();

    generarConteoIndividual();

    actualizarHistorial();

    conectarBotones();

});