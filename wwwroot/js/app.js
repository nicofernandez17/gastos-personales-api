// app.js - maneja usuarios, gastos e ingresos y actualiza el gráfico cuando corresponde

const apiUrl = "http://localhost:5235/api";

// Obtener usuarioId de la URL si existe
const usuarioId = parseInt(new URLSearchParams(window.location.search).get("usuarioId"));

// ------------------- FUNCIONES -------------------

// Cargar todos los usuarios
async function fetchUsuarios() {
    try {
        const res = await fetch(`${apiUrl}/usuarios`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const usuarios = await res.json();
        const list = document.getElementById("usuariosList");
        if (!list) return;

        list.innerHTML = "";
        usuarios.forEach(u => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerHTML = `
                ${escapeHtml(u.nombre)} 
                <a href="usuario.html?usuarioId=${u.id}" class="btn btn-sm btn-primary">Ver detalles</a>
            `;
            list.appendChild(li);
        });
    } catch (err) {
        console.error("Error cargando usuarios:", err);
    }
}

// Cargar un usuario por ID
async function fetchUsuario(id) {
    try {
        const res = await fetch(`${apiUrl}/usuarios/${id}`);
        if (!res.ok) throw new Error("Usuario no encontrado");
        const usuario = await res.json();
        const nombreElem = document.getElementById("usuarioNombre");
        if (nombreElem) nombreElem.innerText = usuario.nombre;
        return usuario;
    } catch (err) {
        console.error("fetchUsuario:", err);
        // no hago alert para no molestar si se llama automáticamente
        return null;
    }
}

// Cargar gastos por usuario (intenta endpoint /api/gastos?usuarioId=..., si falla usa /api/usuarios/{id})
async function fetchGastos(usuarioId) {
    try {
        let gastos = [];
        // primero intento endpoint directo (si existe en tu API)
        let res = await fetch(`${apiUrl}/gastos?usuarioId=${usuarioId}`);
        if (res.ok) {
            gastos = await res.json();
        } else {
            // fallback: pedir el usuario y obtener usuario.gastos
            res = await fetch(`${apiUrl}/usuarios/${usuarioId}`);
            if (!res.ok) throw new Error("No se pudieron cargar los gastos (usuario).");
            const usuario = await res.json();
            gastos = usuario.gastos || [];
        }

        const tbody = document.querySelector("#gastosTable tbody");
        if (!tbody) return;

        tbody.innerHTML = "";
        gastos.forEach(g => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${escapeHtml(g.descripcion)}</td><td>${formatNumber(g.monto)}</td><td>${escapeHtml(g.categoria || '')}</td>`;
            tbody.appendChild(tr);
        });

        // Si el módulo del gráfico está cargado, actualizarlo
        if (window.renderGastosChart) {
            try { window.renderGastosChart(usuarioId, gastos); } catch (err) { console.warn("renderGastosChart falló:", err); }
        }

        return gastos;
    } catch (err) {
        console.error("Error cargando gastos:", err);
        return [];
    }
}

// Cargar ingresos por usuario (similar a gastos)
async function fetchIngresos(usuarioId) {
    try {
        // intento endpoint /api/ingresos?usuarioId=...
        let res = await fetch(`${apiUrl}/ingresos?usuarioId=${usuarioId}`);
        let ingresos = [];
        if (res.ok) {
            ingresos = await res.json();
        } else {
            // fallback a usuario endpoint
            res = await fetch(`${apiUrl}/usuarios/${usuarioId}`);
            if (!res.ok) throw new Error("No se pudieron cargar los ingresos (usuario).");
            const usuario = await res.json();
            ingresos = usuario.ingresos || [];
        }

        const tbody = document.querySelector("#ingresosTable tbody");
        if (!tbody) return;

        tbody.innerHTML = "";
        ingresos.forEach(i => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${escapeHtml(i.descripcion)}</td><td>${formatNumber(i.monto)}</td>`;
            tbody.appendChild(tr);
        });

        return ingresos;
    } catch (err) {
        console.error("Error cargando ingresos:", err);
        return [];
    }
}

// ------------------- HELPERS -------------------

function escapeHtml(unsafe) {
    if (unsafe == null) return "";
    return String(unsafe)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatNumber(n) {
    if (n == null) return "";
    return Number(n).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

// ------------------- EVENTOS -------------------

// Al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    // Página de usuario
    if (!isNaN(usuarioId)) {
        fetchUsuario(usuarioId);
        fetchGastos(usuarioId);
        fetchIngresos(usuarioId);
    }

    // Página de listado de usuarios
    if (document.getElementById("usuariosList")) {
        fetchUsuarios();
    }
});

// Crear usuario
document.getElementById("formUsuario")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombreUsuario").value.trim();
    const email = document.getElementById("emailUsuario").value.trim();

    try {
        const res = await fetch(`${apiUrl}/usuarios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, email })
        });

        if (res.ok) {
            document.getElementById("nombreUsuario").value = "";
            document.getElementById("emailUsuario").value = "";
            // refrescar lista y cambiar a pestaña lista si existe
            fetchUsuarios();
            const tabListaElem = document.getElementById("tab-lista");
            if (tabListaElem) new bootstrap.Tab(tabListaElem).show();
        } else {
            const errorText = await safeParseError(res);
            alert("Error al crear usuario: " + errorText);
        }
    } catch (err) {
        console.error("Error creando usuario:", err);
        alert("Error creando usuario (ver consola).");
    }
});

// Crear gasto
document.getElementById("formGasto")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const descripcion = document.getElementById("descGasto").value.trim();
    const monto = parseFloat(document.getElementById("montoGasto").value);
    const categoria = document.getElementById("categoriaGasto")?.value || "Otro";

    if (isNaN(monto)) {
        alert("Monto inválido");
        return;
    }

    try {
        const res = await fetch(`${apiUrl}/gastos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ descripcion, monto, categoria, usuarioId })
        });

        if (res.ok) {
            document.getElementById("descGasto").value = "";
            document.getElementById("montoGasto").value = "";
            document.getElementById("categoriaGasto").value = "Otro";
            // refrescar tabla y gráfico
            await fetchGastos(usuarioId);
        } else {
            const errorText = await safeParseError(res);
            alert("Error al crear gasto: " + errorText);
        }
    } catch (err) {
        console.error("Error creando gasto:", err);
        alert("Error creando gasto (ver consola).");
    }
});

// Crear ingreso
document.getElementById("formIngreso")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const descripcion = document.getElementById("descIngreso").value.trim();
    const monto = parseFloat(document.getElementById("montoIngreso").value);

    if (isNaN(monto)) {
        alert("Monto inválido");
        return;
    }

    try {
        const res = await fetch(`${apiUrl}/ingresos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ descripcion, monto, usuarioId })
        });

        if (res.ok) {
            document.getElementById("descIngreso").value = "";
            document.getElementById("montoIngreso").value = "";
            await fetchIngresos(usuarioId);
        } else {
            const errorText = await safeParseError(res);
            alert("Error al crear ingreso: " + errorText);
        }
    } catch (err) {
        console.error("Error creando ingreso:", err);
        alert("Error creando ingreso (ver consola).");
    }
});

// Helper para parsear cuerpo de error si viene JSON o texto
async function safeParseError(res) {
    try {
        const txt = await res.text();
        try { const j = JSON.parse(txt); return j?.message || txt; } catch { return txt; }
    } catch { return res.statusText || "Error"; }
}


