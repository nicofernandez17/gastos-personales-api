// Variable global para el gráfico
let gastosChartInstance = null;

// ------------------- FUNCIONES -------------------

// Renderiza el gráfico de torta con los gastos por categoría
async function renderGastosChart(usuarioId) {
    try {
        // Usamos el apiUrl global definido en app.js
        const res = await fetch(`${apiUrl}/gastos?usuarioId=${usuarioId}`);
        if (!res.ok) throw new Error("No se pudieron cargar los gastos");

        const gastos = await res.json();

        // Agrupar gastos por categoría
        const gastosPorCategoria = gastos.reduce((acc, g) => {
            acc[g.categoria] = (acc[g.categoria] || 0) + g.monto;
            return acc;
        }, {});

        const labels = Object.keys(gastosPorCategoria);
        const data = Object.values(gastosPorCategoria);

        const ctx = document.getElementById('gastosChart').getContext('2d');

        // Si ya existe un gráfico previo, destruirlo
        if (gastosChartInstance) {
            gastosChartInstance.destroy();
        }

        // Crear gráfico nuevo
        gastosChartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels,
                datasets: [{
                    label: 'Gastos por Categoría',
                    data,
                    backgroundColor: [
                        '#FFB800', // Amarillo Mercado Libre
                        '#FF6F61', // Naranja
                        '#3D405B', // Azul oscuro
                        '#81B29A', // Verde suave
                        '#F2CC8F'  // Beige
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const value = context.raw;
                                const percent = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${value} (${percent}%)`;
                            }
                        }
                    }
                }
            }
        });

    } catch (err) {
        console.error("Error cargando gráfico de gastos:", err);
    }
}

// ------------------- EVENTOS -------------------

// Al cargar la página, si hay usuarioId en la URL, renderizar gráfico
document.addEventListener("DOMContentLoaded", () => {
    const usuarioId = parseInt(new URLSearchParams(window.location.search).get("usuarioId"));
    if (!isNaN(usuarioId)) {
        renderGastosChart(usuarioId);
    }
});

