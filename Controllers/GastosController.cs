using Microsoft.AspNetCore.Mvc;
using GastosPersonalesApi.Models;

namespace GastosPersonalesApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GastosController : ControllerBase
    {
        private static readonly List<Gasto> gastos = new()
        {
            new Gasto { Id = 1, UsuarioId = 1, Monto = 5000, Categoria = "Comida", Fecha = DateTime.Now, Descripcion = "Cena con amigos" },
            new Gasto { Id = 2, UsuarioId = 2, Monto = 2000, Categoria = "Transporte", Fecha = DateTime.Now, Descripcion = "Taxi" }
        };

        [HttpGet]
        public IActionResult GetAll() => Ok(gastos);

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var gasto = gastos.FirstOrDefault(g => g.Id == id);
            if (gasto == null) return NotFound();
            return Ok(gasto);
        }

        [HttpGet("usuario/{usuarioId}")]
        public IActionResult GetByUsuario(int usuarioId)
        {
            var userGastos = gastos.Where(g => g.UsuarioId == usuarioId).ToList();
            return Ok(userGastos);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Gasto nuevo)
        {
            nuevo.Id = gastos.Count > 0 ? gastos.Max(g => g.Id) + 1 : 1;
            gastos.Add(nuevo);
            return CreatedAtAction(nameof(GetById), new { id = nuevo.Id }, nuevo);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Gasto actualizado)
        {
            var gasto = gastos.FirstOrDefault(g => g.Id == id);
            if (gasto == null) return NotFound();

            gasto.UsuarioId = actualizado.UsuarioId;
            gasto.Monto = actualizado.Monto;
            gasto.Categoria = actualizado.Categoria;
            gasto.Fecha = actualizado.Fecha;
            gasto.Descripcion = actualizado.Descripcion;

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var gasto = gastos.FirstOrDefault(g => g.Id == id);
            if (gasto == null) return NotFound();

            gastos.Remove(gasto);
            return NoContent();
        }
    }
}