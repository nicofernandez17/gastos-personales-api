const apiUrl = "http://localhost:5235/api";
const usuarioId = parseInt(new URLSearchParams(window.location.search).get("usuarioId"));

// ------------------- FUNCIONES -------------------
// Usuarios
async function fetchUsuarios() {
    try {
        const res = await fetch(`${apiUrl}/usuarios`);
        if (!res.ok) throw new Error("Error al obtener usuarios");
        const usuarios = await res.json();
        const list = document.getElementById("usuariosList");
        if (!list) return;
        list.innerHTML = "";
        usuarios.forEach(u => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerHTML = `${u.nombre} <a href="usuario.html?usuarioId=${u.id}" class="btn btn-sm btn-primary">Ver detalles</a>`;
            list.appendChild(li);
        });
    } catch (err) {
        console.error(err);
    }
}

// Usuario específico
async function fetchUsuario(id) {
    try {
        const res = await fetch(`${apiUrl}/usuarios/${id}`);
        if (!res.ok) throw new Error("Usuario no encontrado");
        const usuario = await res.json();
        document.getElementById("usuarioNombre").innerText = usuario.nombre;
    } catch (err) {
        console.error(err);
        document.body.innerHTML = `<h3>${err.message}. Volver a <a href='index.html'>Usuarios</a></h3>`;
    }
}

// Gastos
async function fetchGastos(usuarioId) {
    try {
        const res = await fetch(`${apiUrl}/gastos?usuarioId=${usuarioId}`);
        if (!res.ok) throw new Error("Error al obtener gastos");
        const gastos = await res.json();
        const tbody = document.querySelector("#gastosTable tbody");
        if (!tbody) return;
        tbody.innerHTML = "";
        gastos.forEach(g => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${g.descripcion}</td><td>${g.monto}</td>`;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
    }
}

// Ingresos
async function fetchIngresos(usuarioId) {
    try {
        const res = await fetch(`${apiUrl}/ingresos?usuarioId=${usuarioId}`);
        if (!res.ok) throw new Error("Error al obtener ingresos");
        const ingresos = await res.json();
        const tbody = document.querySelector("#ingresosTable tbody");
        if (!tbody) return;
        tbody.innerHTML = "";
        ingresos.forEach(i => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${i.descripcion}</td><td>${i.monto}</td>`;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
    }
}

// ------------------- EVENTOS -------------------
document.addEventListener("DOMContentLoaded", () => {
    // Si estamos en usuario.html
    if (document.getElementById("usuarioNombre")) {
        if (isNaN(usuarioId)) {
            document.body.innerHTML = `<h3>No se encontró el usuario. Volver a <a href='index.html'>Usuarios</a></h3>`;
            return;
        }
        fetchUsuario(usuarioId);
        fetchGastos(usuarioId);
        fetchIngresos(usuarioId);
    } else {
        // Estamos en index.html
        fetchUsuarios();
    }
});

// ------------------- CREAR USUARIO -------------------
document.getElementById("formUsuario")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombreUsuario").value.trim();
    const email = document.getElementById("emailUsuario").value.trim();
    if (!nombre || !email) return alert("Completa nombre y email");

    const res = await fetch(`${apiUrl}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email })
    });

    if (res.ok) {
        document.getElementById("nombreUsuario").value = "";
        document.getElementById("emailUsuario").value = "";
        fetchUsuarios();
    } else alert("Error al crear usuario");
});

// ------------------- CREAR GASTO -------------------
document.getElementById("formGasto")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const descripcion = document.getElementById("descGasto").value.trim();
    const monto = parseFloat(document.getElementById("montoGasto").value);
    if (!descripcion || isNaN(monto)) return alert("Completa descripción y monto válido");

    const res = await fetch(`${apiUrl}/gastos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descripcion, monto, usuarioId })
    });

    if (res.ok) {
        document.getElementById("descGasto").value = "";
        document.getElementById("montoGasto").value = "";
        fetchGastos(usuarioId);
    } else alert("Error al crear gasto");
});

// ------------------- CREAR INGRESO -------------------
document.getElementById("formIngreso")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const descripcion = document.getElementById("descIngreso").value.trim();
    const monto = parseFloat(document.getElementById("montoIngreso").value);
    if (!descripcion || isNaN(monto)) return alert("Completa descripción y monto válido");

    const res = await fetch(`${apiUrl}/ingresos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descripcion, monto, usuarioId })
    });

    if (res.ok) {
        document.getElementById("descIngreso").value = "";
        document.getElementById("montoIngreso").value = "";
        fetchIngresos(usuarioId);
    } else alert("Error al crear ingreso");
});
