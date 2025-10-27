using Microsoft.AspNetCore.Mvc;
using GastosPersonalesApi.Data;
using GastosPersonalesApi.Dtos;
using GastosPersonalesApi.Mappers;
using GastosPersonalesApi.Models;
using Microsoft.EntityFrameworkCore;

namespace GastosPersonalesApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UsuariosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var usuariosDto = _context.Usuarios
                .Include(u => u.Gastos)
                .Include(u => u.Ingresos)
                .Select(u => DtoMapper.ToDto(u))
                .ToList();
            return Ok(usuariosDto);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var usuario = _context.Usuarios
                .Include(u => u.Gastos)
                .Include(u => u.Ingresos)
                .FirstOrDefault(u => u.Id == id);

            if (usuario == null) return NotFound();
            return Ok(DtoMapper.ToDto(usuario));
        }

        [HttpPost]
        public IActionResult Create([FromBody] UsuarioDto dto)
        {
            var entity = DtoMapper.ToEntity(dto);
            _context.Usuarios.Add(entity);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = entity.Id }, DtoMapper.ToDto(entity));
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] UsuarioDto dto)
        {
            var usuario = _context.Usuarios.Find(id);
            if (usuario == null) return NotFound();

            usuario.Nombre = dto.Nombre;
            usuario.Email = dto.Email;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var usuario = _context.Usuarios.Find(id);
            if (usuario == null) return NotFound();

            _context.Usuarios.Remove(usuario);
            _context.SaveChanges();
            return NoContent();
        }
    }
}