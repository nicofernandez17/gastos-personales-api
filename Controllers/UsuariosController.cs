using Microsoft.AspNetCore.Mvc;
using GastosPersonalesApi.Models;

namespace GastosPersonalesApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        // Repositorio en memoria
        private static readonly List<Usuario> usuarios = new()
        {
            new Usuario { Id = 1, Nombre = "Nicolás", Email = "nico@email.com" },
            new Usuario { Id = 2, Nombre = "Carlos", Email = "carlos@email.com" }
        };

        [HttpGet]
        public IActionResult GetAll() => Ok(usuarios);

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var usuario = usuarios.FirstOrDefault(u => u.Id == id);
            if (usuario == null) return NotFound();
            return Ok(usuario);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Usuario nuevo)
        {
            nuevo.Id = usuarios.Count > 0 ? usuarios.Max(u => u.Id) + 1 : 1;
            usuarios.Add(nuevo);
            return CreatedAtAction(nameof(GetById), new { id = nuevo.Id }, nuevo);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Usuario actualizado)
        {
            var usuario = usuarios.FirstOrDefault(u => u.Id == id);
            if (usuario == null) return NotFound();

            usuario.Nombre = actualizado.Nombre;
            usuario.Email = actualizado.Email;

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var usuario = usuarios.FirstOrDefault(u => u.Id == id);
            if (usuario == null) return NotFound();

            usuarios.Remove(usuario);
            return NoContent();
        }
    }
}