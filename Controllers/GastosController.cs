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
    public class GastosController : ControllerBase
    {
        private readonly AppDbContext _context;
        public GastosController(AppDbContext context)
        {
            _context = context;
        }

        

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var gasto = _context.Gastos.Find(id);
            if (gasto == null) return NotFound();
            return Ok(DtoMapper.ToDto(gasto));
        }

        [HttpPost]
        public IActionResult Create([FromBody] GastoDto dto)
        {
            var entity = DtoMapper.ToEntity(dto);
            _context.Gastos.Add(entity);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = entity.Id }, DtoMapper.ToDto(entity));
        }

        [HttpGet]
        public IActionResult GetAll([FromQuery] int? usuarioId)
        {
            var query = _context.Gastos.AsQueryable();

            if (usuarioId.HasValue)
            {
                query = query.Where(g => g.UsuarioId == usuarioId.Value);
            }

            var gastosDto = query
                .Select(g => DtoMapper.ToDto(g))
                .ToList();

            return Ok(gastosDto);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] GastoDto dto)
        {
            var gasto = _context.Gastos.Find(id);
            if (gasto == null) return NotFound();

            gasto.Descripcion = dto.Descripcion;
            gasto.Monto = dto.Monto;
            gasto.UsuarioId = dto.UsuarioId;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var gasto = _context.Gastos.Find(id);
            if (gasto == null) return NotFound();

            _context.Gastos.Remove(gasto);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
