using Microsoft.AspNetCore.Mvc;
using GastosPersonalesApi.Models;

namespace GastosPersonalesApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IngresosController : ControllerBase
    {
        // Repositorio en memoria
        private static readonly List<Ingreso> ingresos = new()
        {
            new Ingreso { Id = 1, UsuarioId = 1, Monto = 10000, Fecha = DateTime.Now, Descripcion = "Sueldo" },
            new Ingreso { Id = 2, UsuarioId = 2, Monto = 5000, Fecha = DateTime.Now, Descripcion = "Venta" }
        };

        [HttpGet]
        public IActionResult GetAll() => Ok(ingresos);

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var ingreso = ingresos.FirstOrDefault(i => i.Id == id);
            if (ingreso == null) return NotFound();
            return Ok(ingreso);
        }

        [HttpGet("usuario/{usuarioId}")]
        public IActionResult GetByUsuario(int usuarioId)
        {
            var userIngresos = ingresos.Where(i => i.UsuarioId == usuarioId).ToList();
            return Ok(userIngresos);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Ingreso nuevo)
        {
            nuevo.Id = ingresos.Count > 0 ? ingresos.Max(i => i.Id) + 1 : 1;
            ingresos.Add(nuevo);
            return CreatedAtAction(nameof(GetById), new { id = nuevo.Id }, nuevo);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Ingreso actualizado)
        {
            var ingreso = ingresos.FirstOrDefault(i => i.Id == id);
            if (ingreso == null) return NotFound();

            ingreso.UsuarioId = actualizado.UsuarioId;
            ingreso.Monto = actualizado.Monto;
            ingreso.Fecha = actualizado.Fecha;
            ingreso.Descripcion = actualizado.Descripcion;

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var ingreso = ingresos.FirstOrDefault(i => i.Id == id);
            if (ingreso == null) return NotFound();

            ingresos.Remove(ingreso);
            return NoContent();
        }
    }
}