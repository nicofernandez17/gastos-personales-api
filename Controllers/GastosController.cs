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

        [HttpGet]
        public IActionResult GetAll()
        {
            var gastosDto = _context.Gastos
                .Select(g => DtoMapper.ToDto(g))
                .ToList();
            return Ok(gastosDto);
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
