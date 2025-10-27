const apiUrl = "http://localhost:5235/api";

// Obtener usuarioId de la URL si existe
const usuarioId = parseInt(new URLSearchParams(window.location.search).get("usuarioId"));

// ------------------- FUNCIONES -------------------

// Cargar todos los usuarios
async function fetchUsuarios() {
    try {
        const res = await fetch(`${apiUrl}/usuarios`);
        const usuarios = await res.json();
        const list = document.getElementById("usuariosList");
        if (!list) return;

        list.innerHTML = "";
        usuarios.forEach(u => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerHTML = `
                ${u.nombre} 
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
    } catch (err) {
        alert(err.message);
    }
}

// Cargar gastos por usuario
async function fetchGastos(usuarioId) {
    try {
        const res = await fetch(`${apiUrl}/gastos?usuarioId=${usuarioId}`);
        const gastos = await res.json();
        const tbody = document.querySelector("#gastosTable tbody");
        if (!tbody) return;

        tbody.innerHTML = "";
        gastos.forEach(g => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${g.descripcion}</td><td>${g.monto}</td><td>${g.categoria}</td>`;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Error cargando gastos:", err);
    }
}

// Cargar ingresos por usuario
async function fetchIngresos(usuarioId) {
    try {
        const res = await fetch(`${apiUrl}/ingresos?usuarioId=${usuarioId}`);
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
        console.error("Error cargando ingresos:", err);
    }
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
    const nombre = document.getElementById("nombreUsuario").value;
    const email = document.getElementById("emailUsuario").value;

    try {
        const res = await fetch(`${apiUrl}/usuarios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, email })
        });

        if (res.ok) {
            document.getElementById("nombreUsuario").value = "";
            document.getElementById("emailUsuario").value = "";
            fetchUsuarios();
        } else {
            const error = await res.json();
            alert("Error al crear usuario: " + (error?.message || res.statusText));
        }
    } catch (err) {
        console.error("Error creando usuario:", err);
    }
});

// Crear gasto
document.getElementById("formGasto")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const descripcion = document.getElementById("descGasto").value;
    const monto = parseFloat(document.getElementById("montoGasto").value);
    const categoria = document.getElementById("categoriaGasto")?.value || "Otro";

    try {
        const res = await fetch(`${apiUrl}/gastos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ descripcion, monto, categoria, usuarioId })
        });

        if (res.ok) {
            document.getElementById("descGasto").value = "";
            document.getElementById("montoGasto").value = "";
            fetchGastos(usuarioId);
        } else {
            const error = await res.json();
            alert("Error al crear gasto: " + (error?.message || res.statusText));
        }
    } catch (err) {
        console.error("Error creando gasto:", err);
    }
});

// Crear ingreso
document.getElementById("formIngreso")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const descripcion = document.getElementById("descIngreso").value;
    const monto = parseFloat(document.getElementById("montoIngreso").value);

    try {
        const res = await fetch(`${apiUrl}/ingresos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ descripcion, monto, usuarioId })
        });

        if (res.ok) {
            document.getElementById("descIngreso").value = "";
            document.getElementById("montoIngreso").value = "";
            fetchIngresos(usuarioId);
        } else {
            const error = await res.json();
            alert("Error al crear ingreso: " + (error?.message || res.statusText));
        }
    } catch (err) {
        console.error("Error creando ingreso:", err);
    }
});

