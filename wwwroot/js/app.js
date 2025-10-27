const apiUrl = "http://localhost:5235/api";

async function fetchUsuarios() {
    const res = await fetch(`${apiUrl}/usuarios`);
    const usuarios = await res.json();
    const list = document.getElementById("usuariosList");
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

async function fetchGastos(usuarioId) {
    const res = await fetch(`${apiUrl}/gastos?usuarioId=${usuarioId}`);
    const gastos = await res.json();
    const tbody = document.querySelector("#gastosTable tbody");
    tbody.innerHTML = "";
    gastos.forEach(g => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${g.descripcion}</td><td>${g.monto}</td>`;
        tbody.appendChild(tr);
    });
}

async function fetchIngresos(usuarioId) {
    const res = await fetch(`${apiUrl}/ingresos?usuarioId=${usuarioId}`);
    const ingresos = await res.json();
    const tbody = document.querySelector("#ingresosTable tbody");
    tbody.innerHTML = "";
    ingresos.forEach(i => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${i.descripcion}</td><td>${i.monto}</td>`;
        tbody.appendChild(tr);
    });
}
