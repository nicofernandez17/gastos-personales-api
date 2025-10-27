const apiUrl = "http://localhost:5235/api";

// ------------------- USUARIOS -------------------
async function fetchUsuarios() {
    const res = await fetch(`${apiUrl}/usuarios`);
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
}

async function fetchUsuario(id) {
    const res = await fetch(`${apiUrl}/usuarios/${id}`);
    const usuario = await res.json();
    document.getElementById("usuarioNombre").innerText = usuario.nombre;
}

// ------------------- GASTOS -------------------
async function fetchGastos(usuarioId) {
    const res = await fetch(`${apiUrl}/gastos?usuarioId=${usuarioId}`);
    const gastos = await res.json();
    const tbody = document.querySelector("#gastosTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    gastos.forEach(g => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${g.descripcion}</td><td>${g.monto}</td>`;
        tbody.appendChild(tr);
    });
}

// ------------------- INGRESOS -------------------
async function fetchIngresos(usuarioId) {
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
}

// ------------------- CREAR USUARIO -------------------
document.getElementById("formUsuario")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombreUsuario").value;
    const email = document.getElementById("emailUsuario").value;

    const res = await fetch(`${apiUrl}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email })
    });

    if (res.ok) {
        document.getElementById("nombreUsuario").value = "";
        document.getElementById("emailUsuario").value = "";
        fetchUsuarios(); // refresca la lista
    } else {
        alert("Error al crear usuario");
    }
});

// ------------------- CREAR GASTO -------------------
document.getElementById("formGasto")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const descripcion = document.getElementById("descGasto").value;
    const monto = parseFloat(document.getElementById("montoGasto").value);
    const usuarioId = new URLSearchParams(window.location.search).get("usuarioId");

    const res = await fetch(`${apiUrl}/gastos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descripcion, monto, usuarioId: parseInt(usuarioId) })
    });

    if (res.ok) {
        document.getElementById("descGasto").value = "";
        document.getElementById("montoGasto").value = "";
        fetchGastos(usuarioId);
    } else {
        alert("Error al crear gasto");
    }
});

// ------------------- CREAR INGRESO -------------------
document.getElementById("formIngreso")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const descripcion = document.getElementById("descIngreso").value;
    const monto = parseFloat(document.getElementById("montoIngreso").value);
    const usuarioId = new URLSearchParams(window.location.search).get("usuarioId");

    const res = await fetch(`${apiUrl}/ingresos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descripcion, monto, usuarioId: parseInt(usuarioId) })
    });

    if (res.ok) {
        document.getElementById("descIngreso").value = "";
        document.getElementById("montoIngreso").value = "";
        fetchIngresos(usuarioId);
    } else {
        alert("Error al crear ingreso");
    }
});

