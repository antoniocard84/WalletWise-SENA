/**
 * PROYECTO: WALLETWISE - SISTEMA DE GESTIÓN FINANCIERA PERSONAL
 * ARCHIVO: js/app.js
 * DESCRIPCIÓN: Lógica principal para autenticación de usuarios, persistencia en 
 *              LocalStorage, renderizado dinámico del Dashboard y alertas de presupuesto.
 */

// ============================================================================
// 0. INICIALIZACIÓN Y MENSAJE DE CONSOLA
// ============================================================================

console.log(
    "%c WalletWise v1.0 %c Desarrollado por Antony & Gabriela ",
    "background: #2563eb; color: white; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px;",
    "background: #1e293b; color: #94a3b8; padding: 4px 8px; border-radius: 0 4px 4px 0;"
);

/**
 * Crea automáticamente los usuarios predeterminados si la memoria local está vacía.
 */
(function crearUsuariosIniciales() {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuariosNuevos = [
        {
            nombre: "Antony",
            correo: "antony@walletwise.com",
            password: "123"
        },
        {
            nombre: "Gabriela",
            correo: "gabriela@walletwise.com",
            password: "456"
        }
    ];

    usuariosNuevos.forEach(nuevoUsuario => {
        const existe = usuarios.some(u => u.correo === nuevoUsuario.correo);
        if (!existe) {
            usuarios.push(nuevoUsuario);
        }
    });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
})();

// ============================================================================
// 1. INTERFAZ Y COMPONENTES
// ============================================================================

/**
 * Alterna la visibilidad del campo de contraseña.
 * @param {string} inputId - ID del campo input en el DOM.
 */
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.type = input.type === "password" ? "text" : "password";
}

// ============================================================================
// 2. AUTENTICACIÓN Y CONTROL DE ACCESO
// ============================================================================

/**
 * Registra un nuevo usuario en LocalStorage.
 */
function registrarUsuario() {
    const inputNombre = document.getElementById("nombreRegistro");
    const inputCorreo = document.getElementById("correoRegistro");
    const inputPassword = document.getElementById("passwordRegistro");

    if (!inputNombre || !inputCorreo || !inputPassword) return;

    const nombre = inputNombre.value.trim();
    const correo = inputCorreo.value.trim().toLowerCase();
    const password = inputPassword.value.trim();

    if (nombre === "" || correo === "" || password === "") {
        alert("Por favor completa todos los campos.");
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (usuarios.some(u => u.correo === correo)) {
        alert("Este correo ya está registrado.");
        return;
    }

    usuarios.push({ nombre, correo, password });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Usuario registrado correctamente.");
    window.location.href = "index.html";
}

/**
 * Valida credenciales e inicia sesión.
 */
function iniciarSesion() {
    const inputCorreo = document.getElementById("correoLogin");
    const inputPassword = document.getElementById("passwordLogin");

    if (!inputCorreo || !inputPassword) return;

    const correo = inputCorreo.value.trim().toLowerCase();
    const password = inputPassword.value.trim();

    if (correo === "" || password === "") {
        alert("Ingresa tu correo y contraseña.");
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioEncontrado = usuarios.find(u => u.correo.toLowerCase() === correo && u.password === password);

    if (usuarioEncontrado) {
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));
        alert("Bienvenido " + usuarioEncontrado.nombre);
        window.location.href = "dashboard.html";
    } else {
        alert("Correo o contraseña incorrectos.");
    }
}

/**
 * Inicia una sesión temporal como Invitado.
 */
function entrarInvitado() {
    const invitado = {
        nombre: "Invitado",
        correo: "invitado@walletwise.com"
    };

    localStorage.setItem("usuarioActivo", JSON.stringify(invitado));
    alert("Entrando como invitado.");
    window.location.href = "dashboard.html";
}

/**
 * Cierra la sesión activa y redirige al login.
 */
function cerrarSesion() {
    localStorage.removeItem("usuarioActivo");
    alert("Sesión cerrada correctamente.");
    window.location.href = "index.html";
}

// ============================================================================
// 3. MOVIMIENTOS Y TRANSACCIONES
// ============================================================================

/**
 * Guarda una nueva transacción vinculada al usuario activo.
 */
function guardarMovimiento() {
    const inputTipo = document.getElementById("tipo");
    const inputDesc = document.getElementById("descripcion");
    const inputMonto = document.getElementById("monto");
    const inputCat = document.getElementById("categoria");
    const inputFecha = document.getElementById("fecha");

    if (!inputTipo || !inputDesc || !inputMonto || !inputCat || !inputFecha) return;

    const tipo = inputTipo.value;
    const descripcion = inputDesc.value.trim();
    const monto = parseFloat(inputMonto.value);
    const categoria = inputCat.value;
    const fecha = inputFecha.value;

    if (descripcion === "" || isNaN(monto) || monto <= 0 || fecha === "") {
        alert("Por favor completa todos los campos correctamente.");
        return;
    }

    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    const correoUsuario = usuarioActivo ? usuarioActivo.correo : "invitado@walletwise.com";

    const movimiento = {
        id: Date.now(),
        correoUsuario: correoUsuario,
        tipo,
        descripcion,
        monto,
        categoria,
        fecha
    };

    let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
    movimientos.push(movimiento);
    localStorage.setItem("movimientos", JSON.stringify(movimientos));

    alert("Movimiento guardado correctamente.");
    window.location.href = "dashboard.html";
}

/**
 * Elimina un movimiento por su ID único.
 * @param {number} id - Timestamp identificador.
 */
function eliminarMovimiento(id) {
    let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
    movimientos = movimientos.filter(m => m.id !== id);

    localStorage.setItem("movimientos", JSON.stringify(movimientos));
    location.reload();
}

// ============================================================================
// 4. MÓDULO DE ALERTAS Y LÍMITES DE GASTO
// ============================================================================

/**
 * Almacena el límite presupuestario configurado por el usuario en sesión.
 */
function guardarLimiteGasto() {
    const inputLimite = document.getElementById("limiteGastoInput");
    if (!inputLimite) return;

    const limiteVal = parseFloat(inputLimite.value);

    if (isNaN(limiteVal) || limiteVal <= 0) {
        alert("Por favor ingresa un monto válido mayor a 0.");
        return;
    }

    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!usuarioActivo) return;

    // Se guarda en LocalStorage indexado por el correo del usuario
    localStorage.setItem(`limite_${usuarioActivo.correo}`, limiteVal);
    alert("¡Límite de gasto actualizado!");
    location.reload();
}

/**
 * Despliega el modal visual de alerta.
 * @param {number} limite - El límite configurado.
 * @param {number} gastosActuales - La suma acumulada de sus gastos.
 */
function mostrarModalAlerta(limite, gastosActuales) {
    const modal = document.getElementById("modalAlerta");
    const elLimite = document.getElementById("modalLimiteMonto");
    const elGastos = document.getElementById("modalGastoActual");

    if (modal && elLimite && elGastos) {
        elLimite.innerText = limite;
        elGastos.innerText = gastosActuales;
        modal.classList.remove("hidden");
    }
}

/**
 * Cierra el modal de alerta.
 */
function cerrarModalAlerta() {
    const modal = document.getElementById("modalAlerta");
    if (modal) {
        modal.classList.add("hidden");
    }
}

// ============================================================================
// 5. CARGAR Y RENDERIZAR DASHBOARD
// ============================================================================

document.addEventListener("DOMContentLoaded", function () {
    const listaMovimientos = document.getElementById("listaMovimientos");

    if (!listaMovimientos) return;

    // 1. Verificación de Autenticación
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!usuarioActivo) {
        window.location.href = "index.html";
        return;
    }

    // 2. Banner de Saludo Personalizado
    const saludo = document.createElement("div");
    saludo.className = "bg-gradient-to-r from-blue-500 to-sky-400 text-white p-4 rounded-2xl mb-5 font-bold shadow-md flex justify-between items-center";
    saludo.innerHTML = `
        <span>Hola, ${usuarioActivo.nombre} 👋</span>
        <span class="text-xs bg-white/20 px-2.5 py-1 rounded-full font-normal">Cuenta Activa</span>
    `;
    listaMovimientos.parentNode.insertBefore(saludo, listaMovimientos);

    // 3. Filtrar Movimientos del Usuario
    const todosMovimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
    const misMovimientos = todosMovimientos.filter(m => m.correoUsuario === usuarioActivo.correo);

    let ingresos = 0;
    let gastos = 0;

    listaMovimientos.innerHTML = "";

    if (misMovimientos.length === 0) {
        listaMovimientos.innerHTML = '<p class="text-center text-slate-400 text-sm py-6">No tienes movimientos registrados.</p>';
    } else {
        const copiaMovimientos = [...misMovimientos].reverse();

        copiaMovimientos.forEach(function (movimiento) {
            const monto = Number(movimiento.monto);

            if (movimiento.tipo === "Ingreso") {
                ingresos += monto;
            } else {
                gastos += monto;
            }

            const isIngreso = movimiento.tipo === "Ingreso";
            const color = isIngreso ? "text-blue-600" : "text-slate-700";
            const signo = isIngreso ? "+" : "-";
            const icono = isIngreso ? "fa-wallet text-blue-500" : "fa-receipt text-slate-400";

            const div = document.createElement("div");
            div.className = "bg-white border border-slate-100 p-4 rounded-2xl flex justify-between items-center shadow-sm hover:shadow-md transition";

            div.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-sm">
                        <i class="fa-solid ${icono}"></i>
                    </div>
                    <div>
                        <p class="font-bold text-slate-800 text-sm">${movimiento.descripcion}</p>
                        <p class="text-[11px] text-slate-400 font-medium">${movimiento.categoria} • ${movimiento.fecha}</p>
                    </div>
                </div>
                <div class="flex flex-col items-end gap-1">
                    <p class="${color} font-bold text-sm">${signo} $${monto}</p>
                    <button
                        onclick="eliminarMovimiento(${movimiento.id})"
                        class="text-red-500 hover:text-red-700 text-xs font-medium transition cursor-pointer">
                        Eliminar
                    </button>
                </div>
            `;

            listaMovimientos.appendChild(div);
        });
    }

    // 4. Actualizar Totales en la Interfaz
    const elIngresos = document.getElementById("ingresos");
    const elGastos = document.getElementById("gastos");
    const elBalance = document.getElementById("balance");

    if (elIngresos) elIngresos.innerText = "$ " + ingresos;
    if (elGastos) elGastos.innerText = "$ " + gastos;
    if (elBalance) elBalance.innerText = "$ " + (ingresos - gastos);

    // 5. Control y Verificación de Límite de Gasto / Alertas
    const limiteGuardado = localStorage.getItem(`limite_${usuarioActivo.correo}`);
    const inputLimite = document.getElementById("limiteGastoInput");
    const estadoAlerta = document.getElementById("estadoAlerta");

    if (limiteGuardado) {
        if (inputLimite) inputLimite.value = limiteGuardado;

        if (gastos > parseFloat(limiteGuardado)) {
            if (estadoAlerta) {
                estadoAlerta.innerText = "¡Límite Superado!";
                estadoAlerta.className = "text-[11px] px-2.5 py-1 rounded-full bg-red-100 text-red-600 font-bold";
            }
            // Muestra el modal de alerta si los gastos exceden el tope fijado
            mostrarModalAlerta(limiteGuardado, gastos);
        } else {
            if (estadoAlerta) {
                estadoAlerta.innerText = "Dentro del límite";
                estadoAlerta.className = "text-[11px] px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-600 font-bold";
            }
        }
    }
});
console.log("Prueba de actualización realizada");