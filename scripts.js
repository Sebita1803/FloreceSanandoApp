document.addEventListener('DOMContentLoaded', function() {
    // Redirigir a index.html si se accede a la raíz del servidor
    if (window.location.pathname === '/') {
        window.location.href = 'http://127.0.0.1:5500/index.html#';
    }
    // Mostrar la introducción con animación
    const introduccion = document.querySelector('.introduccion');
    if (introduccion) {
        setTimeout(() => {
            introduccion.classList.add('show');
        }, 500);
    }
    // Generar el gráfico llamativo
    if (window.location.pathname.endsWith('index.html')) {
        generarGraficoResumen();
        mostrarNotificacionesPrioridad();
        configurarIntervalosNotificaciones();
    }
    // Inicializar el calendario en la página de recordatorios
    if (window.location.pathname.endsWith('recordatorios.html')) {
        inicializarCalendario();
        document.getElementById('nuevoRecordatorioBtn').addEventListener('click', mostrarFormularioRecordatorio);
        document.getElementById('guardarRecordatorioBtn').addEventListener('click', guardarRecordatorio);
        document.getElementById('cancelarRecordatorioBtn').addEventListener('click', cancelarRecordatorio);
        cargarRecordatorios();
    }
    // Inicializar el gráfico contable en la página de pagos
    if (window.location.pathname.endsWith('pagos.html')) {
        inicializarGraficoContable();
        document.getElementById('nuevoPagoBtn').addEventListener('click', mostrarFormularioPago);
        document.getElementById('cancelarPagoBtn').addEventListener('click', cancelarPago);
        document.getElementById('guardarPagoBtn').addEventListener('click', guardarPago);
        cargarPagos();
    }
    // Aquí se pueden agregar las funciones interactivas y animaciones
    if (window.location.pathname.endsWith('historial_pacientes.html')) {
        cargarPacientes();
    }

    if (window.location.pathname.endsWith('nueva_sesion.html')) {
        cargarDatosPaciente();
        document.getElementById('guardarSesion').addEventListener('click', guardarSesion);
        document.getElementById('cancelarSesion').addEventListener('click', cancelarSesion);
        document.getElementById('limpiarSesion').addEventListener('click', limpiarSesion);
    }

    if (window.location.pathname.endsWith('historial_sesiones.html')) {
        cargarSesiones();
    }

    if (window.location.pathname.endsWith('pagos.html')) {
        cargarPagos();
        document.getElementById('nuevoPagoBtn').addEventListener('click', mostrarFormularioPago);
        document.getElementById('cancelarPagoBtn').addEventListener('click', cancelarPago);
        document.getElementById('guardarPagoBtn').addEventListener('click', guardarPago);
        document.getElementById('buscarOrdenPago').addEventListener('input', buscarPago);
    }

    if (window.location.pathname.endsWith('estadisticas.html')) {
        generarGraficos();
    }

    if (window.location.pathname.endsWith('index.html')) {
        generarGraficoResumen();
    }

    if (window.location.pathname.endsWith('manual.html')) {
        document.getElementById('descargarManualBtn').addEventListener('click', descargarManual);
    }

    if (window.location.pathname.endsWith('recordatorios.html')) {
        document.getElementById('nuevoRecordatorioBtn').addEventListener('click', mostrarFormularioRecordatorio);
        document.getElementById('guardarRecordatorioBtn').addEventListener('click', guardarRecordatorio);
        document.getElementById('cancelarRecordatorioBtn').addEventListener('click', cancelarRecordatorio);
        cargarRecordatorios();
    }
});

document.getElementById('nuevoPacienteForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Obtener los datos del formulario
    const nombre = document.getElementById('nombre').value;
    const rut = document.getElementById('rut').value;
    const edad = document.getElementById('edad').value;
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    const genero = document.getElementById('genero').value;
    const nacionalidad = document.getElementById('nacionalidad').value;
    const estadoCivil = document.getElementById('estadoCivil').value;
    const contacto = document.getElementById('contacto').value;
    const correo = document.getElementById('correo').value;
    const diagnostico = document.getElementById('diagnostico').value;
    const observacion = document.getElementById('observacion').value;
    
    // Crear un objeto paciente
    const paciente = {
        nombre,
        rut,
        edad,
        fechaNacimiento,
        genero,
        nacionalidad,
        estadoCivil,
        contacto,
        correo,
        diagnostico,
        observacion,
        categoria: '' // Inicialmente sin categoría
    };
    
    // Obtener los pacientes existentes de localStorage
    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    
    // Agregar el nuevo paciente a la lista
    pacientes.push(paciente);
    
    // Guardar la lista actualizada en localStorage
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
    
    // Mostrar la alerta de registro exitoso
    const alerta = document.getElementById('alerta');
    alerta.classList.add('show');
    
    // Ocultar la alerta después de 3 segundos
    setTimeout(function() {
        alerta.classList.remove('show');
    }, 3000);
    
    // Redirigir a la página de historial de pacientes
    window.location.href = 'historial_pacientes.html';
});

// Función para cargar los pacientes en la tabla de historial de pacientes
function cargarPacientes() {
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const pacientesContainer = document.getElementById('pacientesContainer');
    pacientesContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos pacientes
    
    pacientes.forEach((paciente, index) => {
        const pacienteDiv = document.createElement('div');
        pacienteDiv.className = 'paciente';
        pacienteDiv.style.backgroundColor = paciente.categoria;
        pacienteDiv.dataset.index = index;
        
        pacienteDiv.innerHTML = `
            <p><strong>Nombre Completo:</strong> ${paciente.nombre}</p>
            <p><strong>Rut:</strong> ${paciente.rut}</p>
            <p><strong>Edad:</strong> ${paciente.edad}</p>
            <p><strong>Fecha de Nacimiento:</strong> ${paciente.fechaNacimiento}</p>
            <p><strong>Género:</strong> ${paciente.genero}</p>
            <p><strong>Nacionalidad:</strong> ${paciente.nacionalidad}</p>
            <p><strong>Estado Civil:</strong> ${paciente.estadoCivil}</p>
            <p><strong>Número de Contacto:</strong> ${paciente.contacto}</p>
            <p><strong>Correo Electrónico:</strong> ${paciente.correo}</p>
            <p><strong>Diagnóstico de Ingreso:</strong> ${paciente.diagnostico}</p>
            <p><strong>Observación Inicial:</strong> ${paciente.observacion}</p>
            <button class="eliminar" onclick="eliminarPaciente(${index})">Eliminar</button>
            <button class="categorizar" onclick="mostrarOpcionesCategoria(${index})">Categorizar</button>
            <button class="sesion" onclick="redirigirNuevaSesion(${index})">Nueva Sesión</button>
            <div id="opcionesCategoria${index}" class="opciones-categoria" style="display: none;">
                <button class="leve" onclick="categorizarPaciente(${index}, 'leve')">Leve</button>
                <button class="intermedio" onclick="categorizarPaciente(${index}, 'intermedio')">Intermedio</button>
                <button class="severo" onclick="categorizarPaciente(${index}, 'severo')">Severo</button>
            </div>
        `;
        
        pacientesContainer.appendChild(pacienteDiv);
    });
}

// Función para eliminar un paciente
function eliminarPaciente(index) {
    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    pacientes.splice(index, 1);
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
    
    // Eliminar el paciente del DOM
    const pacienteDiv = document.querySelector(`.paciente[data-index="${index}"]`);
    if (pacienteDiv) {
        pacienteDiv.remove();
    }
    
    mostrarNotificacion('Eliminado con éxito', 'error');
}

// Función para mostrar las opciones de categoría
function mostrarOpcionesCategoria(index) {
    document.getElementById(`opcionesCategoria${index}`).style.display = 'flex';
}

// Función para categorizar un paciente
function categorizarPaciente(index, categoria) {
    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    let color;
    switch (categoria) {
        case 'leve':
            color = '#b3e6b3'; // Verde pastel
            break;
        case 'intermedio':
            color = '#ffffb3'; // Amarillo pastel
            break;
        case 'severo':
            color = '#ffb3b3'; // Rojo pastel
            break;
    }
    pacientes[index].categoria = color;
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
    cargarPacientes();
}

// Función para redirigir a la página de nueva sesión
function redirigirNuevaSesion(index) {
    localStorage.setItem('pacienteSeleccionado', index);
    window.location.href = 'nueva_sesion.html';
}

function mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.getElementById('notificacion');
    notificacion.textContent = mensaje;
    notificacion.className = `notificacion ${tipo}`;
    notificacion.style.display = 'block';

    setTimeout(function() {
        notificacion.style.display = 'none';
    }, 3000);
}

// Función para cargar los datos del paciente seleccionado en la página de nueva sesión
function cargarDatosPaciente() {
    const index = localStorage.getItem('pacienteSeleccionado');
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const paciente = pacientes[index];
    
    const datosPacienteDiv = document.getElementById('datosPaciente');
    datosPacienteDiv.innerHTML = `
        <p><strong>Nombre Completo:</strong> ${paciente.nombre}</p>
        <p><strong>Rut:</strong> ${paciente.rut}</p>
        <p><strong>Edad:</strong> ${paciente.edad}</p>
        <p><strong>Fecha de Nacimiento:</strong> ${paciente.fechaNacimiento}</p>
        <p><strong>Género:</strong> ${paciente.genero}</p>
        <p><strong>Nacionalidad:</strong> ${paciente.nacionalidad}</p>
        <p><strong>Estado Civil:</strong> ${paciente.estadoCivil}</p>
        <p><strong>Número de Contacto:</strong> ${paciente.contacto}</p>
        <p><strong>Correo Electrónico:</strong> ${paciente.correo}</p>
        <p><strong>Diagnóstico de Ingreso:</strong> ${paciente.diagnostico}</p>
        <p><strong>Observación Inicial:</strong> ${paciente.observacion}</p>
    `;
}

// Función para guardar la sesión
function guardarSesion() {
    const index = localStorage.getItem('pacienteSeleccionado');
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const paciente = pacientes[index];
    const anotaciones = document.getElementById('anotaciones').value;
    
    const sesion = {
        paciente,
        anotaciones,
        fecha: new Date().toLocaleString()
    };
    
    let sesiones = JSON.parse(localStorage.getItem('sesiones')) || [];
    sesiones.push(sesion);
    localStorage.setItem('sesiones', JSON.stringify(sesiones));
    
    const notificacion = document.getElementById('notificacion');
    notificacion.textContent = 'Sesión guardada con éxito';
    notificacion.classList.add('show');
    notificacion.style.backgroundColor = '#4CAF50';
    
    setTimeout(function() {
        notificacion.classList.remove('show');
        window.location.href = 'historial_sesiones.html';
    }, 3000);
}

// Función para cancelar la sesión
function cancelarSesion() {
    window.location.href = 'historial_pacientes.html';
}

// Función para limpiar el cuadro de texto
function limpiarSesion() {
    document.getElementById('anotaciones').value = '';
    const notificacion = document.getElementById('notificacion');
    notificacion.textContent = 'Cuadro limpio';
    notificacion.classList.add('show');
    notificacion.style.backgroundColor = '#ffcc00';
    
    setTimeout(function() {
        notificacion.classList.remove('show');
    }, 3000);
}

// Función para cargar las sesiones en la página de historial de sesiones
function cargarSesiones() {
    const sesiones = JSON.parse(localStorage.getItem('sesiones')) || [];
    const sesionesContainer = document.getElementById('sesionesContainer');
    sesionesContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas sesiones

    sesiones.forEach((sesion, index) => {
        const sesionDiv = document.createElement('div');
        sesionDiv.className = 'sesion';
        
        sesionDiv.innerHTML = `
            <p><strong>Nombre Completo:</strong> ${sesion.paciente.nombre}</p>
            <p><strong>Rut:</strong> ${sesion.paciente.rut}</p>
            <p><strong>Edad:</strong> ${sesion.paciente.edad}</p>
            <p><strong>Fecha de Nacimiento:</strong> ${sesion.paciente.fechaNacimiento}</p>
            <p><strong>Género:</strong> ${sesion.paciente.genero}</p>
            <p><strong>Nacionalidad:</strong> ${sesion.paciente.nacionalidad}</p>
            <p><strong>Estado Civil:</strong> ${sesion.paciente.estadoCivil}</p>
            <p><strong>Número de Contacto:</strong> ${sesion.paciente.contacto}</p>
            <p><strong>Correo Electrónico:</strong> ${sesion.paciente.correo}</p>
            <p><strong>Diagnóstico de Ingreso:</strong> ${sesion.paciente.diagnostico}</p>
            <p><strong>Observación Inicial:</strong> ${sesion.paciente.observacion}</p>
            <p><strong>Fecha de Sesión:</strong> ${sesion.fecha}</p>
            <button class="ver" onclick="verSesion(${index})">Ver</button>
            <button class="eliminar" onclick="eliminarSesion(${index})">Eliminar</button>
            <button class="descargar" onclick="descargarSesion(${index})">Descargar</button>
            <div id="anotaciones${index}" class="anotaciones" style="display: none;">
                <p>${sesion.anotaciones}</p>
            </div>
        `;
        
        sesionesContainer.appendChild(sesionDiv);
    });
}

// Función para ver/ocultar la previsualización de la sesión
function verSesion(index) {
    const anotacionesDiv = document.getElementById(`anotaciones${index}`);
    anotacionesDiv.style.display = anotacionesDiv.style.display === 'none' ? 'block' : 'none';
}

// Función para eliminar una sesión
function eliminarSesion(index) {
    let sesiones = JSON.parse(localStorage.getItem('sesiones')) || [];
    sesiones.splice(index, 1);
    localStorage.setItem('sesiones', JSON.stringify(sesiones));
    
    mostrarNotificacion('Eliminado con éxito', 'error');
    cargarSesiones();
}

function mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.getElementById('notificacion');
    notificacion.textContent = mensaje;
    notificacion.className = `notificacion ${tipo}`;
    notificacion.style.display = 'block';

    setTimeout(function() {
        notificacion.style.display = 'none';
    }, 3000);
}

// Función para descargar una sesión como PDF
function descargarSesion(index) {
    const { jsPDF } = window.jspdf;
    const sesiones = JSON.parse(localStorage.getItem('sesiones')) || [];
    const sesion = sesiones[index];
    const fechaActual = new Date().toLocaleString();

    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`Nombre Completo: ${sesion.paciente.nombre}`, 10, 10);
    doc.text(`Rut: ${sesion.paciente.rut}`, 10, 20);
    doc.text(`Edad: ${sesion.paciente.edad}`, 10, 30);
    doc.text(`Fecha de Nacimiento: ${sesion.paciente.fechaNacimiento}`, 10, 40);
    doc.text(`Género: ${sesion.paciente.genero}`, 10, 50);
    doc.text(`Nacionalidad: ${sesion.paciente.nacionalidad}`, 10, 60);
    doc.text(`Estado Civil: ${sesion.paciente.estadoCivil}`, 10, 70);
    doc.text(`Número de Contacto: ${sesion.paciente.contacto}`, 10, 80);
    doc.text(`Correo Electrónico: ${sesion.paciente.correo}`, 10, 90);
    doc.text(`Diagnóstico de Ingreso: ${sesion.paciente.diagnostico}`, 10, 100);
    doc.text(`Observación Inicial: ${sesion.paciente.observacion}`, 10, 110);
    doc.text(`Fecha de Sesión: ${sesion.fecha}`, 10, 120);
    doc.text(`Anotaciones:`, 10, 130);
    doc.text(sesion.anotaciones, 10, 140, { maxWidth: 180 });
    doc.text(`Fecha de Generación del PDF: ${fechaActual}`, 10, 150);

    doc.save(`Sesion_${sesion.paciente.nombre.replace(/ /g, "_")}_${sesion.fecha.replace(/[:/]/g, "-")}.pdf`);
}

// Generar un número de orden de pago aleatorio de 6 dígitos
function generarOrdenPago() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Mostrar el formulario de nuevo pago
function mostrarFormularioPago() {
    document.getElementById('nuevoPagoForm').style.display = 'block';
    document.getElementById('ordenPago').value = generarOrdenPago();
}

// Cancelar el nuevo pago
function cancelarPago() {
    document.getElementById('nuevoPagoForm').style.display = 'none';
}

// Guardar el nuevo pago
function guardarPago() {
    const nombre = document.getElementById('nombrePago').value;
    const rut = document.getElementById('rutPago').value;
    const ordenPago = document.getElementById('ordenPago').value;
    const monto = document.getElementById('montoPago').value;
    const metodoPago = document.getElementById('metodoPago').value;
    
    const pago = {
        nombre,
        rut,
        ordenPago,
        monto,
        metodoPago,
        fecha: new Date().toLocaleString()
    };
    
    let pagos = JSON.parse(localStorage.getItem('pagos')) || [];
    pagos.push(pago);
    localStorage.setItem('pagos', JSON.stringify(pagos));
    
    const notificacion = document.getElementById('notificacion');
    notificacion.textContent = 'Pago guardado con éxito';
    notificacion.classList.add('show');
    notificacion.style.backgroundColor = '#4CAF50';
    
    // Actualizar la lista de pagos inmediatamente
    cargarPagos();
    
    setTimeout(function() {
        notificacion.classList.remove('show');
        document.getElementById('nuevoPagoForm').style.display = 'none';
    }, 3000);
}

// Función para cargar los pagos en la página de pagos
function cargarPagos() {
    const pagos = JSON.parse(localStorage.getItem('pagos')) || [];
    const registrosPagoContainer = document.getElementById('registrosPagoContainer');
    registrosPagoContainer.innerHTML = '';
    
    pagos.forEach((pago, index) => {
        const pagoDiv = document.createElement('div');
        pagoDiv.className = 'pago';
        
        pagoDiv.innerHTML = `
            <p><strong>Nombre:</strong> ${pago.nombre}</p>
            <p><strong>Rut:</strong> ${pago.rut}</p>
            <p><strong>Orden de pago:</strong> ${pago.ordenPago}</p>
            <p><strong>Monto:</strong> ${pago.monto}</p>
            <p><strong>Método de pago:</strong> ${pago.metodoPago}</p>
            <p><strong>Fecha:</strong> ${pago.fecha}</p>
            <button class="descargar" onclick="descargarComprobante(${index})">Descargar comprobante</button>
            <button class="eliminar" onclick="eliminarPago(${index})">Eliminar</button>
        `;
        
        registrosPagoContainer.appendChild(pagoDiv);
    });
}

// Función para eliminar un pago
function eliminarPago(index) {
    let pagos = JSON.parse(localStorage.getItem('pagos')) || [];
    pagos.splice(index, 1);
    localStorage.setItem('pagos', JSON.stringify(pagos));
    
    mostrarNotificacion('Pago eliminado', 'error');
    cargarPagos();
}

// Función para descargar un comprobante de pago como PDF
function descargarComprobante(index) {
    const { jsPDF } = window.jspdf;
    const pagos = JSON.parse(localStorage.getItem('pagos')) || [];
    const pago = pagos[index];
    const fechaActual = new Date().toLocaleString();

    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`Nombre: ${pago.nombre}`, 10, 10);
    doc.text(`Rut: ${pago.rut}`, 10, 20);
    doc.text(`Orden de pago: ${pago.ordenPago}`, 10, 30);
    doc.text(`Monto: ${pago.monto}`, 10, 40);
    doc.text(`Método de pago: ${pago.metodoPago}`, 10, 50);
    doc.text(`Fecha de pago: ${pago.fecha}`, 10, 60);
    doc.text(`Fecha de generación del PDF: ${fechaActual}`, 10, 70);

    doc.save(`Comprobante_Pago_${pago.ordenPago}.pdf`);
}

// Función para buscar un pago por orden de pago
function buscarPago() {
    const input = document.getElementById('buscarOrdenPago').value.toLowerCase();
    const pagos = JSON.parse(localStorage.getItem('pagos')) || [];
    const registrosPagoContainer = document.getElementById('registrosPagoContainer');
    registrosPagoContainer.innerHTML = '';

    pagos.forEach((pago, index) => {
        if (pago.ordenPago.toLowerCase().includes(input)) {
            const pagoDiv = document.createElement('div');
            pagoDiv.className = 'pago';

            pagoDiv.innerHTML = `
                <p><strong>Nombre:</strong> ${pago.nombre}</p>
                <p><strong>Rut:</strong> ${pago.rut}</p>
                <p><strong>Orden de pago:</strong> ${pago.ordenPago}</p>
                <p><strong>Monto:</strong> ${pago.monto}</p>
                <p><strong>Método de pago:</strong> ${pago.metodoPago}</p>
                <p><strong>Fecha:</strong> ${pago.fecha}</p>
                <button class="descargar" onclick="descargarComprobante(${index})">Descargar comprobante</button>
                <button class="eliminar" onclick="eliminarPago(${index})">Eliminar</button>
            `;

            registrosPagoContainer.appendChild(pagoDiv);
        }
    });
}

// Función para generar los gráficos en la página de estadísticas
function generarGraficos() {
    // Gráfico 1: Cantidad de pacientes y categorías
    const ctxPacientes = document.getElementById('graficoPacientes').getContext('2d');
    const pacientesData = JSON.parse(localStorage.getItem('pacientes')) || [];
    const categorias = { leve: 0, intermedio: 0, severo: 0 };

    pacientesData.forEach(paciente => {
        if (paciente.categoria === '#b3e6b3') categorias.leve++;
        if (paciente.categoria === '#ffffb3') categorias.intermedio++;
        if (paciente.categoria === '#ffb3b3') categorias.severo++;
    });

    new Chart(ctxPacientes, {
        type: 'bar',
        data: {
            labels: ['Total Pacientes', 'Leve', 'Intermedio', 'Severo'],
            datasets: [{
                label: 'Cantidad',
                data: [pacientesData.length, categorias.leve, categorias.intermedio, categorias.severo],
                backgroundColor: ['#b3e6b3', '#ffffb3', '#ffb3b3', '#cce5ff'],
                borderColor: ['#8BC34A', '#FFEB3B', '#F44336', '#1E88E5'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1500,
                easing: 'easeOutBounce'
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#333'
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#fff',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#333'
                    }
                },
                x: {
                    ticks: {
                        color: '#333'
                    }
                }
            }
        }
    });

    // Gráfico 2: Cantidad de sesiones por paciente
    const ctxSesiones = document.getElementById('graficoSesiones').getContext('2d');
    const sesionesData = JSON.parse(localStorage.getItem('sesiones')) || [];
    const sesionesPorPaciente = {};

    sesionesData.forEach(sesion => {
        const nombre = sesion.paciente.nombre;
        if (!sesionesPorPaciente[nombre]) {
            sesionesPorPaciente[nombre] = 0;
        }
        sesionesPorPaciente[nombre]++;
    });

    new Chart(ctxSesiones, {
        type: 'bar',
        data: {
            labels: Object.keys(sesionesPorPaciente),
            datasets: [{
                label: 'Sesiones',
                data: Object.values(sesionesPorPaciente),
                backgroundColor: '#cce5ff',
                borderColor: '#1E88E5',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1500,
                easing: 'easeOutBounce'
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#333'
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#fff',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#333'
                    }
                },
                x: {
                    ticks: {
                        color: '#333'
                    }
                }
            }
        }
    });

    // Gráfico 3: Estadísticas contables
    const ctxContabilidad = document.getElementById('graficoContabilidad').getContext('2d');
    const pagosData = JSON.parse(localStorage.getItem('pagos')) || [];
    const montos = pagosData.map(pago => pago.monto);
    const totalPagos = montos.length;
    const montoTotal = montos.reduce((acc, monto) => acc + monto, 0);
    const montoPromedio = montoTotal / totalPagos;
    const montoMaximo = Math.max(...montos);
    const montoMinimo = Math.min(...montos);

    new Chart(ctxContabilidad, {
        type: 'line',
        data: {
            labels: ['Total Pagos', 'Monto Total', 'Monto Promedio', 'Monto Máximo', 'Monto Mínimo'],
            datasets: [{
                label: 'Estadísticas Contables',
                data: [totalPagos, montoTotal, montoPromedio, montoMaximo, montoMinimo],
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1500,
                easing: 'easeOutBounce'
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#333'
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#fff',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#333'
                    }
                },
                x: {
                    ticks: {
                        color: '#333'
                    }
                }
            }
        }
    });
}

// Función para generar el gráfico de resumen en la página de inicio
function generarGraficoResumen() {
    const ctxResumen = document.getElementById('graficoResumen').getContext('2d');
    const pacientesData = JSON.parse(localStorage.getItem('pacientes')) || [];
    const sesionesData = JSON.parse(localStorage.getItem('sesiones')) || [];
    const pagosData = JSON.parse(localStorage.getItem('pagos')) || [];

    const categorias = { leve: 0, intermedio: 0, severo: 0 };
    pacientesData.forEach(paciente => {
        if (paciente.categoria === '#b3e6b3') categorias.leve++;
        if (paciente.categoria === '#ffffb3') categorias.intermedio++;
        if (paciente.categoria === '#ffb3b3') categorias.severo++;
    });

    const totalPacientes = pacientesData.length;
    const totalSesiones = sesionesData.length;
    const totalPagos = pagosData.length;

    new Chart(ctxResumen, {
        type: 'bar',
        data: {
            labels: ['Pacientes', 'Categorizaciones', 'Sesiones', 'Pagos'],
            datasets: [
                {
                    label: 'Total Pacientes',
                    data: [totalPacientes, 0, 0, 0],
                    backgroundColor: '#b3e6b3',
                    borderColor: '#8BC34A',
                    borderWidth: 1
                },
                {
                    label: 'Leve',
                    data: [0, categorias.leve, 0, 0],
                    backgroundColor: '#cce5ff',
                    borderColor: '#1E88E5',
                    borderWidth: 1
                },
                {
                    label: 'Intermedio',
                    data: [0, categorias.intermedio, 0, 0],
                    backgroundColor: '#ffffb3',
                    borderColor: '#FFEB3B',
                    borderWidth: 1
                },
                {
                    label: 'Severo',
                    data: [0, categorias.severo, 0, 0],
                    backgroundColor: '#ffb3b3',
                    borderColor: '#F44336',
                    borderWidth: 1
                },
                {
                    label: 'Total Sesiones',
                    data: [0, 0, totalSesiones, 0],
                    backgroundColor: '#ffccff',
                    borderColor: '#E91E63',
                    borderWidth: 1
                },
                {
                    label: 'Total Pagos',
                    data: [0, 0, 0, totalPagos],
                    backgroundColor: '#ffebcc',
                    borderColor: '#FF9800',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            animation: {
                duration: 2000,
                easing: 'easeOutBounce'
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#333',
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#fff',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: '#333',
                        font: {
                            size: 14
                        }
                    }
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: '#333',
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    });
}

// Función para descargar el manual en PDF
function descargarManual() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Manual de Uso de FloreceSanandoApp', 10, 10);
    doc.text('Introducción', 10, 20);
    doc.text('Bienvenido al manual de uso de FloreceSanandoApp. Aquí encontrarás toda la información necesaria para utilizar la plataforma de manera eficiente.', 10, 30, { maxWidth: 180 });
    doc.text('Registro de Pacientes', 10, 50);
    doc.text('Para registrar un nuevo paciente, sigue estos pasos:', 10, 60);
    doc.text('1. Haz clic en "Pacientes" en el menú principal.', 10, 70);
    doc.text('2. Selecciona "Nuevo Paciente".', 10, 80);
    doc.text('3. Rellena el formulario con la información del paciente.', 10, 90);
    doc.text('4. Haz clic en "Registrar".', 10, 100);
    doc.text('El formulario de registro incluye los siguientes campos:', 10, 110);
    doc.text('- Nombre Completo: El nombre completo del paciente.', 10, 120);
    doc.text('- Rut: El RUT del paciente.', 10, 130);
    doc.text('- Edad: La edad del paciente.', 10, 140);
    doc.text('- Fecha de Nacimiento: La fecha de nacimiento del paciente.', 10, 150);
    doc.text('- Género: El género del paciente (masculino, femenino, prefiero no mencionar).', 10, 160);
    doc.text('- Nacionalidad: La nacionalidad del paciente.', 10, 170);
    doc.text('- Estado Civil: El estado civil del paciente (soltero, casado, viudo).', 10, 180);
    doc.text('- Número de Contacto: El número de contacto del paciente.', 10, 190);
    doc.text('- Correo Electrónico: El correo electrónico del paciente.', 10, 200);
    doc.text('- Diagnóstico de Ingreso: El diagnóstico inicial del paciente (opcional).', 10, 210);
    doc.text('- Observación Inicial: Cualquier observación inicial sobre el paciente (opcional).', 10, 220);
    doc.text('Gestión de Pacientes', 10, 230);
    doc.text('Para gestionar los pacientes registrados, sigue estos pasos:', 10, 240);
    doc.text('1. Haz clic en "Pacientes" en el menú principal.', 10, 250);
    doc.text('2. Selecciona "Historial de pacientes".', 10, 260);
    doc.text('En la lista de pacientes, puedes realizar las siguientes acciones:', 10, 270);
    doc.text('- Eliminar: Haz clic en el botón "Eliminar" para eliminar un paciente.', 10, 280);
    doc.text('- Categorizar: Haz clic en el botón "Categorizar" para asignar una categoría al paciente (leve, intermedio, severo).', 10, 290);
    doc.text('- Nueva Sesión: Haz clic en el botón "Nueva Sesión" para registrar una nueva sesión para el paciente.', 10, 300);
    doc.text('Gestión de Sesiones', 10, 310);
    doc.text('Para gestionar las sesiones, sigue estos pasos:', 10, 320);
    doc.text('1. Haz clic en "Sesiones" en el menú principal.', 10, 330);
    doc.text('2. Selecciona "Nueva Sesión" para registrar una nueva sesión.', 10, 340);
    doc.text('3. Rellena el formulario con la información de la sesión.', 10, 350);
    doc.text('4. Haz clic en "Guardar Sesión".', 10, 360);
    doc.text('El formulario de registro de sesiones incluye los siguientes campos:', 10, 370);
    doc.text('- Nombre Completo: El nombre completo del paciente.', 10, 380);
    doc.text('- Rut: El RUT del paciente.', 10, 390);
    doc.text('- Edad: La edad del paciente.', 10, 400);
    doc.text('- Fecha de Nacimiento: La fecha de nacimiento del paciente.', 10, 410);
    doc.text('- Género: El género del paciente.', 10, 420);
    doc.text('- Nacionalidad: La nacionalidad del paciente.', 10, 430);
    doc.text('- Estado Civil: El estado civil del paciente.', 10, 440);
    doc.text('- Número de Contacto: El número de contacto del paciente.', 10, 450);
    doc.text('- Correo Electrónico: El correo electrónico del paciente.', 10, 460);
    doc.text('- Diagnóstico de Ingreso: El diagnóstico inicial del paciente.', 10, 470);
    doc.text('- Observación Inicial: Cualquier observación inicial sobre el paciente.', 10, 480);
    doc.text('- Anotaciones: Las anotaciones de la sesión.', 10, 490);
    doc.text('Para ver el historial de sesiones, sigue estos pasos:', 10, 500);
    doc.text('1. Haz clic en "Sesiones" en el menú principal.', 10, 510);
    doc.text('2. Selecciona "Historial de sesiones".', 10, 520);
    doc.text('En la lista de sesiones, puedes realizar las siguientes acciones:', 10, 530);
    doc.text('- Ver: Haz clic en el botón "Ver" para ver los detalles de la sesión.', 10, 540);
    doc.text('- Eliminar: Haz clic en el botón "Eliminar" para eliminar una sesión.', 10, 550);
    doc.text('- Descargar: Haz clic en el botón "Descargar" para descargar un resumen de la sesión en PDF.', 10, 560);
    doc.text('Gestión de Pagos', 10, 570);
    doc.text('Para gestionar los pagos, sigue estos pasos:', 10, 580);
    doc.text('1. Haz clic en "Pagos" en el menú principal.', 10, 590);
    doc.text('2. Selecciona "Nuevo Pago" para registrar un nuevo pago.', 10, 600);
    doc.text('3. Rellena el formulario con la información del pago.', 10, 610);
    doc.text('4. Haz clic en "Guardar Pago".', 10, 620);
    doc.text('El formulario de registro de pagos incluye los siguientes campos:', 10, 630);
    doc.text('- Nombre: El nombre del paciente.', 10, 640);
    doc.text('- Rut: El RUT del paciente.', 10, 650);
    doc.text('- Orden de pago: El número de orden de pago (generado automáticamente).', 10, 660);
    doc.text('- Monto: El monto del pago.', 10, 670);
    doc.text('- Método de pago: El método de pago utilizado.', 10, 680);
    doc.text('Para ver el historial de pagos, sigue estos pasos:', 10, 690);
    doc.text('1. Haz clic en "Pagos" en el menú principal.', 10, 700);
    doc.text('2. Selecciona "Historial de pagos".', 10, 710);
    doc.text('En la lista de pagos, puedes realizar las siguientes acciones:', 10, 720);
    doc.text('- Descargar: Haz clic en el botón "Descargar" para descargar un comprobante de pago en PDF.', 10, 730);
    doc.text('- Eliminar: Haz clic en el botón "Eliminar" para eliminar un pago.', 10, 740);
    doc.text('Estadísticas', 10, 750);
    doc.text('Para ver las estadísticas, sigue estos pasos:', 10, 760);
    doc.text('1. Haz clic en "Estadísticas" en el menú principal.', 10, 770);
    doc.text('2. Revisa los gráficos interactivos para obtener información detallada.', 10, 780);
    doc.text('Los gráficos incluyen:', 10, 790);
    doc.text('- Gráfico de Pacientes: Muestra la cantidad total de pacientes y su distribución por categorías (leve, intermedio, severo).', 10, 800);
    doc.text('- Gráfico de Sesiones: Muestra la cantidad de sesiones por paciente.', 10, 810);
    doc.text('- Gráfico de Contabilidad: Muestra estadísticas contables como el total de pagos, monto total, monto promedio, monto máximo y monto mínimo.', 10, 820);
    doc.save('Manual_de_Uso_FloreceSanandoApp.pdf');
}

function descargarPDF(nombrePaciente, fechaSesion) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Historial de Sesión", 20, 20);
    doc.setFontSize(12);
    doc.text(`Nombre del Paciente: ${nombrePaciente}`, 20, 30);
    doc.text(`Fecha de la Sesión: ${fechaSesion}`, 20, 40);
    doc.text("Detalles de la sesión:", 20, 50);
    doc.text("Aquí puedes agregar más detalles de la sesión...", 20, 60);

    doc.save(`Sesion_${nombrePaciente.replace(/ /g, "_")}_${fechaSesion.replace(/\//g, "-")}.pdf`);
}

function mostrarFormularioRecordatorio() {
    document.getElementById('nuevoRecordatorioForm').style.display = 'block';
}

function cancelarRecordatorio() {
    document.getElementById('nuevoRecordatorioForm').style.display = 'none';
}

function guardarRecordatorio() {
    const texto = document.getElementById('textoRecordatorio').value;
    const fecha = document.getElementById('fechaRecordatorio').value;

    const recordatorio = {
        texto,
        fecha,
        prioridad: 'baja' // Prioridad por defecto
    };

    let recordatorios = JSON.parse(localStorage.getItem('recordatorios')) || [];
    recordatorios.push(recordatorio);
    localStorage.setItem('recordatorios', JSON.stringify(recordatorios));

    mostrarNotificacion('Recordatorio guardado', 'success');

    setTimeout(function() {
        document.getElementById('nuevoRecordatorioForm').style.display = 'none';
    }, 3000);

    cargarRecordatorios();
    actualizarCalendario();
}

function cargarRecordatorios() {
    const recordatorios = JSON.parse(localStorage.getItem('recordatorios')) || [];
    const registroRecordatoriosContainer = document.getElementById('registroRecordatoriosContainer');
    registroRecordatoriosContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos recordatorios

    recordatorios.forEach((recordatorio, index) => {
        const recordatorioDiv = document.createElement('div');
        recordatorioDiv.className = 'recordatorio';
        recordatorioDiv.style.backgroundColor = obtenerColorPrioridad(recordatorio.prioridad);
        recordatorioDiv.innerHTML = `
            <p>${recordatorio.texto}</p>
            <p>${recordatorio.fecha}</p>
            <button class="eliminar" onclick="eliminarRecordatorio(${index})">Eliminar</button>
            <div class="prioridad-botones">
                <button class="prioridad-alta" onclick="cambiarPrioridad(${index}, 'alta')">Prioridad Alta</button>
                <button class="prioridad-media" onclick="cambiarPrioridad(${index}, 'media')">Prioridad Media</button>
                <button class="prioridad-baja" onclick="cambiarPrioridad(${index}, 'baja')">Prioridad Baja</button>
            </div>
        `;
        registroRecordatoriosContainer.appendChild(recordatorioDiv);
        setTimeout(() => {
            recordatorioDiv.classList.add('show');
        }, 100);
    });
}

function eliminarRecordatorio(index) {
    let recordatorios = JSON.parse(localStorage.getItem('recordatorios')) || [];
    recordatorios.splice(index, 1);
    localStorage.setItem('recordatorios', JSON.stringify(recordatorios));
    mostrarNotificacion('Recordatorio eliminado', 'error');
    cargarRecordatorios();
    actualizarCalendario();
}

function cambiarPrioridad(index, prioridad) {
    let recordatorios = JSON.parse(localStorage.getItem('recordatorios')) || [];
    recordatorios[index].prioridad = prioridad;
    localStorage.setItem('recordatorios', JSON.stringify(recordatorios));
    cargarRecordatorios();
    actualizarCalendario();
}

function obtenerColorPrioridad(prioridad) {
    switch (prioridad) {
        case 'alta':
            return '#ff4d4d'; // Rojo
        case 'media':
            return '#ffcc00'; // Amarillo
        case 'baja':
            return '#b3e6b3'; // Verde
        default:
            return '#ffffff'; // Blanco por defecto
    }
}

function mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.getElementById('notificacion');
    notificacion.textContent = mensaje;
    notificacion.className = `notificacion ${tipo}`;
    notificacion.style.display = 'block';

    setTimeout(function() {
        notificacion.style.display = 'none';
    }, 3000);
}

function mostrarNotificacionesPrioridad() {
    const recordatorios = JSON.parse(localStorage.getItem('recordatorios')) || [];
    const recordatoriosAlta = recordatorios.filter(recordatorio => recordatorio.prioridad === 'alta');
    const recordatoriosMedia = recordatorios.filter(recordatorio => recordatorio.prioridad === 'media');
    const recordatoriosBaja = recordatorios.filter(recordatorio => recordatorio.prioridad === 'baja');

    if (recordatoriosAlta.length > 0) {
        mostrarNotificacionTemporal(recordatoriosAlta[0].texto, 'alta', 7000);
    }
    if (recordatoriosMedia.length > 0) {
        mostrarNotificacionTemporal(recordatoriosMedia[0].texto, 'media', 5000);
    }
    if (recordatoriosBaja.length > 0) {
        mostrarNotificacionTemporal(recordatoriosBaja[0].texto, 'baja', 3000);
    }
}

function mostrarNotificacionTemporal(texto, prioridad, duracion) {
    const notificacionesContainer = document.getElementById('notificaciones');
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.style.backgroundColor = obtenerColorPrioridad(prioridad);
    notificacion.textContent = `Recordatorio de ${prioridad} prioridad: ${texto}`;
    notificacionesContainer.appendChild(notificacion);

    setTimeout(() => {
        notificacion.classList.add('show');
    }, 100);

    setTimeout(() => {
        notificacion.classList.remove('show');
        setTimeout(() => {
            notificacionesContainer.removeChild(notificacion);
        }, 500);
    }, duracion);
}

function configurarIntervalosNotificaciones() {
    setInterval(() => {
        const recordatoriosAlta = JSON.parse(localStorage.getItem('recordatorios')) || [];
        const alta = recordatoriosAlta.filter(recordatorio => recordatorio.prioridad === 'alta');
        if (alta.length > 0) {
            mostrarNotificacionTemporal(alta[0].texto, 'alta', 7000);
        }
    }, 180000); // 3 minutos

    setInterval(() => {
        const recordatoriosMedia = JSON.parse(localStorage.getItem('recordatorios')) || [];
        const media = recordatoriosMedia.filter(recordatorio => recordatorio.prioridad === 'media');
        if (media.length > 0) {
            mostrarNotificacionTemporal(media[0].texto, 'media', 5000);
        }
    }, 240000); // 4 minutos

    setInterval(() => {
        const recordatoriosBaja = JSON.parse(localStorage.getItem('recordatorios')) || [];
        const baja = recordatoriosBaja.filter(recordatorio => recordatorio.prioridad === 'baja');
        if (baja.length > 0) {
            mostrarNotificacionTemporal(baja[0].texto, 'baja', 3000);
        }
    }, 300000); // 5 minutos
}

function inicializarCalendario() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: obtenerEventosCalendario(),
        eventColor: '#378006',
        editable: true,
        droppable: true,
        eventDrop: function(info) {
            actualizarFechaRecordatorio(info.event);
        }
    });
    calendar.render();
}

function obtenerEventosCalendario() {
    const recordatorios = JSON.parse(localStorage.getItem('recordatorios')) || [];
    return recordatorios.map(recordatorio => ({
        title: recordatorio.texto,
        start: recordatorio.fecha,
        backgroundColor: obtenerColorPrioridad(recordatorio.prioridad)
    }));
}

function actualizarCalendario() {
    const calendarEl = document.getElementById('calendar');
    const calendar = FullCalendar.getCalendar(calendarEl);
    calendar.removeAllEvents();
    calendar.addEventSource(obtenerEventosCalendario());
}

function actualizarFechaRecordatorio(event) {
    const recordatorios = JSON.parse(localStorage.getItem('recordatorios')) || [];
    const recordatorio = recordatorios.find(r => r.texto === event.title);
    if (recordatorio) {
        recordatorio.fecha = event.startStr;
        localStorage.setItem('recordatorios', JSON.stringify(recordatorios));
        mostrarNotificacion('Fecha de recordatorio actualizada', 'success');
    }
}

function inicializarGraficoContable() {
    const ctx = document.getElementById('graficoContable').getContext('2d');
    const pagos = JSON.parse(localStorage.getItem('pagos')) || [];
    const montos = pagos.map(pago => pago.monto);
    const totalPagos = montos.length;
    const montoTotal = montos.reduce((acc, monto) => acc + monto, 0);
    const montoPromedio = montoTotal / totalPagos;
    const montoMaximo = Math.max(...montos);
    const montoMinimo = Math.min(...montos);

    const data = {
        labels: ['Total Pagos', 'Monto Total', 'Monto Promedio', 'Monto Máximo', 'Monto Mínimo'],
        datasets: [{
            label: 'Estadísticas Contables',
            data: [totalPagos, montoTotal, montoPromedio, montoMaximo, montoMinimo],
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    };

    const options = {
        responsive: true,
        animation: {
            duration: 1500,
            easing: 'easeOutBounce'
        },
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: '#333'
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0,0,0,0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#fff',
                borderWidth: 1
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#333'
                }
            },
            x: {
                ticks: {
                    color: '#333'
                }
            }
        }
    };

    const graficoContable = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });

    // Actualizar el gráfico en tiempo real
    setInterval(() => {
        const pagosActualizados = JSON.parse(localStorage.getItem('pagos')) || [];
        const montosActualizados = pagosActualizados.map(pago => pago.monto);
        const totalPagosActualizados = montosActualizados.length;
        const montoTotalActualizado = montosActualizados.reduce((acc, monto) => acc + monto, 0);
        const montoPromedioActualizado = montoTotalActualizado / totalPagosActualizados;
        const montoMaximoActualizado = Math.max(...montosActualizados);
        const montoMinimoActualizado = Math.min(...montosActualizados);

        graficoContable.data.datasets[0].data = [
            totalPagosActualizados,
            montoTotalActualizado,
            montoPromedioActualizado,
            montoMaximoActualizado,
            montoMinimoActualizado
        ];
        graficoContable.update();
    }, 5000); // Actualizar cada 5 segundos
}
