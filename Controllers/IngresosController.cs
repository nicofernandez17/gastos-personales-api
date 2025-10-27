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
    public class IngresosController : ControllerBase
    {
        private readonly AppDbContext _context;
        public IngresosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll([FromQuery] int? usuarioId)
        {
            var query = _context.Ingresos.AsQueryable();

            if (usuarioId.HasValue)
            {
                query = query.Where(i => i.UsuarioId == usuarioId.Value);
            }

            var ingresosDto = query
                .Select(i => DtoMapper.ToDto(i))
                .ToList();

            return Ok(ingresosDto);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var ingreso = _context.Ingresos.Find(id);
            if (ingreso == null) return NotFound();
            return Ok(DtoMapper.ToDto(ingreso));
        }

        [HttpPost]
        public IActionResult Create([FromBody] IngresoDto dto)
        {
            var entity = DtoMapper.ToEntity(dto);
            _context.Ingresos.Add(entity);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = entity.Id }, DtoMapper.ToDto(entity));
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] IngresoDto dto)
        {
            var ingreso = _context.Ingresos.Find(id);
            if (ingreso == null) return NotFound();

            ingreso.Descripcion = dto.Descripcion;
            ingreso.Monto = dto.Monto;
            ingreso.UsuarioId = dto.UsuarioId;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var ingreso = _context.Ingresos.Find(id);
            if (ingreso == null) return NotFound();

            _context.Ingresos.Remove(ingreso);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
